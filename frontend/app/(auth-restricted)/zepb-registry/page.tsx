import type { Metadata } from "next";
import { ZepbRegistryWidget } from "@/source/widgets/zepb-registry";

export const metadata: Metadata = {
  title: "Реестры заключений ЭПБ Ростехнадзора | Ресурс-Плюс",
};

export default function ZepbRegistryPage() {
  return <ZepbRegistryWidget />;
}
