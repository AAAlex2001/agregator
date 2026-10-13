"use client";

import { RoleGuard } from "@/source/entities/session";
import { ExpertOrdersWidget } from "@/source/widgets/orders";

export default function ExpertOrdersPage() {
  return (
    <RoleGuard allowed={["EXPERT"]}>
      <ExpertOrdersWidget />
    </RoleGuard>
  );
}
