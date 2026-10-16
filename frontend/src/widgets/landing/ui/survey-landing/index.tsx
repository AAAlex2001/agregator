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
} from "../../config/survey";
import type { ServiceLandingProps } from "../../model/types";
import { LandingFaq } from "../landing-faq";
import { ServiceCover } from "../service-cover";
import { ServiceHero } from "../service-hero";
import { ServiceNews } from "../service-news";
import { ServicePage } from "../service-page";
import { ServiceRoles } from "../service-roles";
import { ServiceSteps } from "../service-steps";
import { SurveyAboutText } from "../survey-about-text";

/** Собирает страницу инженерных изысканий с порядком работы и преимуществами. */
export function SurveyLanding({
  navigation,
  search,
  news,
  onRegister,
  header,
  footer,
  articleBasePath = "",
}: ServiceLandingProps) {
  return (
    <ServicePage
      direction="SURVEY"
      header={header}
      footer={footer}
    >
      {navigation}
      <ServiceHero
        title={SURVEY_TITLE}
        subtitle={SURVEY_SUBTITLE}
        bullets={SURVEY_BULLETS}
      >
        <ServiceCover
          direction="SURVEY"
          video={SURVEY_COVER_VIDEO}
          claim={SURVEY_CLAIM}
        />
      </ServiceHero>
      <ServiceSteps
        variant="process"
        title="Как это работает"
        subtitle="Путь от размещения ТЗ до готового отчёта — для заказчика, исполнителя и члена СРО."
        clientSteps={SURVEY_HOW_IT_WORKS.client}
        expertSteps={SURVEY_HOW_IT_WORKS.expert}
        licenseHolderSteps={SURVEY_HOW_IT_WORKS.license_holder}
      />
      <ServiceSteps
        variant="advantages"
        title={SURVEY_KEY_ADVANTAGES_TITLE}
        subtitle={SURVEY_KEY_ADVANTAGES_SUBTITLE}
        clientSteps={SURVEY_KEY_ADVANTAGES.client}
        expertSteps={SURVEY_KEY_ADVANTAGES.expert}
        licenseHolderSteps={SURVEY_KEY_ADVANTAGES.license_holder}
      />
      <ServiceNews
        direction="SURVEY"
        subtitle="Технологии съёмки и БПЛА, мониторинг мерзлоты, экспертиза результатов и рынок изысканий"
        items={news}
        articleBasePath={articleBasePath}
      />
      <ServiceRoles
        roles={SURVEY_ROLES}
        onRegister={onRegister}
      />
      {search}
      <LandingFaq
        items={SURVEY_FAQ}
        subtitle="Какие изыскания можно заказать, кто их выполняет и зачем нужен член СРО."
      />
      <SurveyAboutText />
    </ServicePage>
  );
}
