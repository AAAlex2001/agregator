import {
  FORENSIC_AUDIENCE,
  FORENSIC_BULLETS,
  FORENSIC_CLAIM,
  FORENSIC_COVER_VIDEO,
  FORENSIC_FAQ,
  FORENSIC_ROLES,
  FORENSIC_SUBTITLE,
  FORENSIC_TITLE,
} from "../../config/forensic";
import type { ServiceLandingProps } from "../../model/types";
import { ForensicAboutText } from "../forensic-about-text";
import { ForensicCatalog } from "../forensic-catalog";
import { LandingFaq } from "../landing-faq";
import { ServiceAudience } from "../service-audience";
import { ServiceCover } from "../service-cover";
import { ServiceHero } from "../service-hero";
import { ServiceNews } from "../service-news";
import { ServicePage } from "../service-page";
import { ServiceRoles } from "../service-roles";

/** Собирает страницу судебных экспертиз с каталогом исследований. */
export function ForensicLanding({
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
      direction="FORENSIC"
      header={header}
      footer={footer}
    >
      {navigation}
      <ServiceHero
        title={FORENSIC_TITLE}
        subtitle={FORENSIC_SUBTITLE}
        bullets={FORENSIC_BULLETS}
      >
        <ServiceCover
          direction="FORENSIC"
          video={FORENSIC_COVER_VIDEO}
          claim={FORENSIC_CLAIM}
        />
      </ServiceHero>
      <ForensicCatalog />
      <ServiceAudience blocks={FORENSIC_AUDIENCE} />
      <ServiceNews
        direction="FORENSIC"
        subtitle="Реформа судебно-экспертной деятельности, позиции судов и практика по видам экспертиз"
        items={news}
        articleBasePath={articleBasePath}
      />
      <ServiceRoles
        roles={FORENSIC_ROLES}
        onRegister={onRegister}
      />
      {search}
      <LandingFaq
        items={FORENSIC_FAQ}
        subtitle="Кто вправе давать заключение для суда, кто оплачивает экспертизу и как оспорить её выводы."
      />
      <ForensicAboutText />
    </ServicePage>
  );
}
