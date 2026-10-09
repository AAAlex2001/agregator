import { redirect } from "next/navigation";
import { ARTICLES_PATH } from "@/shared/lib/admin-paths";

/** Главная админки ведёт в список статей. */
export default function PanelRoute() {
  redirect(ARTICLES_PATH);
}
