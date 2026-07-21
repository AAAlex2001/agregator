"use client";

import { RoleGuard } from "@/source/features/session";
import { LaborResourcesWidget } from "@/source/widgets/labor-resources";

export default function EmploymentPage() {
  return (
    <RoleGuard allowed={["EXPERT", "CUSTOMER", "LICENSE_HOLDER"]}>
      <LaborResourcesWidget mode="expert" />
    </RoleGuard>
  );
}
