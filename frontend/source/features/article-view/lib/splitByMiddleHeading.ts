/** Делит статью пополам по среднему подзаголовку — между частями встаёт CTA-блок. */
export function splitByMiddleHeading(html: string): [string, string] {
  const positions: number[] = [];
  const pattern = /<h2[\s>]/gi;
  let match = pattern.exec(html);
  while (match) {
    positions.push(match.index);
    match = pattern.exec(html);
  }

  if (positions.length < 4) return [html, ""];

  const cut = positions[Math.floor(positions.length / 2)];
  return [html.slice(0, cut), html.slice(cut)];
}
