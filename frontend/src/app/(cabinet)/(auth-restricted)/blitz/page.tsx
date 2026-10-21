import { BlitzOrdersBoard } from "@/widgets/blitz";
import { createPrivateMetadata } from "../../../seo/private-page";

export const metadata = createPrivateMetadata("Блиц-эксперт");

/** Заявки на экспертизу заказчика или эксперта. */
export default function BlitzPage() {
  return <BlitzOrdersBoard service="expertise" />;
}
