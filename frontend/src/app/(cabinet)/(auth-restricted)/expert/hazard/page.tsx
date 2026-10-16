import { redirect } from "next/navigation";
import { HazardTool } from "@/widgets/hazard";
import { readSessionRole } from "../../../../session/read-session-role";

export const dynamic = "force-dynamic";

/** Оценка опасности аварий доступна эксперту; другую роль отправляет в настройки. */
export default async function HazardPage() {
  const role = await readSessionRole();

  if (role && role !== "EXPERT") {
    redirect("/settings");
  }

  return <HazardTool />;
}
