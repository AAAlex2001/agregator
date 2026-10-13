/** Делит статью пополам по среднему подзаголовку — между частями встаёт блок регистрации. */
export function splitByMiddleHeading(html: string): [string, string] {
  const positions = [...html.matchAll(/<h2[\s>]/gi)].map((match) => match.index);
  if (positions.length < 4) return [html, ""];

  const cut = positions[Math.floor(positions.length / 2)];
  return [html.slice(0, cut), html.slice(cut)];
}

/** Отрезает картинку, которой заканчивается статья, — форма заявки встаёт перед ней. */
export function splitTrailingImage(html: string): [string, string] {
  const match = html.match(/(<(?:p|figure|div)[^>]*>\s*)?<img[\s\S]*$/i);
  if (!match || match.index === undefined) return [html, ""];

  const tail = html.slice(match.index);
  if (/<\/?(?:h2|h3|ul|ol|table)\b/i.test(tail)) return [html, ""];

  return [html.slice(0, match.index), tail];
}
