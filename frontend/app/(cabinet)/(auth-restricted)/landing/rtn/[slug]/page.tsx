import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchRelatedRtn, fetchRtnBySlug, fetchRtnComments } from "@/source/entities/rtn";
import { RtnClarificationWidget } from "@/source/widgets/rtn";

export const dynamic = "force-dynamic";

interface AuthedRtnDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthedRtnDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const clarification = await fetchRtnBySlug(slug, { server: true });
  return {
    title: clarification?.meta_title || clarification?.title || "Ростехнадзор отвечает",
    robots: { index: false, follow: false },
  };
}

export default async function AuthedRtnDetailPage({ params }: AuthedRtnDetailPageProps) {
  const { slug } = await params;
  const clarification = await fetchRtnBySlug(slug, { server: true });
  if (!clarification) notFound();

  const [related, comments] = await Promise.all([
    fetchRelatedRtn(slug, 10, { server: true }),
    fetchRtnComments(clarification.id, { server: true }).catch(() => []),
  ]);

  return <RtnClarificationWidget clarification={clarification} related={related} comments={comments} basePath="/landing" />;
}
