import { debug } from "./debug";

/**
 * Resolve a possibly-relative URL (src, href, css url()) against a base URL.
 * Leaves absolute URLs, data: URLs and blob: URLs untouched, and normalises
 * protocol-relative URLs ("//host/x") to https.
 *
 * Handles: absolute URLs, "/image.jpg", "./image.jpg", "../image.jpg",
 * data URLs, blob URLs. This is deliberately NOT limited to element.src -
 * callers should also feed it srcset entries and CSS url(...) contents.
 */
export function resolveAssetUrl(url: string | null | undefined, baseUrl?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^(data|blob):/i.test(trimmed)) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (!baseUrl) return trimmed; // nothing safe to resolve against - leave as-is rather than break it

  try {
    return new URL(trimmed, baseUrl).toString();
  } catch (e) {
    debug("assets", "kunde inte tolka URL mot baseUrl", { trimmed, baseUrl, e });
    return trimmed;
  }
}

/** Rewrite a full `srcset` attribute value ("url descriptor, url descriptor, ..."). */
export function resolveSrcset(srcset: string | null | undefined, baseUrl?: string): string {
  if (!srcset) return "";
  return srcset
    .split(",")
    .map((del) => {
      const trimmad = del.trim();
      if (!trimmad) return "";
      const [url, ...resten] = trimmad.split(/\s+/);
      return [resolveAssetUrl(url, baseUrl), ...resten].join(" ");
    })
    .filter(Boolean)
    .join(", ");
}

const CSS_URL_RE = /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi;

/** Rewrite every `url(...)` occurrence inside a CSS string (inline style or <style> block). */
export function resolveCssUrls(css: string | null | undefined, baseUrl?: string): string {
  if (!css) return "";
  return css.replace(CSS_URL_RE, (_helMatch, citat: string, url: string) => {
    const upplost = resolveAssetUrl(url, baseUrl);
    return `url(${citat}${upplost}${citat})`;
  });
}

/**
 * Walk a parsed document and rewrite every asset-carrying attribute so that
 * images/backgrounds survive import -> edit -> save -> reload -> preview,
 * covering <img src>, srcset, <picture><source>, <video>/<source>,
 * inline SVG <use href>, CSS background-image (inline style + <style>).
 */
export function rewriteDocumentAssetUrls(doc: Document, baseUrl?: string): void {
  if (!baseUrl) return;

  doc.querySelectorAll<HTMLImageElement>("img[src]").forEach((img) => {
    img.setAttribute("src", resolveAssetUrl(img.getAttribute("src"), baseUrl));
  });

  doc.querySelectorAll<HTMLElement>("[srcset]").forEach((el) => {
    el.setAttribute("srcset", resolveSrcset(el.getAttribute("srcset"), baseUrl));
  });

  doc.querySelectorAll<HTMLSourceElement>("source[src]").forEach((el) => {
    el.setAttribute("src", resolveAssetUrl(el.getAttribute("src"), baseUrl));
  });

  doc.querySelectorAll<HTMLLinkElement>("link[href]").forEach((el) => {
    const rel = (el.getAttribute("rel") || "").toLowerCase();
    if (rel.includes("icon") || rel.includes("stylesheet")) {
      el.setAttribute("href", resolveAssetUrl(el.getAttribute("href"), baseUrl));
    }
  });

  doc.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
    const stil = el.getAttribute("style");
    if (stil && stil.includes("url(")) {
      el.setAttribute("style", resolveCssUrls(stil, baseUrl));
    }
  });

  doc.querySelectorAll("style").forEach((stilTag) => {
    if (stilTag.textContent && stilTag.textContent.includes("url(")) {
      stilTag.textContent = resolveCssUrls(stilTag.textContent, baseUrl);
    }
  });

  doc.querySelectorAll("use").forEach((el) => {
    const attr = el.hasAttribute("href") ? "href" : el.hasAttribute("xlink:href") ? "xlink:href" : null;
    if (!attr) return;
    const varde = el.getAttribute(attr);
    if (varde) el.setAttribute(attr, resolveAssetUrl(varde, baseUrl));
  });

  debug("assets", "URL:er omskrivna mot baseUrl", { baseUrl });
}