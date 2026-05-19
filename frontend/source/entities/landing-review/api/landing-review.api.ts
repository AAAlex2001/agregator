import { API_URL, SERVER_API_URL } from "@/source/shared/api/config";

export interface LandingReview {
  id: number;
  reviewer: string;
  position: string;
  text: string;
  created_at: string;
}

export async function fetchPublicReviews(opts: { server?: boolean } = {}): Promise<LandingReview[]> {
  const base = opts.server ? SERVER_API_URL : API_URL;
  const res = await fetch(`${base}/public/reviews`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Не удалось загрузить отзывы");
  }
  return res.json();
}
