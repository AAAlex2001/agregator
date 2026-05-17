import type { DocTocItem } from "@/source/shared/ui/DocToc";

export interface ParsedArticleHtml {
  html: string;
  toc: DocTocItem[];
}

export function extractToc(rawHtml: string): ParsedArticleHtml {
  const toc: DocTocItem[] = [];
  let index = 0;

  const html = rawHtml
    .replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (match, attrs, inner) => {
      const label = inner.replace(/<[^>]+>/g, "").trim();
      if (!label) return match;
      const id = `section-${index + 1}`;
      toc.push({ id, num: String(index + 1).padStart(2, "0"), label });
      index += 1;
      const cleanedAttrs = (attrs || "").replace(/\sid="[^"]*"/i, "");
      return `<h2${cleanedAttrs} id="${id}">${inner}</h2>`;
    })
    .replace(/<img(\s[^>]*?)?>/gi, (match, attrs) => {
      if (!attrs) return `<img loading="lazy" decoding="async">`;
      if (/loading=/.test(attrs)) return match;
      return `<img${attrs} loading="lazy" decoding="async">`;
    });

  return { html, toc };
}
