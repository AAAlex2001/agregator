import { API_URL } from "@/source/shared/api/config";

export interface LandingReview {
  id: number;
  reviewer: string;
  position: string;
  text: string;
  created_at: string;
}

export async function fetchPublicReviews(): Promise<LandingReview[]> {
  const res = await fetch(`${API_URL}/public/reviews`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Не удалось загрузить отзывы");
  }
  return res.json();
}
