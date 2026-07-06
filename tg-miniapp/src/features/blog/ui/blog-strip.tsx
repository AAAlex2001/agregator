import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tapHaptic } from "@/shared/services/telegram";
import { ChevronRightIcon } from "@/shared/ui/icons/interface";
import { ArticleSlide } from "@/entites/article";
import { useLatestArticles } from "../model/use-latest-articles";
import { ArticleSheet } from "./article-sheet";
import s from "./blog-strip.module.scss";

export function BlogStrip() {
  const navigate = useNavigate();
  const { items } = useLatestArticles(5);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <section className={s.wrap}>
      <div className={s.head}>
        <span className={s.title}>Блог платформы</span>
        <button
          className={s.all}
          onClick={() => {
            tapHaptic();
            navigate("/blog");
          }}
        >
          Все статьи
          <ChevronRightIcon width={16} height={16} />
        </button>
      </div>

      <div className={s.slider}>
        {items.map((article) => (
          <ArticleSlide key={article.id} article={article} onClick={() => setOpenSlug(article.slug)} />
        ))}
      </div>

      <ArticleSheet slug={openSlug} onClose={() => setOpenSlug(null)} />
    </section>
  );
}
