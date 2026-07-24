import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchRtnBySlug, fetchRelatedRtn } from "@/source/entities/rtn-clarification";
import { fetchRtnComments } from "@/source/entities/rtn-comment";
import { RtnClarificationViewWidget } from "@/source/widgets/rtn-clarification-view";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clarification = await fetchRtnBySlug(slug, { server: true });
  return {
    title: clarification?.meta_title || clarification?.title || "Ростехнадзор отвечает",
    robots: { index: false, follow: false },
  };
}

export default async function AuthedRtnDetailPage({ params }: Props) {
  const { slug } = await params;
  const clarification = await fetchRtnBySlug(slug, { server: true });
  if (!clarification) notFound();

  const [related, comments] = await Promise.all([
    fetchRelatedRtn(slug, { limit: 4, server: true }),
    fetchRtnComments(clarification.id, { server: true }).catch(() => []),
  ]);

  return (
    <RtnClarificationViewWidget
      clarification={clarification}
      related={related}
      homeHref="/landing"
      sectionHrefPrefix="/landing"
      initialComments={comments}
    />
  );
}
