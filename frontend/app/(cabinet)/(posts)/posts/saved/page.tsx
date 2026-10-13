import type { Metadata } from "next";
import { SavedPosts } from "@/source/widgets/posts/saved";
import { PostAccess } from "@/source/widgets/posts/layout";

export const metadata: Metadata = {
  title: "Сохранённые публикации",
  robots: { index: false, follow: false },
};

/** Открывает личный раздел публикаций после входа. */
export default function Page() {
  return (
    <PostAccess>
      <SavedPosts />
    </PostAccess>
  );
}
