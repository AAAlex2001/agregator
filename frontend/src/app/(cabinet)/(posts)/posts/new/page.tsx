import { PostAccess, PostEditor } from "@/widgets/posts";
import { createPrivateMetadata } from "../../../../seo/private-page";

export const metadata = createPrivateMetadata("Новая публикация");

/** Новая публикация; гостю — предложение войти. */
export default function NewPostPage() {
  return (
    <PostAccess>
      <PostEditor />
    </PostAccess>
  );
}
