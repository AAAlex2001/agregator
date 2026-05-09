"use client";

import { RoleGuard } from "@/source/features/session";
import { CustomerOrdersWidget } from "@/source/widgets/customer-orders";

export default function CustomerOrdersPage() {
  return (
    <RoleGuard allowed={["CUSTOMER"]}>
      <CustomerOrdersWidget />
    </RoleGuard>
  );
}
