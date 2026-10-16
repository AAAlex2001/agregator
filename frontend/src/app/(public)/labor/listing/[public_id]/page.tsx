import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicLaborListingOnServer } from "@/entities/labor/server";
import { createLaborListingMetadata } from "../../../../seo/labor-listing";
import { LaborListingPageContent } from "../../../../ui/pages/labor-listing-page-content";
import { PublicSiteShell } from "../../../../ui/shells/public-site-shell";

export const dynamic = "force-dynamic";

/** Публичный идентификатор объявления из адреса страницы. */
interface PublicLaborListingPageProps {
  params: Promise<{ public_id: string }>;
}

/** Загружает объявление для карточки ссылки в мессенджерах. */
export async function generateMetadata({
  params,
}: PublicLaborListingPageProps): Promise<Metadata> {
  const { public_id } = await params;
  const item = await getPublicLaborListingOnServer(public_id);

  return createLaborListingMetadata(public_id, item);
}

/** Показывает объявление гостю, а вошедшего пользователя переводит в его раздел. */
export default async function PublicLaborListingPage({
  params,
}: PublicLaborListingPageProps) {
  const { public_id } = await params;
  const item = await getPublicLaborListingOnServer(public_id);

  if (!item) {
    notFound();
  }

  const cabinetHref = item.kind === "EXPERT_WANTED"
    ? "/labor/expert-search"
    : "/labor/employment";

  return (
    <PublicSiteShell redirectTo={cabinetHref}>
      <main>
        <LaborListingPageContent item={item} />
      </main>
    </PublicSiteShell>
  );
}
