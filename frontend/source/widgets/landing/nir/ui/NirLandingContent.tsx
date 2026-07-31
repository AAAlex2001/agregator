import type { ReactNode } from "react";
import {
  LandingServiceHero,
  LandingSearchBlock,
  LandingExpertsMap,
  LandingServiceFaq,
  LandingOtherDirections,
} from "@/source/widgets/landing";
import { ServiceRequestForm } from "@/source/features/service-request";
import { NirSeoText } from "./SeoText";
import { NIR_BULLETS, NIR_FAQ, NIR_SUBTITLE, NIR_TITLE } from "../model/content";
import s from "./nir-landing-content.module.scss";

interface Props {
  /** Префикс ссылок для авторизованного лендинга ("/landing"). */
  basePath?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function NirLandingContent({ basePath = "", header, footer }: Props) {
  return (
    <div className={s.page}>
      {header}
      <main>
        <LandingServiceHero title={NIR_TITLE} subtitle={NIR_SUBTITLE} bullets={NIR_BULLETS}>
          <ServiceRequestForm />
        </LandingServiceHero>
        <LandingSearchBlock />
        <LandingExpertsMap />
        <LandingServiceFaq
          items={NIR_FAQ}
          subtitle="Какая лаборатория вправе выполнять неразрушающий контроль, как проверить дефектоскописта и что входит в НИР."
        />
        <NirSeoText />
        <LandingOtherDirections currentSlug="nir" basePath={basePath} />
      </main>
      {footer}
    </div>
  );
}
