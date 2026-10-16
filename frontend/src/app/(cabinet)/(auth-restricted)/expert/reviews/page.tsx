import { redirect } from "next/navigation";
import { ExpertReviews } from "@/widgets/expert-reviews";
import { readSessionRole } from "../../../../session/read-session-role";

/** Показывает исполнителю отзывы о нём, остальных ролей отправляет в настройки. */
export default async function MyReviewsPage() {
  const role = await readSessionRole();

  if (role && role !== "EXPERT") {
    redirect("/settings");
  }

  return <ExpertReviews />;
}
