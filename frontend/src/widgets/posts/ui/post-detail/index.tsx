"use client";

import { useRouter } from "next/navigation";
import type { Post, PostCommentPage } from "@/entities/post";
import { Button } from "@/shared/ui/button";
import { ArrowLeftIcon } from "@/shared/ui/icons";
import { Title } from "@/shared/ui/title";
import { PostComments } from "../post-comments";
import { PostItem } from "../post-item";
import styles from "./style.module.scss";

/** Публикация и первая страница обсуждения; у неопубликованной обсуждения нет. */
interface PostDetailProps {
  post: Post;
  comments: PostCommentPage | null;
}

/** Публикация целиком и обсуждение под ней; всё пришло с сервера. */
export function PostDetail({ post, comments }: PostDetailProps) {
  const router = useRouter();

  return (
    <div className={styles.section}>
      <Button
        href="/posts"
        variant="transparent"
      >
        <ArrowLeftIcon />
        Назад в ленту
      </Button>
      <Title
        as="h1"
        text={`Публикация #${post.id}`}
      />
      <PostItem
        post={post}
        showOpen={false}
        onDeleted={() => router.push("/posts")}
      />
      {comments && (
        <PostComments
          postId={post.id}
          initial={comments}
        />
      )}
    </div>
  );
}
