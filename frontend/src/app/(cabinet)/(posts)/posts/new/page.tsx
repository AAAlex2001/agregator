import { PostAccess, PostEditor } from "@/widgets/posts";
import { createPrivateMetadata } from "../../../../seo/private-page";

export const metadata = createPrivateMetadata("Пост на сайт");

/** Новый пост в ленту сайта; гостю — предложение войти. */
export default function NewPostPage() {
  return (
    <PostAccess>
      <PostEditor />
    </PostAccess>
  );
}
