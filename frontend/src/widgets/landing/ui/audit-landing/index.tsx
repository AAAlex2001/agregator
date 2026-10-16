import {
  AUDIT_AUDIENCE,
  AUDIT_BULLETS,
  AUDIT_CLAIM,
  AUDIT_COVER_VIDEO,
  AUDIT_FAQ,
  AUDIT_PURPOSE,
  AUDIT_ROLES,
  AUDIT_SUBTITLE,
  AUDIT_TITLE,
} from "../../config/audit";
import type { ServiceLandingProps } from "../../model/types";
import { AuditAboutText } from "../audit-about-text";
import { LandingFaq } from "../landing-faq";
import { ServiceCover } from "../service-cover";
import { ServiceDescription } from "../service-description";
import { ServiceHero } from "../service-hero";
import { ServiceNews } from "../service-news";
import { ServicePage } from "../service-page";
import { ServiceRoles } from "../service-roles";
import { ServiceSection } from "../service-section";
import { ServiceShowcase } from "../service-showcase";

/** Собирает страницу аудита системы управления промышленной безопасностью. */
export function AuditLanding({
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
      direction="AUDIT_SUPB"
      header={header}
      footer={footer}
    >
      {navigation}
      <ServiceHero
        title={AUDIT_TITLE}
        subtitle={AUDIT_SUBTITLE}
        bullets={AUDIT_BULLETS}
      >
        <ServiceCover
          direction="AUDIT_SUPB"
          video={AUDIT_COVER_VIDEO}
          claim={AUDIT_CLAIM}
        />
      </ServiceHero>
      <ServiceDescription
        id="chto-eto"
        title="Что это такое"
        subtitle="Независимая оценка того, как система управления промышленной безопасностью работает на самом деле."
        paragraphs={AUDIT_PURPOSE}
      />
      <ServiceSection
        id="dlya-kogo"
        title="Для кого это нужно"
        subtitle="Кому аудит СУПБ обязателен по закону, а кому даёт снижение категории риска и меньше проверок."
      >
        <ServiceShowcase items={AUDIT_AUDIENCE} />
      </ServiceSection>
      <ServiceNews
        direction="AUDIT_SUPB"
        subtitle="Требования к аудиту СУПБ, категории риска и практика проверок Ростехнадзора"
        items={news}
        articleBasePath={articleBasePath}
      />
      <ServiceRoles
        roles={AUDIT_ROLES}
        onRegister={onRegister}
      />
      {search}
      <LandingFaq
        items={AUDIT_FAQ}
        subtitle="Кому аудит обязателен, как он влияет на категорию риска и кто вправе его проводить."
      />
      <AuditAboutText />
    </ServicePage>
  );
}
