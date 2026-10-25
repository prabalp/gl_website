(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const q = new URLSearchParams(location.search);

  // Embedding options: ?embed=1  ?theme=dark|light  ?accent=%234f46e5
  if (q.get("embed") === "1") document.documentElement.classList.add("embed");
  if (["dark", "light"].includes(q.get("theme"))) document.documentElement.dataset.theme = q.get("theme");
  if (/^#[0-9a-f]{6}$/i.test(q.get("accent") || "")) document.documentElement.style.setProperty("--accent", q.get("accent"));

  // Safe DOM builder: every string goes through textContent, so audited-site content can never inject markup.
  const h = (tag, attrs, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v; else if (k === "style") el.style.cssText = v; else el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    return el;
  };

  const BAND_COPY = {
    ai: {
      critical: "AI assistants will struggle to find or cite you. The good news: the biggest fixes are usually small files and tags.",
      foundation: "Some basics are in place, but gaps keep you from being a confident source for AI answers.",
      good: "You’re readable and citable for most AI systems. A few upgrades would make you the default source.",
      excellent: "Excellent. AI systems can find, trust and quote your site.",
    },
    seo: {
      critical: "Serious technical or on-page problems are holding back search visibility.",
      foundation: "The fundamentals are partly there; several fixes will lift your rankings.",
      good: "Solid SEO foundations with a few improvements left.",
      excellent: "Excellent SEO health.",
    },
  };
  const ICON = { pass: "✓", warn: "!", fail: "✕", info: "i" };
  const STATUS_WORD = { pass: "Pass", warn: "Needs attention", fail: "Failing", info: "Note" };
  const COLORS = { critical: "var(--bad)", foundation: "var(--warn)", good: "var(--accent)", excellent: "var(--ok)" };

  let data = null, tab = "ai";

  function ring(score, band) {
    const r = 46, c = 2 * Math.PI * r, ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "104"); svg.setAttribute("height", "104"); svg.setAttribute("viewBox", "0 0 104 104");
    for (const [stroke, dash] of [["var(--line)", 0], [COLORS[band], c * (1 - score / 100)]]) {
      const circle = document.createElementNS(ns, "circle");
      for (const [k, v] of Object.entries({ cx: 52, cy: 52, r, fill: "none", "stroke-width": 9, "stroke-linecap": "round", stroke,
        "stroke-dasharray": c, "stroke-dashoffset": dash })) circle.setAttribute(k, v);
      svg.append(circle);
    }
    return h("div", { class: "ring", role: "img", "aria-label": `Score ${score} out of 100` }, svg, h("div", { class: "num" }, score));
  }

  function scoreCard(title, sub, area, s) {
    return h("div", { class: "score" }, ring(s.score, s.band),
      h("div", {}, h("h3", {}, title), h("span", { class: `band b-${s.band}` }, s.band), h("p", {}, BAND_COPY[area][s.band]), h("p", {}, sub)));
  }

  function checkRow(c) {
    return h("div", { class: "chk" },
      h("div", { class: `ic s-${c.status}`, title: STATUS_WORD[c.status], "aria-label": STATUS_WORD[c.status] }, ICON[c.status]),
      h("div", {}, h("b", {}, c.label), h("div", { class: "d" }, c.detail),
        c.fix ? h("div", { class: "f" }, h("b", {}, "Fix: "), c.fix) : null,
        c.source ? h("div", { class: "f" }, h("a", { href: c.source, target: "_blank", rel: "noopener" }, "Google’s documentation")) : null));
  }

  function grouped(checks) {
    const by = new Map();
    checks.forEach((c) => by.set(c.group, [...(by.get(c.group) || []), c]));
    const rank = { fail: 0, warn: 1, info: 2, pass: 3 };
    return [...by].map(([g, list]) => h("div", {}, h("h4", { class: "group" }, g),
      list.slice().sort((a, b) => rank[a.status] - rank[b.status]).map(checkRow)));
  }

  function copyBlock(text) {
    const btn = h("button", { class: "copy", type: "button" }, "Copy");
    btn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(text); btn.textContent = "Copied ✓"; } catch { btn.textContent = "Press Ctrl+C"; }
      setTimeout(() => (btn.textContent = "Copy"), 1800);
    });
    return h("div", { style: "position:relative" }, h("pre", {}, text), btn);
  }

  // Markdown brief for a coding agent: scores, prioritised fixes, every non-passing check, and the starter files.
  function agentPrompt(d) {
    const origin = new URL(d.url).origin, s = d.snippets || {}, L = [];
    const fence = (lang, text) => L.push("```" + lang, String(text).trim(), "```", "");
    const issues = (checks) => (checks || []).filter((c) => c.status === "fail" || c.status === "warn")
      .sort((a, b) => (a.status === b.status ? 0 : a.status === "fail" ? -1 : 1))
      .forEach((c) => {
        L.push(`- [${c.status === "fail" ? "FAIL" : "WARN"}] **${c.label}** (${c.group}): ${c.detail}`);
        if (c.fix) L.push(`  - Fix: ${c.fix}`);
        if (c.source) L.push(`  - Reference: ${c.source}`);
      });

    L.push(`# Improve AI readiness and SEO for ${d.url}`, "",
      "You are working in the codebase for this website. An automated audit found the issues below. " +
      "Fix them in the source code, starting with the highest-impact items. Don't change content meaning or visual design unless a fix requires it. " +
      "If an issue is controlled outside the codebase (CDN/firewall, hosting, DNS), tell me what to change instead of guessing.", "",
      `Current scores: AI readiness ${d.ai.score}/100 (${d.ai.band}), SEO ${d.seo.error ? "not checked" : `${d.seo.score}/100 (${d.seo.band})`}.`, "");

    if (d.priorities.length) {
      L.push("## Fix these first", "");
      d.priorities.forEach((p, i) => L.push(`${i + 1}. **${p.title}** [${p.impact} impact, ${p.area === "ai" ? "AI" : "SEO"}]`, `   - Problem: ${p.problem}`, `   - Fix: ${p.fix}`));
      L.push("");
    }
    L.push("## AI readiness issues", ""); issues(d.ai.checks); L.push("");
    if (d.ai.citability && d.ai.citability.gaps && d.ai.citability.gaps.length)
      L.push(`Content citability ${d.ai.citability.score}/100. Content gaps to address: ${d.ai.citability.gaps.join(", ")}.`, "");
    if (!d.seo.error) { L.push("## SEO issues", ""); issues(d.seo.checks); L.push(""); }

    const robotsBlocked = (b) => b.robots !== "default" && b.robots !== "allowed";
    const blocked = (d.ai.bots || []).filter((b) => robotsBlocked(b) || b.firewall_blocked);
    if (blocked.length) {
      L.push("## Blocked AI crawlers", "");
      blocked.forEach((b) => L.push(`- ${b.bot} (${b.kind === "search" ? "AI search" : "training"}): ${[robotsBlocked(b) && "blocked in robots.txt", b.firewall_blocked && "blocked by firewall/CDN"].filter(Boolean).join(", ")}`));
      L.push("", "Unblock at least the AI search bots unless there is a deliberate reason not to.", "");
    }

    L.push("## Starter files", "", "Adapt these to the real site (logo, social URLs, page list) rather than publishing placeholders. Merge with existing files if present.", "");
    if (s.robots_txt) { L.push(`### ${origin}/robots.txt`); fence("", s.robots_txt); }
    if (s.llms_txt) { L.push(`### ${origin}/llms.txt`); fence("markdown", s.llms_txt); }
    if (s.jsonld) { L.push("### Organization + WebSite JSON-LD (inside <head>)"); fence("html", s.jsonld); }
    L.push("When done, summarise what you changed and list anything I need to do manually.");
    return L.join("\n");
  }

  const panels = {
    ai(d) {
      const a = d.ai;
      return [
        h("div", { class: "bars" }, a.categories.map((c) => h("div", { class: "row" }, h("span", {}, c.label),
          h("div", { class: "track" }, h("div", { class: "fill", style: `width:${Math.round((100 * c.score) / c.max)}%` })), h("span", { class: "v" }, `${c.score}/${c.max}`)))),
        a.citability && a.citability.score != null
          ? h("p", { class: "note" }, `Content citability: ${a.citability.score}/100 (${a.citability.grade}).`,
              a.citability.gaps.length ? ` Biggest content gaps: ${a.citability.gaps.slice(0, 4).join(", ")}.` : "") : null,
        grouped(a.checks),
      ];
    },
    seo(d) {
      if (d.seo.error) return h("p", { class: "note" }, `We couldn’t run the SEO checks: ${d.seo.error}`);
      return grouped(d.seo.checks);
    },
    bots(d) {
      const rows = d.ai.bots.map((b) => h("tr", {}, h("td", {}, h("b", {}, b.bot)), h("td", {}, b.kind === "search" ? "AI search / answers" : "Model training"),
        h("td", {}, h("span", { class: `tag ${b.robots}` }, b.robots === "default" ? "Allowed by default" : b.robots === "allowed" ? "Explicitly allowed" : "Blocked")),
        h("td", {}, b.firewall_blocked ? h("span", { class: "tag blocked" }, "Blocked by firewall") : "")));
      return [h("p", { class: "note" }, d.ai.robots_found
          ? "What your robots.txt says about each crawler, plus whether your firewall actually lets them in. “Search” bots decide whether you appear in AI answers; training bots are optional."
          : "No robots.txt found. Nothing is blocked, but crawlers get no guidance either."),
        h("div", { style: "overflow-x:auto" }, h("table", {}, h("thead", {}, h("tr", {}, ["Crawler", "Used for", "robots.txt", "Firewall test"].map((x) => h("th", {}, x)))), h("tbody", {}, rows)))];
    },
    kit(d) {
      const s = d.snippets, origin = new URL(d.url).origin;
      return h("div", { class: "kit" },
        h("p", { class: "note" }, "Starter files generated from your site. Review them, then publish. Replace placeholders (logo, social URLs, page list) with your real ones."),
        h("h4", {}, `robots.txt → ${origin}/robots.txt`), h("p", {}, "Explicitly welcomes AI search bots and declares your sitemap."), copyBlock(s.robots_txt),
        h("h4", {}, `llms.txt → ${origin}/llms.txt`), h("p", {}, "A plain-language map of your site for AI systems (emerging convention, low effort)."), copyBlock(s.llms_txt),
        h("h4", {}, "Organization + WebSite JSON-LD → paste inside <head>"), h("p", {}, "Tells search engines and AI who you are and links your official profiles."), copyBlock(s.jsonld));
    },
  };

  function renderPanel() {
    const p = $("panel");
    p.replaceChildren(...[].concat(panels[tab](data)).flat().filter(Boolean));
    document.querySelectorAll("#tabs [role=tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
    p.setAttribute("aria-labelledby", `t-${tab}`);
    postHeight();
  }

  function render(d) {
    data = d;
    $("rtitle").textContent = (d.page && d.page.title) || new URL(d.url).hostname;
    $("rmeta").textContent = `${d.url} · checked just now${d.cached ? " (cached result)" : ""}`;
    $("scores").replaceChildren(scoreCard("AI readiness", "Can AI find, read and cite you?", "ai", d.ai), scoreCard("SEO health", "Classic search fundamentals", "seo", d.seo));
    $("priorities").replaceChildren(...d.priorities.map((p) => h("li", {}, h("h4", {}, p.title,
      h("span", { class: `pill ${p.impact}` }, `${p.impact} impact`), h("span", { class: "pill" }, p.area === "ai" ? "AI" : "SEO")),
      h("p", { class: "why" }, p.problem), h("p", { class: "fix" }, h("b", {}, "Fix: "), p.fix))));
    if (!d.priorities.length) $("priorities").replaceChildren(h("li", {}, h("h4", {}, "Nothing urgent. Nice work."), h("p", { class: "why" }, "No failing checks found.")));
    try { const u = new URL(d.cta_url); u.searchParams.set("utm_source", "ai-readiness-checker"); u.searchParams.set("utm_medium", "tool"); $("ctalink").href = u.href; } catch { $("cta").hidden = true; }
    tab = "ai"; renderPanel();
    $("hero").hidden = true; $("loading").hidden = true; $("results").hidden = false;
    document.title = `${d.ai.score}/100 AI readiness · ${new URL(d.url).hostname} | Growth Loop`;
    postHeight(); window.scrollTo({ top: 0 });
  }

  const MSGS = ["Fetching your page…", "Testing access as AI crawlers…", "Reading robots.txt and sitemap…", "Checking structured data and entities…", "Scoring content for citability…", "Running SEO checks…"];
  let timer;
  async function run(raw) {
    const err = $("error"); err.hidden = true;
    $("go").disabled = true; $("hero").hidden = true; $("results").hidden = true; $("loading").hidden = false;
    let i = 0; $("loadmsg").textContent = MSGS[0]; timer = setInterval(() => ($("loadmsg").textContent = MSGS[Math.min(++i, MSGS.length - 1)]), 1400);
    postHeight();
    try {
      const res = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: raw }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.detail || "Something went wrong. Please try again.");
      const u = new URL(location.href); u.searchParams.set("url", body.url); history.replaceState(null, "", u);
      render(body);
    } catch (e) {
      $("loading").hidden = true; $("hero").hidden = false; err.textContent = e.message || "Network error. Please try again."; err.hidden = false;
    } finally { clearInterval(timer); $("go").disabled = false; postHeight(); }
  }

  function postHeight() {
    if (window.parent !== window) requestAnimationFrame(() => parent.postMessage({ type: "mgl-checker-height", height: document.documentElement.scrollHeight }, "*"));
  }

  $("form").addEventListener("submit", (e) => { e.preventDefault(); run($("url").value); });
  $("again").addEventListener("click", () => {
    $("results").hidden = true; $("hero").hidden = false; $("url").value = ""; $("url").focus();
    history.replaceState(null, "", location.pathname + (q.get("embed") ? "?embed=1" : "")); document.title = "Free AI Readiness & SEO Checker | Growth Loop"; postHeight();
  });
  $("copylink").addEventListener("click", async (e) => {
    const b = e.currentTarget; try { await navigator.clipboard.writeText(location.href); b.textContent = "Copied ✓"; } catch { b.textContent = "Copy from address bar"; }
    setTimeout(() => (b.textContent = "Copy link"), 1800);
  });
  $("copyprompt").addEventListener("click", async (e) => {
    const b = e.currentTarget; if (!data) return;
    try { await navigator.clipboard.writeText(agentPrompt(data)); b.textContent = "Copied ✓ Paste into your agent"; } catch { b.textContent = "Copy failed, try again"; }
    setTimeout(() => (b.textContent = "Copy fixes for AI agent"), 2200);
  });
  const tabs = $("tabs");
  tabs.addEventListener("click", (e) => { const b = e.target.closest("[role=tab]"); if (b) { tab = b.dataset.tab; renderPanel(); } });
  tabs.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const all = [...tabs.querySelectorAll("[role=tab]")], i = all.findIndex((b) => b.dataset.tab === tab);
    const next = all[(i + (e.key === "ArrowRight" ? 1 : all.length - 1)) % all.length]; tab = next.dataset.tab; renderPanel(); next.focus();
  });
  window.addEventListener("resize", postHeight);
  if (q.get("url")) { $("url").value = q.get("url"); run(q.get("url")); }
})();
