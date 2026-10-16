import {
  CADASTRAL_AUDIENCE,
  CADASTRAL_BULLETS,
  CADASTRAL_COVER_VIDEO,
  CADASTRAL_FAQ,
  CADASTRAL_ROLES,
  CADASTRAL_SERVICES,
  CADASTRAL_SUBTITLE,
  CADASTRAL_TITLE,
} from "../../config/cadastral";
import type { ServiceLandingProps } from "../../model/types";
import { CadastralAboutText } from "../cadastral-about-text";
import { LandingFaq } from "../landing-faq";
import { ServiceAudience } from "../service-audience";
import { ServiceCover } from "../service-cover";
import { ServiceHero } from "../service-hero";
import { ServiceNews } from "../service-news";
import { ServicePage } from "../service-page";
import { ServiceRoles } from "../service-roles";
import { ServiceSection } from "../service-section";
import { ServiceShowcase } from "../service-showcase";

/** Собирает страницу кадастровых работ с каталогом услуг и условиями участия. */
export function CadastralLanding({
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
      direction="CADASTRAL"
      header={header}
      footer={footer}
    >
      {navigation}
      <ServiceHero
        title={CADASTRAL_TITLE}
        subtitle={CADASTRAL_SUBTITLE}
        bullets={CADASTRAL_BULLETS}
      >
        <ServiceCover
          direction="CADASTRAL"
          video={CADASTRAL_COVER_VIDEO}
          claim="Кадастровые инженеры из СРО — по всей России"
        />
      </ServiceHero>
      <ServiceSection
        id="vidy-rabot"
        title="Виды кадастровых работ"
        subtitle="Разместите заявку на любую из работ — кадастровые инженеры из СРО откликнутся с ценой и сроками."
      >
        <ServiceShowcase items={CADASTRAL_SERVICES} />
      </ServiceSection>
      <ServiceAudience blocks={CADASTRAL_AUDIENCE} />
      <ServiceNews
        direction="CADASTRAL"
        subtitle="Изменения в законах о недвижимости, кадастровая оценка и практика земельных споров"
        items={news}
        articleBasePath={articleBasePath}
      />
      <ServiceRoles
        roles={CADASTRAL_ROLES}
        onRegister={onRegister}
      />
      {search}
      <LandingFaq
        items={CADASTRAL_FAQ}
        subtitle="Кто выполняет кадастровые работы, сколько они занимают и что делать с ошибками в ЕГРН."
      />
      <CadastralAboutText />
    </ServicePage>
  );
}
