"use client";

import { useRouter } from "next/navigation";
import type { Post } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { usePost } from "@/source/features/posts/post/read-post";
import Button from "@/source/shared/ui/Button";
import { EmptyState } from "@/source/shared/ui/EmptyState";
import { ArrowLeftIcon } from "@/source/entities/posts/ui/icons";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { PostCardSkeleton } from "../skeleton";
import { PostItem } from "../list/PostItem";
import { PostComments } from "../comments/PostComments";
import s from "../posts.module.scss";

interface Props {
  id: number;
  initialPost?: Post;
}

/** Перезагружает публикацию при смене пользователя или адреса. */
export function PostDetail(props: Props) {
  const { user } = useSession();
  return (
    <PostDetailContent
      key={`${props.id}-${user?.id ?? "guest"}`}
      {...props}
    />
  );
}

/** Открывает публикацию целиком вместе с обсуждением. */
function PostDetailContent({ id, initialPost }: Props) {
  const state = usePost(id, initialPost);
  const router = useRouter();
  return (
    <div className={s.section}>
      <Button
        href="/posts"
        variant="transparent"
      >
        <ArrowLeftIcon />
        Назад в ленту
      </Button>
      <div className={s.heading}>
        <Title as="h1" text="Публикация" />
        <Subtitle
          text="Материалы автора и обсуждение с участниками сообщества."
          className={s.subtitle}
        />
      </div>
      {state.loading && !state.post && <PostCardSkeleton />}
      {state.error ? (
        <div className={s.error} role="alert">
          <EmptyState
            title="Ошибка загрузки"
            subtitle={state.error}
            actionLabel="Повторить"
            onAction={state.reload}
          />
        </div>
      ) : (
        state.post && (
          <>
            <PostItem
              post={state.post}
              onDeleted={() => router.push("/posts")}
            />
            {state.post.status === "published" && <PostComments postId={id} />}
          </>
        )
      )}
    </div>
  );
}
