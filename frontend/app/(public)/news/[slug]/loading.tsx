import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { ArticleViewSkeleton } from "@/source/features/article-view";

export default function NewsArticleLoading() {
  return (
    <>
      <LandingHeader />
      <ArticleViewSkeleton />
      <LandingFooter />
    </>
  );
}
