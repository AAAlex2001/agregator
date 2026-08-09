export function buildLandingHref(basePath: string, href: string): string {
  return href === "/" ? basePath || "/" : `${basePath}${href}`;
}
