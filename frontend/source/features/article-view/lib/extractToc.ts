import type { DocTocItem } from "@/source/shared/ui/DocToc";

export interface ParsedArticleHtml {
  html: string;
  toc: DocTocItem[];
}

export function extractToc(rawHtml: string): ParsedArticleHtml {
  const toc: DocTocItem[] = [];

  const html = rawHtml
    .replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (match, attrs, inner) => {
      const label = inner.replace(/<[^>]+>/g, "").trim();
      if (!label) return match;
      const number = toc.length + 1;
      const id = `section-${number}`;
      toc.push({ id, num: String(number).padStart(2, "0"), label });
      const keptAttrs = (attrs || "").replace(/\sid="[^"]*"/i, "");
      return `<h2${keptAttrs} id="${id}">${inner}</h2>`;
    })
    .replace(/<img(\s[^>]*?)?>/gi, (match, attrs) => {
      if (!attrs) return `<img loading="lazy" decoding="async">`;
      if (/loading=/.test(attrs)) return match;
      return `<img${attrs} loading="lazy" decoding="async">`;
    });

  return { html, toc };
}
