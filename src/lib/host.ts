export function getDomain(hostname: string): string | null {
  const host = hostname.split(":")[0];

  if (host.endsWith(".localhost")) {
    return host.replace(".localhost", "");
  }

  const delar = host.split(".");

  if (delar.length >= 3) {
    return delar[0];
  }

  return null;
}

export function getPageName(pathname: string): string {
  const sökväg = pathname.replace(/^\/+|\/+$/g, "");

  if (!sökväg) {
    return "index";
  }

  return sökväg;
}