import {
  ECOLOGY_BULLETS,
  ECOLOGY_CLAIM,
  ECOLOGY_COVER_VIDEO,
  ECOLOGY_FAQ,
  ECOLOGY_HOW_IT_WORKS,
  ECOLOGY_KEY_ADVANTAGES,
  ECOLOGY_KEY_ADVANTAGES_SUBTITLE,
  ECOLOGY_KEY_ADVANTAGES_TITLE,
  ECOLOGY_ROLES,
  ECOLOGY_SUBTITLE,
  ECOLOGY_TITLE,
} from "../../config/ecology";
import type { ServiceLandingProps } from "../../model/types";
import { EcologyAboutText } from "../ecology-about-text";
import { LandingFaq } from "../landing-faq";
import { ServiceCover } from "../service-cover";
import { ServiceHero } from "../service-hero";
import { ServiceNews } from "../service-news";
import { ServicePage } from "../service-page";
import { ServiceRoles } from "../service-roles";
import { ServiceSteps } from "../service-steps";

/** Собирает страницу экологических услуг для заказчиков и исполнителей. */
export function EcologyLanding({
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
      direction="ECOLOGY"
      header={header}
      footer={footer}
    >
      {navigation}
      <ServiceHero
        title={ECOLOGY_TITLE}
        subtitle={ECOLOGY_SUBTITLE}
        bullets={ECOLOGY_BULLETS}
      >
        <ServiceCover
          direction="ECOLOGY"
          video={ECOLOGY_COVER_VIDEO}
          claim={ECOLOGY_CLAIM}
        />
      </ServiceHero>
      <ServiceSteps
        variant="process"
        title="Как это работает"
        subtitle="Путь от размещения задачи до готовой экологической документации — для заказчика и исполнителя."
        clientSteps={ECOLOGY_HOW_IT_WORKS.client}
        expertSteps={ECOLOGY_HOW_IT_WORKS.expert}
        licenseHolderSteps={ECOLOGY_HOW_IT_WORKS.license_holder}
      />
      <ServiceSteps
        variant="advantages"
        title={ECOLOGY_KEY_ADVANTAGES_TITLE}
        subtitle={ECOLOGY_KEY_ADVANTAGES_SUBTITLE}
        clientSteps={ECOLOGY_KEY_ADVANTAGES.client}
        expertSteps={ECOLOGY_KEY_ADVANTAGES.expert}
        licenseHolderSteps={ECOLOGY_KEY_ADVANTAGES.license_holder}
      />
      <ServiceNews
        direction="ECOLOGY"
        subtitle="КЭР и экосбор, требования Росприроднадзора, НДТ и практика экологического сопровождения"
        items={news}
        articleBasePath={articleBasePath}
      />
      <ServiceRoles
        roles={ECOLOGY_ROLES}
        onRegister={onRegister}
      />
      {search}
      <LandingFaq
        items={ECOLOGY_FAQ}
        subtitle="Кому нужно экологическое сопровождение, какие требования к экологу и какие работы можно заказать."
      />
      <EcologyAboutText />
    </ServicePage>
  );
}
