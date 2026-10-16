import { notFound } from "next/navigation";
import {
  getRelatedRtnOnServer,
  getRtnCommentsOnServer,
  getRtnOnServer,
} from "@/entities/rtn/server";

/** Параметры публичного или кабинетного маршрута одного разъяснения. */
export interface RtnDetailPageProps {
  params: Promise<{ slug: string }>;
}

/** Загружает разъяснение и его обсуждение для серверного HTML страницы. */
export async function loadRtnDetailPage(slug: string) {
  const clarification = await getRtnOnServer(slug);

  if (!clarification) {
    notFound();
  }

  const [related, comments] = await Promise.all([
    getRelatedRtnOnServer(slug, 10),
    getRtnCommentsOnServer(clarification.id).catch(() => []),
  ]);

  return {
    clarification,
    related,
    comments,
  };
}
