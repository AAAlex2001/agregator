/** Страницы кабинета, которые открываются рядом с постоянным боковым меню. */
const SIDEBAR_ROUTES = [
  /^\/landing\/(?:blog|news|rtn|reviews)(?:\/.*)?$/,
  /^\/landing\/expert-contacts(?:\/.*)?$/,
  /^\/landing\/training(?:\/.*)?$/,
  /^\/customer\/orders(?:\/.*)?$/,
  /^\/customer\/reports(?:\/.*)?$/,
  /^\/expert\/orders(?:\/.*)?$/,
  /^\/expert\/reviews(?:\/.*)?$/,
  /^\/expert\/hazard(?:\/.*)?$/,
  /^\/expert\/lining(?:\/.*)?$/,
  /^\/expert\/room$/,
  /^\/expert-reviews(?:\/.*)?$/,
  /^\/experts\/[^/]+\/orders$/,
  /^\/labor(?:\/.*)?$/,
  /^\/responses(?:\/.*)?$/,
  /^\/tech-expert$/,
  /^\/training(?:\/.*)?$/,
  /^\/zepb-registry$/,
  /^\/settings$/,
  /^\/chat(?:\/.*)?$/,
  /^\/archive(?:\/.*)?$/,
  /^\/support(?:\/.*)?$/,
  /^\/blitz(?:-audit)?(?:\/.*)?$/,
  /^\/commission$/,
  /^\/notifications(?:\/.*)?$/,
];

/** Определяет страницы публикаций: у них своя раскладка без крошек и вкладок раздела. */
export function isPostsPage(pathname: string): boolean {
  return pathname === "/posts" || pathname.startsWith("/posts/");
}

/** Определяет, показывать ли рядом со страницей боковое меню кабинета. */
export function hasCabinetSidebar(pathname: string): boolean {
  return isPostsPage(pathname) || SIDEBAR_ROUTES.some((route) => route.test(pathname));
}
