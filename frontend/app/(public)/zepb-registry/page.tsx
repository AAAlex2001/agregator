import type { Metadata } from "next";
import { LandingFooter, LandingHeader } from "@/source/widgets/landing";
import { ZepbRegistryWidget } from "@/source/widgets/zepb-registry";

export const metadata: Metadata = {
  title: "Реестр заключений ЭПБ",
  description: "Публичная страница с переходами в официальные реестры заключений экспертизы промышленной безопасности.",
  alternates: { canonical: "/zepb-registry" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function PublicZepbRegistryPage() {
  return (
    <>
      <LandingHeader />
      <ZepbRegistryWidget />
      <LandingFooter variant="light" />
    </>
  );
}
