import { articlePath } from "@/shared/lib/admin-paths";
import { formatDateTime } from "@/shared/lib/date";
import Badge from "@/shared/ui/badge";
import { EyeIcon } from "@/shared/ui/icons";
import List from "@/shared/ui/list";
import ListRow from "@/shared/ui/list-row";
import { ARTICLE_KIND_LABELS, ARTICLE_STATUS_LABELS, ARTICLE_STATUS_TONES, type ArticleListItem } from "../../model/types";
import styles from "./style.module.scss";

type ArticlesTableProps = {
  articles: ArticleListItem[];
};

/** Список статей. Строка целиком ведёт на редактирование. */
const ArticlesTable = ({ articles }: ArticlesTableProps) => (
  <List>
    {articles.map((article) => (
      <ListRow key={article.id} href={articlePath(article.id)}>
        <span className={styles.id}>#{article.id}</span>

        <span className={styles.info}>
          <span className={styles.title}>{article.title || "(без заголовка)"}</span>
          <span className={styles.meta}>
            {ARTICLE_KIND_LABELS[article.kind]} · {article.slug}
          </span>
        </span>

        <span className={styles.views}>
          <EyeIcon className={styles.icon} />
          {article.views_count}
        </span>

        <span className={styles.status}>
          <Badge tone={ARTICLE_STATUS_TONES[article.status]}>{ARTICLE_STATUS_LABELS[article.status]}</Badge>
        </span>

        <span className={styles.date}>{formatDateTime(article.updated_at)}</span>
      </ListRow>
    ))}
  </List>
);

export default ArticlesTable;
