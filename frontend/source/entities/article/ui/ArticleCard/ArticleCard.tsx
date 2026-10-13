"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EyeIcon } from "@/source/shared/ui/icons";
import { ThumbDownIcon } from "@/source/shared/ui/icons/ThumbDownIcon";
import { ThumbUpIcon } from "@/source/shared/ui/icons/ThumbUpIcon";
import { formatDateLong } from "@/source/shared/lib/formatDate";
import type { ArticleListItem } from "../../model/types";
import s from "./ArticleCard.module.scss";

interface ArticleCardProps {
  article: ArticleListItem;
}

/** Карточка статьи в списках и слайдерах. Внутри кабинета ведёт на /landing-версию страницы. */
export function ArticleCard({ article }: ArticleCardProps) {
  const pathname = usePathname();
  const prefix = pathname.startsWith("/landing") ? "/landing" : "";
  const href = `${prefix}/${article.kind}/${article.slug}`;
  const badge = article.tags[0] || (article.kind === "news" ? "Новость" : "Статья");

  return (
    <Link href={href} className={s.card} aria-label={article.title}>
      <div className={s.body}>
        <div className={s.cover}>
          {article.cover_image && (
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              sizes="(min-width: 1440px) 25vw, (min-width: 768px) 33vw, 50vw"
              className={s.coverImage}
            />
          )}
          <span className={s.badge}>{badge}</span>
        </div>
        <div className={s.info}>
          <h3 className={s.title}>{article.title}</h3>
          {article.excerpt && <p className={s.excerpt}>{article.excerpt}</p>}
        </div>
      </div>

      <div className={s.bottom}>
        <div className={s.footer}>
          <time className={s.date} dateTime={article.published_at || undefined}>
            {formatDateLong(article.published_at)}
          </time>
          <span className={s.read}>
            Читать
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <div className={s.stats}>
          <span className={s.reactions}>
            <span className={s.stat}>
              <ThumbUpIcon className={s.statIcon} />
              {article.likes_count}
            </span>
            <span className={s.stat}>
              <ThumbDownIcon className={s.statIcon} />
              {article.dislikes_count}
            </span>
          </span>
          <span className={s.stat}>
            <EyeIcon className={s.statIcon} />
            {article.views_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
