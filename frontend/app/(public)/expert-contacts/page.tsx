import type { Metadata } from "next";
import { ExpertContactsMarketplace } from "@/source/features/expert-contacts";
import { LandingFooter, LandingHeader } from "@/source/widgets/landing";

export const metadata: Metadata = {
  title: "Контакты экспертов промышленной безопасности",
  description:
    "Каталог аттестованных экспертов промышленной безопасности с областями аттестации, рейтингом и защищенным доступом к контактам.",
  alternates: { canonical: "/expert-contacts" },
};

interface PublicExpertContactsPageProps {
  searchParams: Promise<{ expert?: string }>;
}

export default async function PublicExpertContactsPage({
  searchParams,
}: PublicExpertContactsPageProps) {
  const { expert } = await searchParams;

  return (
    <>
      <LandingHeader />
      <ExpertContactsMarketplace targetExpertId={expert} />
      <LandingFooter variant="light" />
    </>
  );
}
