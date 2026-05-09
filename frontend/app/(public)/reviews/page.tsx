import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { PublicReviewsWidget } from "@/source/widgets/public-reviews";
import { RedirectIfAuthed } from "@/source/features/session";

export const metadata: Metadata = {
  title: "Отзывы | Ресурс Плюс",
  description: "Отзывы клиентов о работе на платформе Ресурс Плюс.",
  alternates: {
    canonical: "/reviews",
  },
  robots: {
    index: true,
    follow: true,
  },
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
