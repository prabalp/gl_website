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

    if (url.pathname === "/api/audit" && request.method === "POST") {
      return proxyAudit(request);
    }

    return env.ASSETS.fetch(request);
  },
};
