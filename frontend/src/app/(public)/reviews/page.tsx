import { getPublicReviewsOnServer } from "@/entities/landing-content/server";
import { PublicReviews } from "@/widgets/public-reviews";
import { REVIEWS_METADATA } from "../../seo/reviews";
import { PublicSiteShell } from "../../ui/shells/public-site-shell";

export const dynamic = "force-dynamic";
export const metadata = REVIEWS_METADATA;

/** Загружает публичные отзывы на сервере и сохраняет переход в кабинет после входа. */
export default async function PublicReviewsPage() {
  const reviews = await getPublicReviewsOnServer();

  return (
    <PublicSiteShell redirectTo="/landing/reviews">
      <main>
        <PublicReviews
          items={reviews}
          homeHref="/"
        />
      </main>
    </PublicSiteShell>
  );
}
