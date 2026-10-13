const DIRECTION_BY_LANDING: [string, string][] = [
  ["/ekspertiza-promyshlennoy-bezopasnosti", "EXPERTISE"],
  ["/audit-supb", "AUDIT_SUPB"],
  ["/tehnicheskoe-diagnostirovanie", "TECH_DIAG"],
  ["/proektirovanie", "DESIGN"],
  ["/inzhenernye-izyskaniya", "SURVEY"],
  ["/ekologiya", "ECOLOGY"],
  ["/nir", "RESEARCH"],
  ["/kadastrovye-raboty", "CADASTRAL"],
  ["/sudebnaya-ekspertiza", "FORENSIC"],
];

/** Направление статьи без направления — по первой ссылке на лендинг в тексте. */
export function detectDirection(html: string): string | undefined {
  return DIRECTION_BY_LANDING.find(([href]) => html.includes(`href="${href}"`))?.[1];
}
