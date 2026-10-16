import { redirect } from "next/navigation";
import { LiningTool } from "@/widgets/lining";
import { readSessionRole } from "../../../../session/read-session-role";

export const dynamic = "force-dynamic";

/** Оценка крепи доступна эксперту; другую роль отправляет в настройки. */
export default async function LiningPage() {
  const role = await readSessionRole();

  if (role && role !== "EXPERT") {
    redirect("/settings");
  }

  return <LiningTool />;
}
