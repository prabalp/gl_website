const CANONICAL_HOST = "mygrowthloop.com";

function visitorScheme(request) {
  const forwarded = (request.headers.get("x-forwarded-proto") || "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  if (forwarded === "http" || forwarded === "https") return forwarded;

  const cfVisitor = request.headers.get("cf-visitor");
  if (cfVisitor) {
    try {
      const scheme = JSON.parse(cfVisitor).scheme;
      if (scheme === "http" || scheme === "https") return scheme;
    } catch {
      /* ignore malformed cf-visitor */
    }
  }

  return new URL(request.url).protocol.replace(":", "");
}

// While true, every route returns the 404 page and only the assets the 404 page needs are served.
const SITE_LOCKED = false;
const LOCKED_ALLOWED_ASSETS = new Set([
  "/404.html",
  "/studio.css",
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-32.png",
  "/apple-touch-icon.png",
]);

async function lockedResponse(request, env) {
  const url = new URL(request.url);
  if (LOCKED_ALLOWED_ASSETS.has(url.pathname) && url.pathname !== "/404.html") {
    return env.ASSETS.fetch(request);
  }
  const page = await env.ASSETS.fetch(new Request(new URL("/404.html", url), { method: "GET" }));
  const headers = new Headers(page.headers);
  headers.set("x-robots-tag", "noindex, nofollow");
  headers.set("cache-control", "no-store");
  return new Response(request.method === "HEAD" ? null : page.body, { status: 404, headers });
}

const CHECKER_ORIGIN = "https://check.mygrowthloop.com";

async function proxyAudit(request) {
  try {
    const upstream = await fetch(CHECKER_ORIGIN + "/api/audit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: request.body,
    });
    const type = upstream.headers.get("content-type") || "";
    if (!upstream.ok && !type.includes("json")) {
      return Response.json(
        { detail: "The checker service is not reachable yet. Try again shortly." },
        { status: 503 }
      );
    }
    const headers = new Headers();
    if (type) headers.set("content-type", type);
    return new Response(upstream.body, { status: upstream.status, headers });
  } catch {
    return Response.json(
      { detail: "The checker service is not reachable yet. Try again shortly." },
      { status: 503 }
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();
    const onCanonical = host === CANONICAL_HOST || host === `www.${CANONICAL_HOST}`;

    if (onCanonical) {
      const scheme = visitorScheme(request);
      if (scheme === "http" || host === `www.${CANONICAL_HOST}`) {
        url.protocol = "https:";
        url.hostname = CANONICAL_HOST;
        return Response.redirect(url.toString(), 301);
      }
    }

    if (SITE_LOCKED) return lockedResponse(request, env);

    if (url.pathname === "/api/audit" && request.method === "POST") {
      return proxyAudit(request);
    }

    return env.ASSETS.fetch(request);
  },
};
