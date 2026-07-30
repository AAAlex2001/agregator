import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { PublicReviewsWidget } from "@/source/widgets/public-reviews";
import { fetchPublicReviews } from "@/source/entities/landing-review";
import { RedirectIfAuthed } from "@/source/features/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Отзывы об исполнителях промышленной безопасности",
  description:
    "Реальные отзывы заказчиков об исполнителях Ростехнадзора по завершённым тендерам на экспертизу промышленной безопасности.",
  keywords: [
    "отзывы об исполнителях",
    "отзывы экспертиза промышленной безопасности",
    "рейтинг исполнителей Ростехнадзора",
    "отзывы исполнителей ЭПБ",
  ],
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "Отзывы об исполнителях промышленной безопасности",
    description: "Отзывы заказчиков о работе исполнителей на платформе Ресурс-Плюс.",
    url: "/reviews",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Ресурс-Плюс" }],
  },
  robots: { index: true, follow: true },
};

export default async function PublicReviewsPage() {
  const initial = await fetchPublicReviews({ server: true });

  return (
    <>
      <RedirectIfAuthed to="/landing/reviews" />
      <LandingHeader />
      <main>
        <PublicReviewsWidget initial={initial} />
      </main>
      <LandingFooter variant="light" />
    </>
  );
}
