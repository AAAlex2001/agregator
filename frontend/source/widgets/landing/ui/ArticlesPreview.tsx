import { ArticleCard, type ArticleListItem } from "@/source/entities/article";
import Button from "@/source/shared/ui/Button";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import s from "./articles-preview.module.scss";

interface Props {
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
  items: ArticleListItem[];
}

const ArticlesPreview = ({ title, subtitle, ctaHref, ctaLabel, items }: Props) => {
  if (items.length === 0) return null;

  return (
    <section className={s.section}>
      <div className={s.content}>
        <header className={s.header}>
          <Title text={title} />
          <Subtitle text={subtitle} />
        </header>

        <div className={s.grid}>
          {items.map((item) => (
            <ArticleCard
              key={item.id}
              kind={item.kind}
              slug={item.slug}
              title={item.title}
              excerpt={item.excerpt}
              cover_image={item.cover_image}
              tags={item.tags}
              published_at={item.published_at}
              likes_count={item.likes_count}
              dislikes_count={item.dislikes_count}
              views_count={item.views_count}
            />
          ))}
        </div>

        <Button href={ctaHref} variant="secondary" className={s.cta}>
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
};

export default ArticlesPreview;
