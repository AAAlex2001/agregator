import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { fetchRtnBySlug, fetchRelatedRtn } from "@/source/entities/rtn-clarification";
import { fetchRtnComments } from "@/source/entities/rtn-comment";
import { RtnClarificationView, RtnJsonLd } from "@/source/features/rtn-clarification-view";
import { RedirectIfAuthed } from "@/source/features/session";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clarification = await fetchRtnBySlug(slug, { server: true });
  if (!clarification) {
    return { title: "Разъяснение не найдено", robots: { index: false, follow: false } };
  }
  const title = clarification.meta_title || clarification.title;
  const description = clarification.meta_description || clarification.excerpt || clarification.title;

  return {
    title,
    description,
    keywords: clarification.meta_keywords || clarification.tags.join(", "),
    alternates: { canonical: `/rtn/${clarification.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/rtn/${clarification.slug}`,
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: clarification.title }],
      publishedTime: clarification.published_at || undefined,
      modifiedTime: clarification.updated_at,
      tags: clarification.tags,
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-default.png"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function RtnDetailPage({ params }: Props) {
  const { slug } = await params;
  const clarification = await fetchRtnBySlug(slug, { server: true });
  if (!clarification) notFound();

  const [related, comments] = await Promise.all([
    fetchRelatedRtn(slug, { limit: 4, server: true }),
    fetchRtnComments(clarification.id, { server: true }).catch(() => []),
  ]);

  return (
    <>
      <RedirectIfAuthed to={`/landing/rtn/${slug}`} />
      <LandingHeader />
      <RtnJsonLd clarification={clarification} commentCount={comments.length} />
      <main>
        <RtnClarificationView clarification={clarification} related={related} initialComments={comments} />
      </main>
      <LandingFooter variant="light" />
    </>
  );
}
