import { NirLandingContent } from "@/source/widgets/landing/nir";

export const dynamic = "force-dynamic";

export default function AuthedNirLandingPage() {
  return <NirLandingContent basePath="/landing" />;
}
