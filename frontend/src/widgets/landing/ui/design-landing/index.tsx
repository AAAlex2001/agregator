import {
  DESIGN_BULLETS,
  DESIGN_CLAIM,
  DESIGN_COVER_VIDEO,
  DESIGN_FAQ,
  DESIGN_HOW_IT_WORKS,
  DESIGN_KEY_ADVANTAGES,
  DESIGN_KEY_ADVANTAGES_SUBTITLE,
  DESIGN_KEY_ADVANTAGES_TITLE,
  DESIGN_ROLES,
  DESIGN_SUBTITLE,
  DESIGN_TITLE,
} from "../../config/design";
import type { ServiceLandingProps } from "../../model/types";
import { DesignAboutText } from "../design-about-text";
import { LandingFaq } from "../landing-faq";
import { ServiceCover } from "../service-cover";
import { ServiceHero } from "../service-hero";
import { ServiceNews } from "../service-news";
import { ServicePage } from "../service-page";
import { ServiceRoles } from "../service-roles";
import { ServiceSteps } from "../service-steps";

/** Собирает страницу проектирования с условиями работы для трёх ролей. */
export function DesignLanding({
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
      direction="DESIGN"
      header={header}
      footer={footer}
    >
      {navigation}
      <ServiceHero
        title={DESIGN_TITLE}
        subtitle={DESIGN_SUBTITLE}
        bullets={DESIGN_BULLETS}
      >
        <ServiceCover
          direction="DESIGN"
          video={DESIGN_COVER_VIDEO}
          claim={DESIGN_CLAIM}
        />
      </ServiceHero>
      <ServiceSteps
        variant="process"
        title="Как это работает"
        subtitle="Путь от размещения задачи до подписанного акта — для заказчика, исполнителя и держателя разрешительных документов."
        clientSteps={DESIGN_HOW_IT_WORKS.client}
        expertSteps={DESIGN_HOW_IT_WORKS.expert}
        licenseHolderSteps={DESIGN_HOW_IT_WORKS.license_holder}
      />
      <ServiceSteps
        variant="advantages"
        title={DESIGN_KEY_ADVANTAGES_TITLE}
        subtitle={DESIGN_KEY_ADVANTAGES_SUBTITLE}
        clientSteps={DESIGN_KEY_ADVANTAGES.client}
        expertSteps={DESIGN_KEY_ADVANTAGES.expert}
        licenseHolderSteps={DESIGN_KEY_ADVANTAGES.license_holder}
      />
      <ServiceNews
        direction="DESIGN"
        subtitle="ТИМ и экспертиза проектов, изменения градостроительных требований, рынок и российские САПР"
        items={news}
        articleBasePath={articleBasePath}
      />
      <ServiceRoles
        roles={DESIGN_ROLES}
        onRegister={onRegister}
      />
      {search}
      <LandingFaq
        items={DESIGN_FAQ}
        subtitle="Кто вправе проектировать, как проверить специалиста и как устроена работа с разрешительными документами."
      />
      <DesignAboutText />
    </ServicePage>
  );
}
