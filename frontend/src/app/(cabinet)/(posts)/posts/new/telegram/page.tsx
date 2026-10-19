import { PostAccess, PostEditor } from "@/widgets/posts";
import { createPrivateMetadata } from "../../../../../seo/private-page";

export const metadata = createPrivateMetadata("Пост в Telegram");

/** Новый пост в Telegram-каналы; гостю — предложение войти. */
export default function NewTelegramPostPage() {
  return (
    <PostAccess>
      <PostEditor target="telegram" />
    </PostAccess>
  );
}
