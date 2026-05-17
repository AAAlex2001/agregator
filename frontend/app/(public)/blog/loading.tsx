import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { ArticlesListSkeleton } from "@/source/features/articles-list";

export default function BlogListLoading() {
  return (
    <>
      <LandingHeader />
      <ArticlesListSkeleton />
      <LandingFooter variant="light" />
    </>
  );
}
