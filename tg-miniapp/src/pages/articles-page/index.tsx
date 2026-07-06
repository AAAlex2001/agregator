import { useState } from "react";
import { Screen } from "@/widgets/app-shell";
import { Spinner } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import { ArticleRow, type ArticleKind } from "@/entites/article";
import { ArticleSheet, useArticles } from "@/features/blog";
import s from "./style.module.scss";

const TABS = [
  { key: "blog", label: "Блог" },
  { key: "news", label: "Новости" },
];

export function ArticlesPage() {
  const [kind, setKind] = useState<ArticleKind>("blog");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const { items } = useArticles(kind);

  return (
    <Screen title="Новости и блог" panel>
      <div className={s.wrap}>
        <Tabs tabs={TABS} active={kind} onChange={(key) => setKind(key as ArticleKind)} />

        {items === null ? (
          <div className={s.loading}>
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <p className={s.empty}>{kind === "blog" ? "Пока нет статей в блоге" : "Пока нет новостей"}</p>
        ) : (
          <div className={s.list}>
            {items.map((article) => (
              <ArticleRow key={article.id} article={article} onClick={() => setOpenSlug(article.slug)} />
            ))}
          </div>
        )}
      </div>

      <ArticleSheet slug={openSlug} onClose={() => setOpenSlug(null)} />
    </Screen>
  );
}
