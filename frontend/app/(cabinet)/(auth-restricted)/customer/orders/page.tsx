"use client";

import { RoleGuard } from "@/source/entities/session";
import { CustomerOrdersWidget } from "@/source/widgets/orders";

export default function CustomerOrdersPage() {
  return (
    <RoleGuard allowed={["CUSTOMER"]}>
      <CustomerOrdersWidget />
    </RoleGuard>
  );
}
