"use client";

import { RoleGuard } from "@/source/features/session";
import { LicenseHoldersView } from "@/source/widgets/license-holders";

export default function LicenseHoldersPage() {
  return (
    <RoleGuard allowed={["EXPERT"]}>
      <LicenseHoldersView />
    </RoleGuard>
  );
}
