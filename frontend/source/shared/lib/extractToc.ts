import type { DocTocItem } from "@/source/shared/ui/DocToc";

export interface ParsedHtml {
  html: string;
  toc: DocTocItem[];
}

/**
 * Нумерует h2 как якоря для оглавления (с firstNumber, если выше есть свои разделы),
 * делает картинки ленивыми и оборачивает таблицы для горизонтальной прокрутки.
 */
export function extractToc(rawHtml: string, firstNumber = 1): ParsedHtml {
  const toc: DocTocItem[] = [];

  const html = rawHtml
    .replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (match, attrs, inner) => {
      const label = inner.replace(/<[^>]+>/g, "").trim();
      if (!label) return match;
      const number = firstNumber + toc.length;
      const id = `section-${number}`;
      toc.push({ id, num: String(number).padStart(2, "0"), label });
      const keptAttrs = (attrs || "").replace(/\sid="[^"]*"/i, "");
      return `<h2${keptAttrs} id="${id}">${inner}</h2>`;
    })
    .replace(/<img(\s[^>]*?)?>/gi, (match, attrs) => {
      if (!attrs) return `<img loading="lazy" decoding="async">`;
      if (/loading=/.test(attrs)) return match;
      return `<img${attrs} loading="lazy" decoding="async">`;
    })
    .replace(/<table(\s[^>]*)?>/gi, (_match, attrs) => `<div class="table-wrap"><table${attrs || ""}>`)
    .replace(/<\/table>/gi, "</table></div>");

  return { html, toc };
}
