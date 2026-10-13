import type { Metadata } from "next";
import { MyPosts } from "@/source/widgets/posts/my-posts";
import { PostAccess } from "@/source/widgets/posts/layout";

export const metadata: Metadata = {
  title: "Мои публикации",
  robots: { index: false, follow: false },
};

/** Открывает личный раздел публикаций после входа. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const status = (await searchParams).status;
  return (
    <PostAccess>
      <MyPosts initialStatus={status === "draft" ? "draft" : "published"} />
    </PostAccess>
  );
}
