/** Адрес разъяснения в публичной части («») или в кабинете («/landing»). */
export function rtnHref(basePath: string, slug: string): string {
  return `${basePath}/rtn/${slug}`;
}
