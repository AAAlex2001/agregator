import type { ReactNode } from "react";
import {
  LandingHero,
  LandingHowItWorks,
  LandingKeyAdvantages,
  LandingServiceHero,
  LandingDirectionNews,
  LandingSearchBlock,
  LandingServiceFaq,
  LandingServiceRoles,
  StartWorkingButton,
} from "@/source/widgets/landing";
import { SurveySeoText } from "./SeoText";
import {
  SURVEY_BULLETS,
  SURVEY_CLAIM,
  SURVEY_COVER_VIDEO,
  SURVEY_FAQ,
  SURVEY_HOW_IT_WORKS,
  SURVEY_KEY_ADVANTAGES,
  SURVEY_KEY_ADVANTAGES_SUBTITLE,
  SURVEY_KEY_ADVANTAGES_TITLE,
  SURVEY_ROLES,
  SURVEY_SUBTITLE,
  SURVEY_TITLE,
} from "../model/content";
import s from "./survey-landing-content.module.scss";

interface Props {
  basePath?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function SurveyLandingContent({ basePath = "", header, footer }: Props) {
  return (
    <div className={s.page}>
      {header}
      <main>
        <LandingHero basePath={basePath} activeHref="/inzhenernye-izyskaniya" />
        <LandingServiceHero
          title={SURVEY_TITLE}
          subtitle={SURVEY_SUBTITLE}
          bullets={SURVEY_BULLETS}
        >
          <div className={s.cover}>
            <div className={s.coverImage}>
              <video
                className={s.coverVideo}
                src={SURVEY_COVER_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
            <p className={s.coverClaim}>{SURVEY_CLAIM}</p>
            <StartWorkingButton className={s.coverButton} />
          </div>
        </LandingServiceHero>

        <LandingHowItWorks
          clientSteps={SURVEY_HOW_IT_WORKS.client}
          expertSteps={SURVEY_HOW_IT_WORKS.expert}
          licenseHolderSteps={SURVEY_HOW_IT_WORKS.licenseHolder}
          title="Как это работает"
          subtitle="Путь от размещения ТЗ до готового отчёта — для заказчика, исполнителя и члена СРО."
        />
        <LandingKeyAdvantages
          clientSteps={SURVEY_KEY_ADVANTAGES.client}
          expertSteps={SURVEY_KEY_ADVANTAGES.expert}
          licenseHolderSteps={SURVEY_KEY_ADVANTAGES.licenseHolder}
          title={SURVEY_KEY_ADVANTAGES_TITLE}
          subtitle={SURVEY_KEY_ADVANTAGES_SUBTITLE}
        />
        <LandingDirectionNews
          direction="SURVEY"
          basePath={basePath}
          subtitle="Технологии съёмки и БПЛА, мониторинг мерзлоты, экспертиза результатов и рынок изысканий"
        />
        <LandingServiceRoles roles={SURVEY_ROLES} />
        <LandingSearchBlock />
        <LandingServiceFaq
          items={SURVEY_FAQ}
          subtitle="Какие изыскания можно заказать, кто их выполняет и зачем нужен член СРО."
        />
        <SurveySeoText />
      </main>
      {footer}
    </div>
  );
}
