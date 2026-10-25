#!/usr/bin/env python3
"""Build the Growth Loop blog from Markdown.

    python3 tools/blog/build.py

Reads blog/posts/*.md and writes:
  blog/<slug>.html    one page per post
  blog/index.html     the blog listing
  sitemap.xml         blog URLs between <!-- blog:start --> and <!-- blog:end -->
  llms.txt            a "## Blog" section between the same markers

The site navbar and footer are copied from outbound.html at build time, so the
blog always matches the rest of the site. No third-party packages are needed.

Post format: front matter between --- lines, then Markdown.

    ---
    title: How to get your brand cited in ChatGPT
    description: One or two sentences for search results and social cards.
    slug: get-cited-in-chatgpt
    date: 2026-10-25
    updated: 2026-10-25
    category: AI Visibility
    author: Growth Loop
    related: geo, inbound, ai-readiness-tool
    ---

Markdown supported: # headings, paragraphs, **bold**, *italic*, `code`,
[links](url), - and 1. lists, > quotes, | tables |, ``` code fences ```, ---,
raw HTML lines, and two boxes:

    :::tldr            :::cta Button text | /link.html
    - key point        A sentence above the button.
    :::                :::

A section whose H2 contains "Frequently asked" or "FAQ" becomes FAQ structured
data: each ### is a question and the text below it is the answer.
"""
import datetime
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
POSTS = ROOT / "blog" / "posts"
OUT = ROOT / "blog"
SITE = "https://mygrowthloop.com"
CAL = "https://calendly.com/prabal-growthloopconsulting/30min"

RELATED = {
    "outbound": ("Outbound Systems", "Go find the people who need you", "/outbound.html"),
    "inbound": ("Inbound Systems", "Make the market find you", "/inbound.html"),
    "geo": ("AI Visibility", "Get cited in AI answers", "/geo.html"),
    "voice-agents": ("AI Voice Agents", "Calls answered around the clock", "/voice-agents.html"),
    "ai-infrastructure": ("Internal AI", "Put AI to work inside your business", "/ai-infrastructure.html"),
    "approach": ("Our Approach", "The Growth Loop cycle", "/approach.html"),
    "b2b": ("B2B Teams", "Predictable B2B pipeline", "/b2b.html"),
    "ecommerce": ("Ecommerce", "Growth you can predict", "/ecommerce.html"),
    "speaker": ("Speakers & Founders", "Grow beyond word-of-mouth", "/speaker.html"),
    "investors": ("Investors", "Find companies before the market does", "/investors.html"),
    "ai-readiness-tool": ("Free Tool", "Check your AI readiness", "/ai-readiness-tool.html"),
}


# ---------- Markdown ----------

def slugify(text):
    text = re.sub(r"<[^>]+>", "", text).lower()
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")[:80]


def inline(text):
    """Inline Markdown. Raw HTML tags pass through untouched."""
    parts = re.split(r"(`[^`]+`)", text)
    out = []
    for part in parts:
        if part.startswith("`") and part.endswith("`") and len(part) > 1:
            out.append("<code>" + html.escape(part[1:-1]) + "</code>")
            continue
        part = re.sub(r"&(?![a-zA-Z#][a-zA-Z0-9]*;)", "&amp;", part)
        part = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", part)
        part = re.sub(r"(?<![\*\w])\*(?!\s)(.+?)(?<!\s)\*(?![\*\w])", r"<em>\1</em>", part)

        def link(m):
            label, url = m.group(1), m.group(2)
            ext = url.startswith("http") and SITE not in url
            attrs = ' target="_blank" rel="noopener"' if ext else ""
            return f'<a href="{html.escape(url, quote=True)}"{attrs}>{label}</a>'

        part = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", link, part)
        out.append(part)
    return "".join(out)


