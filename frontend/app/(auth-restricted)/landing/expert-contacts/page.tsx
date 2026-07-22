"use client";

import { ExpertContactsMarketplace } from "@/source/features/expert-contacts";
import { RoleGuard } from "@/source/features/session";

export default function ExpertContactsPage() {
  return (
    <RoleGuard allowed={["EXPERT", "CUSTOMER", "LICENSE_HOLDER"]}>
      <ExpertContactsMarketplace />
    </RoleGuard>
  );
}
