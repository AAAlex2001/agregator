import { redirect } from "next/navigation";
import { BlitzAuditCreate } from "@/widgets/blitz";
import { createPrivateMetadata } from "../../../../seo/private-page";
import { readSessionRole } from "../../../../session/read-session-role";

export const dynamic = "force-dynamic";
export const metadata = createPrivateMetadata("Новая заявка на аудит СУПБ");

/** Заявка на аудит доступна заказчику; исполнитель возвращается к списку. */
export default async function NewBlitzAuditPage() {
  const role = await readSessionRole();

  if (role && role !== "CUSTOMER") {
    redirect("/blitz-audit");
  }

  return <BlitzAuditCreate />;
}