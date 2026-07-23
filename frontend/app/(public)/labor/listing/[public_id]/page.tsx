import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { RedirectIfAuthed } from "@/source/features/session";
import { fetchPublicLaborListing } from "@/source/entities/labor";
import {
  PublicLaborListingView,
  laborShareTitle,
  laborShareDescription,
} from "@/source/features/labor-resources";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ public_id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { public_id } = await params;
  const item = await fetchPublicLaborListing(public_id, { server: true });
  if (!item) {
    return { title: "Заявка не найдена", robots: { index: false, follow: false } };
  }

  const title = laborShareTitle(item);
  const description = laborShareDescription(item);
  const url = `/labor/listing/${public_id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "website",
      url,
    },
    twitter: { card: "summary", title, description },
    robots: { index: false, follow: true },
  };
}

export default async function PublicLaborListingPage({ params }: Props) {
  const { public_id } = await params;
  const item = await fetchPublicLaborListing(public_id, { server: true });
  if (!item) notFound();

  const inAppHref =
    item.kind === "EXPERT_WANTED" ? "/labor/expert-search" : "/labor/employment";

  return (
    <>
      <RedirectIfAuthed to={inAppHref} />
      <LandingHeader />
      <main>
        <PublicLaborListingView item={item} />
      </main>
      <LandingFooter variant="light" />
    </>
  );
}
