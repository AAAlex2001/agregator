"use client";

import { RoleGuard } from "@/source/features/session";
import { ZepbRegistryWidget } from "@/source/widgets/zepb-registry";

export default function AuthRestrictedZepbRegistryPage() {
  return (
    <RoleGuard allowed={["EXPERT", "LICENSE_HOLDER"]}>
      <ZepbRegistryWidget homeHref="/landing" />
    </RoleGuard>
  );
}
