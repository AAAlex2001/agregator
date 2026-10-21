import { CommissionCabinet } from "@/widgets/commission";
import { createPrivateMetadata } from "../../../seo/private-page";

export const metadata = createPrivateMetadata("Конкурсная комиссия");

/** Заявка в конкурсную комиссию из кабинета. */
export default function CommissionPage() {
  return <CommissionCabinet />;
}