def markdown(md, toc=None):
    lines = md.replace("\r\n", "\n").split("\n")
    out, i = [], 0
    seen_ids = set()

    def heading_id(text):
        base = slugify(text) or "section"
        hid, n = base, 2
        while hid in seen_ids:
            hid, n = f"{base}-{n}", n + 1
        seen_ids.add(hid)
        return hid

    while i < len(lines):
        line = lines[i]
        s = line.strip()
        if not s:
            i += 1
            continue
        if s.startswith(":::"):  # custom boxes
            kind = s[3:].strip()
            body = []
            i += 1
            while i < len(lines) and lines[i].strip() != ":::":
                body.append(lines[i])
                i += 1
            i += 1
            inner = markdown("\n".join(body))
            if kind.startswith("tldr"):
                out.append(f'<div class="st-tldr"><p>Key takeaways</p>{inner}</div>')
            elif kind.startswith("cta"):
                label, _, url = kind[3:].partition("|")
                out.append(f'<div class="st-inline-cta">{inner}<a class="st-btn st-btn-ink" href="{url.strip()}">{html.escape(label.strip())} <i data-lucide="arrow-right"></i></a></div>')
            else:
                out.append(f"<div>{inner}</div>")
            continue
        if s.startswith("```"):
            code = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code.append(lines[i])
                i += 1
            i += 1
            out.append("<pre><code>" + html.escape("\n".join(code)) + "</code></pre>")
            continue
        m = re.match(r"^(#{1,4})\s+(.*)$", s)
        if m:
            level, text = len(m.group(1)), m.group(2).strip()
            level = max(level, 2)  # the page owns the only h1
            hid = heading_id(text)
            if level == 2 and toc is not None:
                toc.append((hid, re.sub(r"<[^>]+>", "", inline(text))))
            out.append(f'<h{level} id="{hid}">{inline(text)}</h{level}>')
            i += 1
            continue
        if re.match(r"^(-{3,}|\*{3,})$", s):
            out.append("<hr>")
            i += 1
            continue
        if s.startswith("<"):  # raw HTML block
            block = []
            while i < len(lines) and lines[i].strip():
                block.append(lines[i])
                i += 1
            out.append("\n".join(block))
            continue
        if s.startswith(">"):
            quote = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                quote.append(lines[i].strip()[1:].strip())
                i += 1
            out.append("<blockquote>" + markdown("\n".join(quote)) + "</blockquote>")
            continue
        if s.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")])
                i += 1
            head, body = rows[0], [r for r in rows[1:] if not all(re.match(r"^:?-+:?$", c) for c in r)]
            t = "<table><thead><tr>" + "".join(f"<th>{inline(c)}</th>" for c in head) + "</tr></thead><tbody>"
            t += "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in body)
            out.append(t + "</tbody></table>")
            continue
        if re.match(r"^([-*]|\d+\.)\s+", s):
            ordered = bool(re.match(r"^\d+\.", s))
            items = []
            while i < len(lines) and lines[i].strip():
                t = lines[i].strip()
                mm = re.match(r"^([-*]|\d+\.)\s+(.*)$", t)
                if mm:
                    items.append(mm.group(2))
                elif items:
                    items[-1] += " " + t
                i += 1
            tag = "ol" if ordered else "ul"
            out.append(f"<{tag}>" + "".join(f"<li>{inline(x)}</li>" for x in items) + f"</{tag}>")
            continue
        para = []
        while i < len(lines) and lines[i].strip() and not re.match(r"^(#{1,4}\s|>|\||```|:::|([-*]|\d+\.)\s)", lines[i].strip()):
            para.append(lines[i].strip())
            i += 1
        out.append("<p>" + inline(" ".join(para)) + "</p>")
    return "\n".join(out)


def faq_pairs(md):
    """Questions (###) and answers inside the FAQ H2 section."""
    m = re.search(r"^##\s+[^\n]*(frequently asked|faq)[^\n]*\n(.*?)(?=^##\s|\Z)", md, re.I | re.M | re.S)
    if not m:
        return []
    pairs = []
    for qm in re.finditer(r"^###\s+(.+?)\n(.*?)(?=^###\s|\Z)", m.group(2), re.M | re.S):
        answer = re.sub(r"<[^>]+>", "", markdown(qm.group(2).strip()))
        pairs.append((qm.group(1).strip(), " ".join(answer.split())))
    return pairs


# ---------- Site chrome ----------

def absolutise(fragment):
    """Make relative links in the copied navbar/footer work from /blog/."""
    def fix(m):
        url = m.group(2)
        if re.match(r"^(https?:|mailto:|tel:|/|#)", url):
            return m.group(0)
        return f'{m.group(1)}"/{url}"'
    return re.sub(r'(href=)"([^"]*)"', fix, fragment)


def chrome():
    src = (ROOT / "outbound.html").read_text()
    a = src.index("<nav", src.index("<body"))
    nav = src[a: src.index("</nav>", a) + 6]
    f = src.index('<footer class="st-footer">')
    footer = src[f: src.index("</footer>", f) + 9]
    heads = re.findall(r'<script src="https://[^"]+"></script>', src[: src.index("</head>")])
    return absolutise(nav), absolutise(footer), "\n    ".join(heads)


def head(title, description, url, schema, scripts, og_type="article"):
    t, d = html.escape(title), html.escape(description)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{t}</title>
    <meta name="description" content="{d}">
    <link rel="canonical" href="{url}">
    <meta property="og:type" content="{og_type}">
    <meta property="og:site_name" content="Growth Loop">
    <meta property="og:title" content="{t}">
    <meta property="og:description" content="{d}">
    <meta property="og:url" content="{url}">
    <meta property="og:image" content="{SITE}/og.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{t}">
    <meta name="twitter:description" content="{d}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
    <link rel="icon" href="/favicon.ico" sizes="48x48">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <script type="application/ld+json">
{json.dumps(schema, indent=2, ensure_ascii=False)}
    </script>
    {scripts}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/studio.css">
