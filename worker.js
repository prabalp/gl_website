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

    return env.ASSETS.fetch(request);
  },
};
