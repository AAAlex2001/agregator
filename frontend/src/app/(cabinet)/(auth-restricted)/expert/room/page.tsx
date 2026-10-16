import { redirect } from "next/navigation";
import { ExpertRoom } from "@/widgets/expert-room";
import { readSessionRole } from "../../../../session/read-session-role";

/** Чат исполнителей доступен эксперту; другую роль отправляет в настройки. */
export default async function ExpertRoomPage() {
  const role = await readSessionRole();

  if (role && role !== "EXPERT") {
    redirect("/settings");
  }

  return <ExpertRoom />;
}
