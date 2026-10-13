"use client";

import { RoleGuard } from "@/source/entities/session";
import { LiningWidget } from "@/source/widgets/lining";

export default function LiningPage() {
  return (
    <RoleGuard allowed={["EXPERT"]}>
      <LiningWidget />
    </RoleGuard>
  );
}
