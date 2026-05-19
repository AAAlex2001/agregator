"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatArticleDate } from "../../lib/formatArticleDate";
import type { ArticleKind } from "../../api/article.api";
import s from "./ArticleCard.module.scss";

export interface ArticleCardProps {
  kind: ArticleKind;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  tags: string[];
  published_at: string | null;
}

export function ArticleCard({ kind, slug, title, excerpt, cover_image, tags, published_at }: ArticleCardProps) {
  const pathname = usePathname();
  const prefix = pathname?.startsWith("/landing") ? "/landing" : "";
  const href = `${prefix}/${kind === "news" ? "news" : "blog"}/${slug}`;
  const badge = tags[0] || (kind === "news" ? "Новость" : "Статья");

  return (
    <Link href={href} className={s.card} aria-label={title}>
      <div className={s.body}>
        <div className={s.cover}>
          {cover_image ? (
            <Image src={cover_image} alt={title} fill sizes="(max-width: 768px) 100vw, 280px" className={s.coverImage} />
          ) : null}
          <span className={s.badge}>{badge}</span>
        </div>
        <div className={s.info}>
          <h3 className={s.title}>{title}</h3>
          {excerpt ? <p className={s.excerpt}>{excerpt}</p> : null}
        </div>
      </div>
      <div className={s.footer}>
        <time className={s.date} dateTime={published_at || undefined}>
          {formatArticleDate(published_at)}
        </time>
        <span className={s.read}>
          Читать
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
