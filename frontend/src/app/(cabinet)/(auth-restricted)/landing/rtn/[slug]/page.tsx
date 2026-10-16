import type { Metadata } from "next";
import { getRtnOnServer } from "@/entities/rtn/server";
import { RtnDetail } from "@/widgets/rtn";
import { loadRtnDetailPage } from "../../../../../content/load-rtn-detail-page";
import type { RtnDetailPageProps } from "../../../../../content/load-rtn-detail-page";
import { createPrivateRtnDetailMetadata } from "../../../../../seo/rtn-detail";

export const dynamic = "force-dynamic";

/** Сохраняет заголовок кабинетной версии и исключает её дублирование в поиске. */
export async function generateMetadata({
  params,
}: RtnDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const clarification = await getRtnOnServer(slug);

  return createPrivateRtnDetailMetadata(clarification);
}

/** Показывает разъяснение с кабинетными ссылками на каталог и похожие материалы. */
export default async function PrivateRtnDetailPage({ params }: RtnDetailPageProps) {
  const { slug } = await params;
  const { clarification, related, comments } = await loadRtnDetailPage(slug);

  return (
    <RtnDetail
      clarification={clarification}
      related={related}
      comments={comments}
      basePath="/landing"
    />
  );
}
