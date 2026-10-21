import { notFound, redirect } from "next/navigation";
import { createPrivateMetadata } from "../../../../../seo/private-page";
import { readSessionRole } from "../../../../../session/read-session-role";
import { EditResponsePageContent } from "../../../../../ui/pages/edit-response-page-content";

export const metadata = createPrivateMetadata("Изменение предложения");

/** Номер отклика из адреса. */
interface EditResponsePageProps {
  params: Promise<{ id: string }>;
}

/** Изменение своего отклика исполнителем; остальных ролей отправляет к откликам. */
export default async function EditResponsePage({ params }: EditResponsePageProps) {
  const role = await readSessionRole();

  if (role && role !== "EXPERT") {
    redirect("/responses");
  }

  const { id } = await params;
  const responseId = Number(id);

  if (!Number.isSafeInteger(responseId) || responseId < 1) {
    notFound();
  }

  return <EditResponsePageContent responseId={responseId} />;
}
