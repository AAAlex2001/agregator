export function scrollToAnchor(href: string, extraOffset = 24) {
  const element = document.querySelector<HTMLElement>(href);

  if (!element) {
    return;
  }

  const header = document.querySelector<HTMLElement>("header");
  const headerHeight = header?.getBoundingClientRect().height ?? 0;
  const targetTop = element.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: "smooth",
  });
}