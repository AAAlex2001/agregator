"use client";

import { RoleGuard } from "@/source/entities/session";
import { LaborResourcesWidget } from "@/source/widgets/labor-resources";

export default function ExpertSearchPage() {
  return (
    <RoleGuard allowed={["EXPERT", "CUSTOMER", "LICENSE_HOLDER"]}>
      <LaborResourcesWidget mode="license" />
    </RoleGuard>
  );
}
