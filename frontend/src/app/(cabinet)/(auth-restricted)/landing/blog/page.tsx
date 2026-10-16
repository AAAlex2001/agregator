import { Suspense } from "react";
import { ArticlesPageSkeleton } from "@/widgets/articles";
import { MAX_LINKED_BLOG_PAGE } from "../../../../config/article-pagination";
import { createPrivateMetadata } from "../../../../seo/private-page";
import { BlogListPageContent } from "../../../../ui/pages/blog-list-page-content";

export const dynamic = "force-dynamic";
export const metadata = createPrivateMetadata("Блог платформы");

/** Номер серверной подборки блога в кабинете. */
interface PrivateBlogPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

/** Открывает блог внутри кабинета с тем же объёмом серверной подборки. */
export default async function PrivateBlogPage({
  searchParams,
}: PrivateBlogPageProps) {
  const params = await searchParams;
  const page = Math.min(
    Math.max(1, Number(params.page) || 1),
    MAX_LINKED_BLOG_PAGE,
  );

  return (
    <Suspense fallback={<ArticlesPageSkeleton />}>
      <BlogListPageContent
        page={page}
        sectionHrefPrefix="/landing"
      />
    </Suspense>
  );
}