</head>
<body class="studio antialiased">
"""


def cta_section(heading, para):
    return f"""
    <section id="contact" class="st-dark st-section st-cta">
        <div class="st-wrap">
            <span class="st-label">Start a project</span>
            <h2>{heading}</h2>
            <p class="st-muted">{para}</p>
            <a href="{CAL}" target="_blank" rel="noopener" class="st-btn st-btn-lime">Book a free consultation <i data-lucide="arrow-right"></i></a>
        </div>
    </section>
"""


TAIL_SCRIPT = """
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (window.lucide) lucide.createIcons();
            // Highlight the section being read in the article contents list
            const links = [...document.querySelectorAll('.st-article-toc a')];
            const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
            const io = new IntersectionObserver((entries) => entries.forEach((e) => {
                if (!e.isIntersecting) return;
                links.forEach((a) => a.classList.remove('is-active'));
                const a = byId.get(e.target.id);
                if (a) a.classList.add('is-active');
            }), { rootMargin: '0px 0px -70% 0px' });
            byId.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
        });
    </script>
</body>
</html>
"""


# ---------- Build ----------

def parse(path):
    raw = path.read_text()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
    if not m:
        raise SystemExit(f"{path.name}: missing front matter")
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    for key in ("title", "description", "slug", "date"):
        if not meta.get(key):
            raise SystemExit(f"{path.name}: front matter needs '{key}'")
    meta.setdefault("updated", meta["date"])
    meta.setdefault("category", "Insights")
    meta.setdefault("author", "Growth Loop")
    meta["related"] = [r.strip() for r in meta.get("related", "").split(",") if r.strip() in RELATED]
    meta["body"] = m.group(2)
    words = len(re.findall(r"\w+", re.sub(r"<[^>]+>", "", m.group(2))))
    meta["minutes"] = max(1, round(words / 220))
    return meta


def nice_date(iso):
    return datetime.date.fromisoformat(iso).strftime("%-d %B %Y")


def build_post(p, nav, footer, scripts):
    url = f"{SITE}/blog/{p['slug']}"
    toc = []
    body = markdown(p["body"], toc)
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {"@type": "BlogPosting", "@id": url + "#article", "headline": p["title"], "description": p["description"],
             "datePublished": p["date"], "dateModified": p["updated"], "mainEntityOfPage": url,
             "image": f"{SITE}/og.png", "articleSection": p["category"],
             "author": {"@type": "Organization", "name": p["author"], "url": SITE + "/"},
             "publisher": {"@id": SITE + "/#org"}},
            {"@type": "Organization", "@id": SITE + "/#org", "name": "Growth Loop", "url": SITE + "/",
             "logo": f"{SITE}/apple-touch-icon.png"},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
                {"@type": "ListItem", "position": 2, "name": "Blog", "item": SITE + "/blog/"},
                {"@type": "ListItem", "position": 3, "name": p["title"], "item": url}]},
        ],
    }
    faqs = faq_pairs(p["body"])
    if faqs:
        schema["@graph"].append({"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]})
    toc_html = "".join(f'<li><a href="#{hid}">{html.escape(text)}</a></li>' for hid, text in toc)
    related = "".join(
        f'<a href="{RELATED[r][2]}"><small>{RELATED[r][0]}</small><b>{RELATED[r][1]}</b></a>' for r in p["related"])
    updated = "" if p["updated"] == p["date"] else f'<span>Updated {nice_date(p["updated"])}</span>'
    page = head(f'{p["title"]} | Growth Loop', p["description"], url, schema, scripts)
    page += "\n    " + nav + f"""

    <main>
        <header class="st-article-hero">
            <div class="st-wrap">
                <nav class="st-crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/blog/">Blog</a><span>/</span><span>{html.escape(p['category'])}</span></nav>
                <h1>{html.escape(p['title'])}</h1>
                <p class="st-dek">{html.escape(p['description'])}</p>
                <div class="st-post-meta"><span>By {html.escape(p['author'])}</span><span>{nice_date(p['date'])}</span>{updated}<span>{p['minutes']} min read</span></div>
            </div>
        </header>
        <div class="st-wrap st-article-wrap">
            <aside class="st-article-toc" aria-label="Contents"><p>In this article</p><ol>{toc_html}</ol></aside>
            <article class="st-article">
{body}
            </article>
        </div>
