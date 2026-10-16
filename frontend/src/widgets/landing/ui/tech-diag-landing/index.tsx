import {
  TECH_DIAG_BULLETS,
  TECH_DIAG_CLAIM,
  TECH_DIAG_COVER_VIDEO,
  TECH_DIAG_DEFINITIONS,
  TECH_DIAG_FAQ,
  TECH_DIAG_ROLES,
  TECH_DIAG_SUBTITLE,
  TECH_DIAG_TITLE,
} from "../../config/tech-diag";
import type { ServiceLandingProps } from "../../model/types";
import { LandingFaq } from "../landing-faq";
import { ServiceCover } from "../service-cover";
import { ServiceDescription } from "../service-description";
import { ServiceHero } from "../service-hero";
import { ServiceNews } from "../service-news";
import { ServicePage } from "../service-page";
import { ServiceRoles } from "../service-roles";
import { TechDiagAboutText } from "../tech-diag-about-text";

/** Собирает страницу технического диагностирования и неразрушающего контроля. */
export function TechDiagLanding({
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
      direction="TECH_DIAG"
      header={header}
      footer={footer}
    >
      {navigation}
      <ServiceHero
        title={TECH_DIAG_TITLE}
        subtitle={TECH_DIAG_SUBTITLE}
        bullets={TECH_DIAG_BULLETS}
      >
        <ServiceCover
          direction="TECH_DIAG"
          video={TECH_DIAG_COVER_VIDEO}
          claim={TECH_DIAG_CLAIM}
        />
      </ServiceHero>
      <ServiceDescription
        id="chto-eto"
        title="Что это такое"
        subtitle="Полная картина технического состояния объекта: от оценки возможности эксплуатации до контроля отдельных элементов."
        paragraphs={TECH_DIAG_DEFINITIONS}
      />
      <ServiceNews
        direction="TECH_DIAG"
        subtitle="Методы неразрушающего контроля, диагностирование оборудования и аттестация лабораторий"
        items={news}
        articleBasePath={articleBasePath}
      />
      <ServiceRoles
        roles={TECH_DIAG_ROLES}
        onRegister={onRegister}
      />
      {search}
      <LandingFaq
        items={TECH_DIAG_FAQ}
        subtitle="Кто вправе выполнять неразрушающий контроль, как проверить дефектоскописта и какие методы бывают."
      />
      <TechDiagAboutText />
    </ServicePage>
  );
}
