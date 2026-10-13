"use client";

import { RoleGuard } from "@/source/entities/session";
import { HazardWidget } from "@/source/widgets/hazard";

export default function HazardPage() {
  return (
    <RoleGuard allowed={["EXPERT"]}>
      <HazardWidget />
    </RoleGuard>
  );
}
