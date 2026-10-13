import { TechDiagLandingContent } from "@/source/widgets/landing/tech-diag";

export const metadata = { title: "Техническое освидетельствование и диагностирование" };

export default function AuthedTechDiagLandingPage() {
  return <TechDiagLandingContent basePath="/landing" />;
}
