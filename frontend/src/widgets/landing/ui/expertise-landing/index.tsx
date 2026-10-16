import type { LandingContent } from "@/entities/landing-content";
import {
  EXPERTISE_BULLETS,
  EXPERTISE_CLAIM,
  EXPERTISE_COVER_VIDEO,
  EXPERTISE_FAQ,
  EXPERTISE_ROLES,
  EXPERTISE_SUBTITLE,
  EXPERTISE_TITLE,
} from "../../config/expertise";
import type { ServiceLandingProps } from "../../model/types";
import { ExpertiseAboutText } from "../expertise-about-text";
import { LandingFaq } from "../landing-faq";
import { ServiceCover } from "../service-cover";
import { ServiceHero } from "../service-hero";
import { ServiceIndustries } from "../service-industries";
import { ServiceNews } from "../service-news";
import { ServicePage } from "../service-page";
import { ServiceRoles } from "../service-roles";
import { ServiceSteps } from "../service-steps";

/** Данные страницы экспертизы, включая редактируемый контент из API. */
interface ExpertiseLandingProps extends ServiceLandingProps {
  content: LandingContent;
}

/** Собирает страницу экспертизы промышленной безопасности. */
export function ExpertiseLanding({
  content,
  navigation,
  search,
  news,
  onRegister,
  header,
  footer,
  articleBasePath = "",
}: ExpertiseLandingProps) {
  const headers = content.section_headers;

  return (
    <ServicePage
      direction="EXPERTISE"
      header={header}
      footer={footer}
    >
      {navigation}
      <ServiceHero
        title={EXPERTISE_TITLE}
        subtitle={EXPERTISE_SUBTITLE}
        bullets={EXPERTISE_BULLETS}
      >
        <ServiceCover
          direction="EXPERTISE"
          video={EXPERTISE_COVER_VIDEO}
          claim={EXPERTISE_CLAIM}
        />
      </ServiceHero>
      <ServiceSteps
        variant="process"
        title={headers.how_it_works.title}
        subtitle={headers.how_it_works.subtitle}
        clientSteps={content.how_it_works.client}
        expertSteps={content.how_it_works.expert}
        licenseHolderSteps={content.how_it_works.license_holder}
      />
      <ServiceSteps
        variant="advantages"
        title={headers.key_advantages.title}
        subtitle={headers.key_advantages.subtitle}
        clientSteps={content.key_advantages.client}
        expertSteps={content.key_advantages.expert}
        licenseHolderSteps={content.key_advantages.license_holder}
      />
      <ServiceIndustries
        industries={content.industries}
        title={headers.industries.title}
        subtitle={headers.industries.subtitle}
      />
      <ServiceNews
        direction="EXPERTISE"
        subtitle="Изменения в требованиях Ростехнадзора, разборы аварий и практика проведения ЭПБ"
        items={news}
        articleBasePath={articleBasePath}
      />
      <ServiceRoles
        roles={EXPERTISE_ROLES}
        onRegister={onRegister}
      />
      {search}
      <LandingFaq
        items={EXPERTISE_FAQ}
        subtitle="Когда ЭПБ обязательна, кто вправе её проводить и что происходит с заключением."
      />
      <ExpertiseAboutText />
    </ServicePage>
  );
}
