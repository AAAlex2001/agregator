import { Suspense } from "react";
import { ArticlesPageSkeleton } from "@/widgets/articles";
import { MAX_LINKED_BLOG_PAGE } from "../../config/article-pagination";
import { BLOG_LIST_METADATA } from "../../seo/blog-list";
import { BlogListPageContent } from "../../ui/pages/blog-list-page-content";
import { PublicSiteShell } from "../../ui/shells/public-site-shell";

export const dynamic = "force-dynamic";
export const metadata = BLOG_LIST_METADATA;

/** Параметр серверной подборки блога. */
interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

/** Открывает публичный блог с накопительной серверной подборкой статей. */
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Math.min(
    Math.max(1, Number(params.page) || 1),
    MAX_LINKED_BLOG_PAGE,
  );

  return (
    <PublicSiteShell redirectTo="/landing/blog">
      <main>
        <Suspense fallback={<ArticlesPageSkeleton />}>
          <BlogListPageContent page={page} />
        </Suspense>
      </main>
    </PublicSiteShell>
  );
}
