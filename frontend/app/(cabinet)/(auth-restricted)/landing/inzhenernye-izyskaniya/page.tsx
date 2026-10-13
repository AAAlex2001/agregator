import { SurveyLandingContent } from "@/source/widgets/landing/izyskaniya";

export const metadata = { title: "Инженерные изыскания" };

export default function AuthedSurveyLandingPage() {
  return <SurveyLandingContent basePath="/landing" />;
}
