import {
  RESEARCH_BULLETS,
  RESEARCH_CLAIM,
  RESEARCH_COVER_VIDEO,
  RESEARCH_FAQ,
  RESEARCH_PURPOSE,
  RESEARCH_ROLES,
  RESEARCH_SUBTITLE,
  RESEARCH_TITLE,
} from "../../config/research";
import type { ServiceLandingProps } from "../../model/types";
import { LandingFaq } from "../landing-faq";
import { ResearchAboutText } from "../research-about-text";
import { ServiceCover } from "../service-cover";
import { ServiceDescription } from "../service-description";
import { ServiceHero } from "../service-hero";
import { ServiceNews } from "../service-news";
import { ServicePage } from "../service-page";
import { ServiceRoles } from "../service-roles";

/** Собирает страницу научно-исследовательских работ и лабораторных испытаний. */
export function ResearchLanding({
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
      direction="RESEARCH"
      header={header}
      footer={footer}
    >
      {navigation}
      <ServiceHero
        title={RESEARCH_TITLE}
        subtitle={RESEARCH_SUBTITLE}
        bullets={RESEARCH_BULLETS}
      >
        <ServiceCover
          direction="RESEARCH"
          video={RESEARCH_COVER_VIDEO}
          claim={RESEARCH_CLAIM}
        />
      </ServiceHero>
      <ServiceDescription
        id="zachem-nir"
        title="Зачем нужны НИР"
        subtitle="От проверки идеи расчётами до доказательной базы для экспертизы и сертификации."
        paragraphs={RESEARCH_PURPOSE}
      />
      <ServiceNews
        direction="RESEARCH"
        subtitle="Господдержка НИОКР, аккредитация лабораторий и практика испытаний для промышленности"
        items={news}
        articleBasePath={articleBasePath}
      />
      <ServiceRoles
        roles={RESEARCH_ROLES}
        onRegister={onRegister}
      />
      {search}
      <LandingFaq
        items={RESEARCH_FAQ}
        subtitle="Какая лаборатория вправе выполнять неразрушающий контроль, как проверить дефектоскописта и что входит в НИР."
      />
      <ResearchAboutText />
    </ServicePage>
  );
}
