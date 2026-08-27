/** Отрезает картинку, которой заканчивается статья, — форма заявки встаёт перед ней. */
export function splitTrailingImage(html: string): [string, string] {
  const match = html.match(/(<(?:p|figure|div)[^>]*>\s*)?<img[\s\S]*$/i);
  if (!match || match.index === undefined) return [html, ""];

  const tail = html.slice(match.index);
  if (/<\/?(?:h2|h3|ul|ol|table)\b/i.test(tail)) return [html, ""];

  return [html.slice(0, match.index), tail];
}
