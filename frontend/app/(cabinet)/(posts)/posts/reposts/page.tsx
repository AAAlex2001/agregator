import type { Metadata } from "next";
import { MyReposts } from "@/source/widgets/posts/reposts";
import { PostAccess } from "@/source/widgets/posts/layout";

export const metadata: Metadata = { title: "Мои репосты", robots: { index: false, follow: false } };

/** Открывает личный раздел публикаций после входа. */
export default function Page() {
  return (
    <PostAccess>
      <MyReposts />
    </PostAccess>
  );
}
