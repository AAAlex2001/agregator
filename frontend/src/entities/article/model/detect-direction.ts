/** Страницы направлений, по ссылкам на которые определяется тематика статьи. */
const DIRECTION_LINKS = [
  {
    href: "/ekspertiza-promyshlennoy-bezopasnosti",
    direction: "EXPERTISE",
  },
  {
    href: "/audit-supb",
    direction: "AUDIT_SUPB",
  },
  {
    href: "/tehnicheskoe-diagnostirovanie",
    direction: "TECH_DIAG",
  },
  {
    href: "/proektirovanie",
    direction: "DESIGN",
  },
  {
    href: "/inzhenernye-izyskaniya",
    direction: "SURVEY",
  },
  {
    href: "/ekologiya",
    direction: "ECOLOGY",
  },
  {
    href: "/nir",
    direction: "RESEARCH",
  },
  {
    href: "/kadastrovye-raboty",
    direction: "CADASTRAL",
  },
  {
    href: "/sudebnaya-ekspertiza",
    direction: "FORENSIC",
  },
];

/** Определяет направление статьи по ссылке на услугу, если API его не указал. */
export function detectArticleDirection(html: string): string | undefined {
  return DIRECTION_LINKS.find((item) => (
    html.includes(`href="${item.href}"`)
  ))?.direction;
}
