import type { Metadata } from "next";
import { PostEditor } from "@/source/widgets/posts/editor";
import { PostAccess } from "@/source/widgets/posts/layout";

export const metadata: Metadata = {
  title: "Новая публикация",
  robots: { index: false, follow: false },
};

/** Открывает личный раздел публикаций после входа. */
export default function Page() {
  return (
    <PostAccess loadingFallback={null}>
      <PostEditor />
    </PostAccess>
  );
}
