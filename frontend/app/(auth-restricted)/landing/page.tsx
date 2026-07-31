import { LandingSections, loadLandingPageData } from "@/source/widgets/landing";

export const dynamic = "force-dynamic";

export default async function AuthRestrictedLandingPage() {
  const data = await loadLandingPageData();

  return <LandingSections data={data} articleBasePath="/landing" />;
}
