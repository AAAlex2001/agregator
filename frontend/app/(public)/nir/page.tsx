import type { Metadata } from "next";
import {
  LandingHeader,
  LandingServiceHero,
  LandingSearchBlock,
  LandingOtherDirections,
  LandingExpertsMap,
  LandingFooter,
  type ServiceLandingBullet,
} from "@/source/widgets/landing";
import { ServiceRequestForm } from "@/source/features/service-request";
import s from "./page.module.scss";

export const metadata: Metadata = {
  title: "Проведение НИР и лабораторные исследования — подбор специалистов",
  description:
    "Помощь в проведении научно-исследовательских работ (НИР) и лабораторных исследований: подбор специалистов, дефектоскопия, неразрушающий контроль, лаборатория неразрушающего контроля. Разместите заявку и получите отклики исполнителей.",
  keywords: [
    "проведение НИР",
    "научно исследовательская работа",
    "выполнение научно исследовательской работы",
    "подбор специалистов",
    "лабораторные исследования",
    "дефектоскопист",
    "неразрушающий контроль",
    "лаборатория неразрушающего контроля",
  ],
  alternates: { canonical: "/nir" },
  robots: { index: true, follow: true },
};

const BULLETS: ServiceLandingBullet[] = [
  {
    title: "Опишите задачу",
    text: "Укажите тему НИР или нужные лабораторные исследования и требования к исполнителю.",
  },
  {
    title: "Получите отклики",
    text: "Аттестованные специалисты и лаборатории неразрушающего контроля откликнутся с ценой и сроками.",
  },
  {
    title: "Выберите исполнителя",
    text: "Сравните опыт и предложения, выберите подходящего исполнителя — напрямую, без посредников.",
  },
];

export default function NirLandingPage() {
  return (
    <div className={s.page}>
      <LandingHeader />
      <main>
        <LandingServiceHero
          title="Помощь в проведении НИР, подбор специалистов"
          subtitle="Проведение научно-исследовательских работ и лабораторных исследований: дефектоскопия, неразрушающий контроль и подбор специалистов под вашу задачу."
          bullets={BULLETS}
        >
          <ServiceRequestForm />
        </LandingServiceHero>
        <LandingSearchBlock />
        <LandingExpertsMap />
        <LandingOtherDirections currentSlug="nir" />
      </main>
      <LandingFooter variant="light" />
    </div>
  );
}
