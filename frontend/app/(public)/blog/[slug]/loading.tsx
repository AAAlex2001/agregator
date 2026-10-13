import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { ArticleSkeleton } from "@/source/widgets/articles";

export default function BlogArticleLoading() {
  return (
    <>
      <LandingHeader />
      <ArticleSkeleton />
      <LandingFooter variant="light" />
    </>
  );
}
