import { ExpertReviews } from "@/widgets/expert-reviews";

/** Публичный идентификатор исполнителя из адреса страницы. */
interface ExpertReviewsPageProps {
  params: Promise<{ publicId: string }>;
}

/** Показывает отзывы выбранного исполнителя внутри кабинета. */
export default async function ExpertReviewsPage({ params }: ExpertReviewsPageProps) {
  const { publicId } = await params;

  return (
    <ExpertReviews
      key={publicId}
      publicId={publicId}
    />
  );
}
