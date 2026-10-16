import type { DocumentTocItem } from "@/shared/ui/document-toc";

/** HTML с якорями разделов и пункты соответствующего оглавления. */
interface HtmlWithTableOfContents {
  html: string;
  toc: DocumentTocItem[];
}

/** Нумерует h2, добавляет ленивую загрузку изображений и прокрутку таблиц. */
export function extractToc(
  rawHtml: string,
  firstNumber = 1,
): HtmlWithTableOfContents {
  const toc: DocumentTocItem[] = [];

  const html = rawHtml
    .replace(
      /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi,
      (match: string, attributes: string | undefined, inner: string) => {
        const label = inner.replace(/<[^>]+>/g, "").trim();

        if (!label) {
          return match;
        }

        const number = firstNumber + toc.length;
        const id = `section-${number}`;
        const keptAttributes = (attributes || "").replace(/\sid="[^"]*"/i, "");

        toc.push({
          id,
          num: String(number).padStart(2, "0"),
          label,
        });

        return `<h2${keptAttributes} id="${id}">${inner}</h2>`;
      },
    )
    .replace(
      /<img(\s[^>]*?)?>/gi,
      (match: string, attributes: string | undefined) => {
        if (!attributes) {
          return '<img loading="lazy" decoding="async">';
        }

        if (/loading=/.test(attributes)) {
          return match;
        }

        return `<img${attributes} loading="lazy" decoding="async">`;
      },
    )
    .replace(
      /<table(\s[^>]*)?>/gi,
      '<div class="table-wrap"><table$1>',
    )
    .replace(/<\/table>/gi, "</table></div>");

  return { html, toc };
}
