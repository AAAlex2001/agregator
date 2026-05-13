import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { PublicReviewsWidget } from "@/source/widgets/public-reviews";
import { RedirectIfAuthed } from "@/source/features/session";

export const metadata: Metadata = {
  title: "Отзывы об экспертах промышленной безопасности",
  description:
    "Реальные отзывы заказчиков об экспертах Ростехнадзора по завершённым тендерам на экспертизу промышленной безопасности.",
  keywords: [
    "отзывы об экспертах",
    "отзывы экспертиза промышленной безопасности",
    "рейтинг экспертов Ростехнадзора",
    "отзывы исполнителей ЭПБ",
  ],
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "Отзывы об экспертах промышленной безопасности",
    description: "Отзывы заказчиков о работе экспертов на платформе Ресурс-Плюс.",
    url: "/reviews",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function PublicReviewsPage() {
  return (
    <>
      <RedirectIfAuthed to="/landing/reviews" />
      <LandingHeader />
      <PublicReviewsWidget />
      <LandingFooter variant="light" />
    </>
  );
}
