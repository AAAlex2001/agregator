import type { Post } from "@/entities/post";
import { DocumentPlusIcon } from "@/shared/ui/icons";
import { RemoveButton } from "@/shared/ui/remove-button";
import styles from "./style.module.scss";

/** Свой пост, на который отвечает новый, и отмена ответа. */
interface ReplyBannerProps {
  post: Post;
  onClear: () => void;
}

/** Плашка над редактором: новый пост выйдет в Telegram ответом на этот. */
export function ReplyBanner({ post, onClear }: ReplyBannerProps) {
  return (
    <div className={styles.banner}>
      <DocumentPlusIcon className={styles.icon} />
      <div className={styles.body}>
        <span className={styles.title}>Ответ на ваш пост</span>
        <span className={styles.text}>{post.description}</span>
        <span className={styles.hint}>
          В каналах, где он вышел, новый пост появится ответом на него.
        </span>
      </div>
      <RemoveButton
        label="Опубликовать не ответом"
        onClick={onClear}
      />
    </div>
  );
}
