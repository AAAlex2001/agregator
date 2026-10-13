import { PublicReviewsWidget } from "@/source/widgets/public-reviews";

export const dynamic = "force-dynamic";

export default function AuthRestrictedReviewsPage() {
  return <PublicReviewsWidget />;
}
