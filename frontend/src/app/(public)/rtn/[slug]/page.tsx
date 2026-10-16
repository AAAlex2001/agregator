import type { Metadata } from "next";
import { getRtnOnServer } from "@/entities/rtn/server";
import { RtnDetail } from "@/widgets/rtn";
import { loadRtnDetailPage } from "../../../content/load-rtn-detail-page";
import type { RtnDetailPageProps } from "../../../content/load-rtn-detail-page";
import { createRtnDetailMetadata } from "../../../seo/rtn-detail";
import { PublicSiteShell } from "../../../ui/shells/public-site-shell";
import { RtnDetailJsonLd } from "../../../ui/seo/rtn-detail-json-ld";

export const dynamic = "force-dynamic";

/** Открывает опубликованное разъяснение для индексации по его публичному адресу. */
export async function generateMetadata({
  params,
}: RtnDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const clarification = await getRtnOnServer(slug);

  return createRtnDetailMetadata(clarification);
}

/** Показывает серверный текст ответа РТН, обсуждение и поисковую разметку. */
export default async function RtnDetailPage({ params }: RtnDetailPageProps) {
  const { slug } = await params;
  const { clarification, related, comments } = await loadRtnDetailPage(slug);

  return (
    <PublicSiteShell redirectTo={`/landing/rtn/${slug}`}>
      <RtnDetailJsonLd
        clarification={clarification}
        commentCount={comments.length}
      />
      <main>
        <RtnDetail
          clarification={clarification}
          related={related}
          comments={comments}
        />
      </main>
    </PublicSiteShell>
  );
}
