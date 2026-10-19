import { PostAccess, PostEditor } from "@/widgets/posts";
import { loadPostById } from "../../../../../content/load-post-page";
import { createPrivateMetadata } from "../../../../../seo/private-page";

export const dynamic = "force-dynamic";
export const metadata = createPrivateMetadata("Пост в Telegram");

/** Номер своего поста, на который отвечает новый. */
interface NewTelegramPostPageProps {
  searchParams: Promise<{ reply_to?: string }>;
}

/** Новый пост в Telegram-каналы, в том числе ответом на свой пост; гостю — предложение войти. */
export default async function NewTelegramPostPage({ searchParams }: NewTelegramPostPageProps) {
  const { reply_to: replyToId } = await searchParams;
  const replyTo = await loadPostById(replyToId);

  return (
    <PostAccess>
      <PostEditor
        target="telegram"
        replyTo={replyTo}
      />
    </PostAccess>
  );
}
