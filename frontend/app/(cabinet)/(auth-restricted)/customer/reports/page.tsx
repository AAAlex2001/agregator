"use client";

import { RoleGuard } from "@/source/entities/session";
import { ReportsWidget } from "@/source/widgets/reports";

export default function CustomerReportsPage() {
  return (
    <RoleGuard allowed={["CUSTOMER"]}>
      <ReportsWidget />
    </RoleGuard>
  );
}
