import { BlitzOrdersBoard } from "@/widgets/blitz";
import { createPrivateMetadata } from "../../../seo/private-page";

export const metadata = createPrivateMetadata("Блиц-аудит");

/** Заявки на аудит СУПБ заказчика или аудитора. */
export default function BlitzAuditPage() {
  return <BlitzOrdersBoard service="audit" />;
}