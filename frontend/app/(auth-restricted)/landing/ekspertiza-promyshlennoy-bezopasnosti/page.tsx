import { loadLandingSnapshot } from "@/source/entities/landing";
import { ExpertiseLandingContent } from "@/source/widgets/landing/expertise";

export default async function AuthedExpertiseLandingPage() {
  const snapshot = await loadLandingSnapshot();

  return <ExpertiseLandingContent snapshot={snapshot} basePath="/landing" />;
}
