export function getDomain(hostname: string): string | null {
  const host = hostname.split(":")[0].toLowerCase();

  if (host.endsWith(".localhost")) {
    const subdomain = host.slice(0, -".localhost".length);

    return subdomain || null;
  }

  const delar = host.split(".");

  if (delar.length >= 3) {
    return delar[0];
  }

  return null;
}

export function getPageName(pathname: string): string {
  const path = pathname.replace(/^\/+|\/+$/g, "");

  if (!path) {
    return "index";
  }

  return path.split("/")[0];
}