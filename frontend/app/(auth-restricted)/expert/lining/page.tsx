"use client";

import { RoleGuard } from "@/source/features/session";
import { LiningWidget } from "@/source/widgets/lining";

export default function LiningPage() {
  return (
    <RoleGuard allowed={["EXPERT"]}>
      <LiningWidget />
    </RoleGuard>
  );
}