"""
    if related:
        page += f"""        <section class="st-section" style="padding-top:64px;padding-bottom:64px;border-top:1px solid var(--ink)">
            <div class="st-wrap">
                <span class="st-label" style="margin-bottom:24px">Related</span>
                <div class="st-next" style="--n:{len(p['related'])}">{related}</div>
            </div>
        </section>
"""
    page += "    </main>\n" + cta_section("Want this done<br><span class=\"st-mark\">for you?</span>",
                                         "We build the systems behind what we write about. Book a 30-minute call and we'll map what would move the needle for your business.")
    page += "\n    " + footer + TAIL_SCRIPT
    (OUT / f"{p['slug']}.html").write_text(page)


def build_index(posts, nav, footer, scripts):
    url = f"{SITE}/blog/"
    schema = {"@context": "https://schema.org", "@type": "Blog", "@id": url, "name": "Growth Loop Blog", "url": url,
              "publisher": {"@type": "Organization", "name": "Growth Loop", "url": SITE + "/"},
              "blogPost": [{"@type": "BlogPosting", "headline": p["title"], "url": f"{SITE}/blog/{p['slug']}",
                            "datePublished": p["date"]} for p in posts]}
    cards = "".join(f"""
                    <a class="st-post-card" href="/blog/{p['slug']}.html">
                        <div class="st-post-meta"><span>{html.escape(p['category'])}</span><span>{nice_date(p['date'])}</span><span>{p['minutes']} min read</span></div>
                        <h2>{html.escape(p['title'])}</h2>
                        <p>{html.escape(p['description'])}</p>
                        <span class="st-cell-more">Read the article <i data-lucide="arrow-right"></i></span>
                    </a>""" for p in posts)
    page = head("Blog: Growth Systems, AI Search & Automation | Growth Loop",
                "Practical, researched answers to the questions founders and growth teams ask about outbound, inbound, AI search visibility, AI voice agents and automation.",
                url, schema, scripts, og_type="website")
    page += "\n    " + nav + f"""

    <main>
        <section class="st-phero">
            <div class="st-wrap">
                <span class="st-label">Growth Loop Blog</span>
                <h1>Straight answers to <span class="st-mark">real questions.</span></h1>
                <div class="st-hero-foot">
                    <p class="st-muted">Researched, practical guides on the questions founders and growth teams actually ask about outbound, inbound, AI search and automation. No fluff, sources included.</p>
                    <div class="st-hero-ctas">
                        <a href="/ai-readiness-tool.html" class="st-btn st-btn-ink">Check your AI readiness <i data-lucide="arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </section>
        <section class="st-section">
            <div class="st-wrap">
                <div class="st-posts">{cards}
                </div>
            </div>
        </section>
    </main>
"""
    page += cta_section("Rather we build it<br><span class=\"st-mark\">for you?</span>",
                        "Book a 30-minute call and we'll map the growth systems that would move the needle for your business.")
    page += "\n    " + footer + TAIL_SCRIPT
    (OUT / "index.html").write_text(page)


def replace_block(text, block, before):
    start, end = "<!-- blog:start -->", "<!-- blog:end -->"
    new = f"{start}\n{block}\n{end}"
    if start in text:
        return re.sub(re.escape(start) + ".*?" + re.escape(end), lambda _: new, text, flags=re.S)
    i = text.rindex(before)
    return text[:i] + new + "\n" + text[i:]


def update_sitemap(posts):
    path = ROOT / "sitemap.xml"
    latest = max([p["updated"] for p in posts] or [datetime.date.today().isoformat()])
    urls = [f"  <url>\n    <loc>{SITE}/blog/</loc>\n    <lastmod>{latest}</lastmod>\n  </url>"]
    urls += [f"  <url>\n    <loc>{SITE}/blog/{p['slug']}</loc>\n    <lastmod>{p['updated']}</lastmod>\n  </url>" for p in posts]
    path.write_text(replace_block(path.read_text(), "\n".join(urls), "</urlset>"))


def update_llms(posts):
    path = ROOT / "llms.txt"
    lines = ["## Blog", "", f"- [Blog]({SITE}/blog/): researched answers about growth systems, AI search and automation"]
    lines += [f"- [{p['title']}]({SITE}/blog/{p['slug']}): {p['description']}" for p in posts]
    text = path.read_text()
    marker = "## Optional"
    path.write_text(replace_block(text, "\n".join(lines) + "\n", marker if marker in text else text[-1:]))


def main():
    posts = sorted((parse(f) for f in POSTS.glob("*.md")), key=lambda p: p["date"], reverse=True)
    nav, footer, scripts = chrome()
    for p in posts:
        build_post(p, nav, footer, scripts)
    build_index(posts, nav, footer, scripts)
    update_sitemap(posts)
    update_llms(posts)
    print(f"Built {len(posts)} post(s): " + ", ".join(p["slug"] for p in posts))


if __name__ == "__main__":
    main()
