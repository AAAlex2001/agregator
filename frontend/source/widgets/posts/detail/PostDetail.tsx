"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon, type Post, type ThreadPage } from "@/source/entities/posts";
import Button from "@/source/shared/ui/Button";
import { Title } from "@/source/shared/ui/Typography";
import { PostComments } from "../comments/PostComments";
import { PostItem } from "../list/PostItem";
import s from "../posts.module.scss";

interface PostDetailProps {
  post: Post;
  threads: ThreadPage | null;
}

/** Публикация целиком и обсуждение под ней. Всё пришло с сервера и сразу есть в разметке страницы. */
export function PostDetail({ post, threads }: PostDetailProps) {
  const router = useRouter();

  return (
    <div className={s.section}>
      <Button href="/posts" variant="transparent">
        <ArrowLeftIcon />
        Назад в ленту
      </Button>
      <Title as="h1" text={`Публикация ${post.author.name || "участника сообщества"}`} />
      <PostItem post={post} showOpen={false} onDeleted={() => router.push("/posts")} />
      {threads && <PostComments postId={post.id} initial={threads} />}
    </div>
  );
}
