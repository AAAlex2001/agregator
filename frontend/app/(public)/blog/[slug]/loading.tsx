import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { ArticleViewSkeleton } from "@/source/features/article-view";

export default function BlogArticleLoading() {
  return (
    <>
      <LandingHeader />
      <ArticleViewSkeleton />
      <LandingFooter variant="light" />
    </>
  );
}
