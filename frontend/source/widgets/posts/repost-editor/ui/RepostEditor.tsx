import { ArrowLeftIcon, type Post } from "@/source/entities/posts";
import { RepostForm } from "@/source/features/posts/repost";
import Button from "@/source/shared/ui/Button";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./RepostEditor.module.scss";

interface RepostEditorProps {
  post: Post;
}

/** Репост с комментарием. Исходная публикация приходит с сервера уже загруженной. */
export function RepostEditor({ post }: RepostEditorProps) {
  return (
    <div className={s.page}>
      <Button href="/posts" variant="transparent">
        <ArrowLeftIcon />
        Назад в ленту
      </Button>
      <div className={s.head}>
        <Title as="h1" text="Репост с комментарием" />
        <Subtitle
          className={s.subtitle}
          text="Добавьте свой комментарий и поделитесь публикацией в ленте."
        />
      </div>
      {post.status === "published" ? (
        <RepostForm post={post} />
      ) : (
        <p className={s.notice}>Репост доступен после публикации.</p>
      )}
    </div>
  );
}
