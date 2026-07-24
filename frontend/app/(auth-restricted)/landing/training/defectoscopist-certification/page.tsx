"use client";

import { RoleGuard } from "@/source/features/session";
import { DefectoscopistCertificationWidget } from "@/source/widgets/defectoscopist-certification";

export default function AuthRestrictedDefectoscopistCertificationPage() {
  return (
    <RoleGuard allowed={["EXPERT", "LICENSE_HOLDER"]}>
      <DefectoscopistCertificationWidget homeHref="/landing" />
    </RoleGuard>
  );
}
