import { AuditLandingContent } from "@/source/widgets/landing/audit-supb";

export const dynamic = "force-dynamic";

export default function AuthedAuditLandingPage() {
  return <AuditLandingContent basePath="/landing" />;
}
