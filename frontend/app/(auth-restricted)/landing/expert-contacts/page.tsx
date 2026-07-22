import { ExpertContactsMarketplace } from "@/source/features/expert-contacts";
import { RoleGuard } from "@/source/features/session";

interface ExpertContactsPageProps {
  searchParams: Promise<{ expert?: string }>;
}

export default async function ExpertContactsPage({ searchParams }: ExpertContactsPageProps) {
  const { expert } = await searchParams;

  return (
    <RoleGuard allowed={["EXPERT", "CUSTOMER", "LICENSE_HOLDER"]}>
      <ExpertContactsMarketplace targetExpertId={expert} />
    </RoleGuard>
  );
}
