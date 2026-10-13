"use client";

import { POST_STATUSES, PostCard } from "@/entities/posts";
import { PostActions, usePostsList } from "@/features/posts-admin";
import { accountPath, POST_REPORTS_PATH } from "@/shared/lib/admin-paths";
import Button from "@/shared/ui/button";
import Chip from "@/shared/ui/chip";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import Pagination from "@/shared/ui/pagination";
import Toolbar from "@/shared/ui/toolbar";
import styles from "./style.module.scss";

type AdminPostsProps = {
  authorId?: number;
};

/** Публикации площадки или одного автора: статусы, просмотр и модерация. */
export default function AdminPosts({ authorId }: AdminPostsProps) {
  const list = usePostsList(authorId);
  const statuses = authorId ? POST_STATUSES : POST_STATUSES.filter((item) => item.value !== "draft");

  return (
    <Page>
      <PageHeader
        title={authorId ? `Публикации пользователя №${authorId}` : "Публикации"}
        description={authorId ? "Публикации и черновики автора" : "Пользовательские публикации и репосты"}
        backHref={authorId ? accountPath(authorId) : undefined}
        action={<Button variant="outline" href={POST_REPORTS_PATH}>Жалобы</Button>}
      />

      <Toolbar aside={list.list && `Всего: ${list.list.total}`}>
        {statuses.map((status) => (
          <Chip
            key={status.value}
            active={list.status === status.value}
            onClick={() => list.changeStatus(status.value)}
          >
            {status.label}
          </Chip>
        ))}
      </Toolbar>

      {list.error && (
        <div role="alert">
          <Message tone="error">{list.error}</Message>
          <Button variant="outline" onClick={list.reload}>Повторить</Button>
        </div>
      )}
      {list.loading && <Loader size="lg" />}
      {list.list?.items.length === 0 && <Message>Публикаций в этом разделе пока нет.</Message>}

      <div className={styles.list}>
        {list.list?.items.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            actions={<PostActions post={post} onChanged={list.reload} onDeleted={list.reload} />}
          />
        ))}
      </div>

      <Pagination page={list.page} pages={list.pages} disabled={list.loading} onChange={list.openPage} />
    </Page>
  );
}
