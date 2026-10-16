import { Suspense } from "react";
import { ArticlesPageSkeleton } from "@/widgets/articles";
import { createPrivateMetadata } from "../../../../seo/private-page";
import { NewsListPageContent } from "../../../../ui/pages/news-list-page-content";

export const dynamic = "force-dynamic";
export const metadata = createPrivateMetadata("Новости промышленной безопасности");

/** Номер страницы новостей в кабинете. */
interface PrivateNewsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

/** Открывает новости внутри кабинета и сохраняет внутренние адреса статей. */
export default async function PrivateNewsPage({
  searchParams,
}: PrivateNewsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  return (
    <Suspense fallback={<ArticlesPageSkeleton />}>
      <NewsListPageContent
        page={page}
        sectionHrefPrefix="/landing"
      />
    </Suspense>
  );
}
