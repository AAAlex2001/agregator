"use client";

import { RoleGuard } from "@/source/features/session";
import { ExpertOrdersWidget } from "@/source/widgets/expert-orders";

export default function OrdersPage() {
  return (
    <RoleGuard allowed={["EXPERT"]}>
      <ExpertOrdersWidget />
    </RoleGuard>
  );
}
