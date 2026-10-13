import { KadastrLandingContent } from "@/source/widgets/landing/kadastrovye-raboty";

export const dynamic = "force-dynamic";

export default function AuthedKadastrLandingPage() {
  return <KadastrLandingContent basePath="/landing" />;
}
