const FULLSCREEN_ROUTES = [
  /^\/chat(?:\/.*)?$/,
  /^\/expert\/room$/,
  /^\/support(?:\/.*)?$/,
];

export function isFullScreenRoute(pathname: string): boolean {
  return FULLSCREEN_ROUTES.some((pattern) => pattern.test(pathname));
}
