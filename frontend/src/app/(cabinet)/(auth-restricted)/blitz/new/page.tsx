import { redirect } from "next/navigation";
import { BlitzOrderCreate } from "@/widgets/blitz";
import { createPrivateMetadata } from "../../../../seo/private-page";
import { readSessionRole } from "../../../../session/read-session-role";

export const dynamic = "force-dynamic";
export const metadata = createPrivateMetadata("Новая заявка на экспертизу");

/** Новая заявка доступна заказчику; эксперт возвращается к списку. */
export default async function NewBlitzOrderPage() {
  const role = await readSessionRole();

  if (role && role !== "CUSTOMER") {
    redirect("/blitz");
  }

  return <BlitzOrderCreate />;
}
