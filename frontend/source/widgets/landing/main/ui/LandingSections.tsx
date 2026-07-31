import { PricingSection } from "@/source/widgets/pricing-section";
import LandingSearchBlock from "../../shared/ui/SearchBlock";
import LandingFooter from "../../shared/ui/Footer";
import { ServiceLandingFaq } from "../../shared/ui/ServiceLandingFaq";
import type { LandingPageData } from "../model/loadLandingPageData";
import LandingHero from "./Hero";
import LandingHowItWorks from "./HowItWorks";
import LandingKeyAdvantages from "./KeyAdvantages";
import LandingOrders from "./Orders";
import LandingAdvantages from "./Advantages";
import LandingIndustryDirections from "./IndustryDirections";
import LandingReviews from "./Reviews";
import LandingArticlesPreview from "./ArticlesPreview";
import LandingNotificationsCta from "./NotificationsCta";
import LandingSeoText from "./SeoText";
import LandingCtaFooter from "./CtaFooter";
import s from "./landing-sections.module.scss";

interface Props {
  data: LandingPageData;
  articleBasePath?: string;
}

export function LandingSections({ data, articleBasePath = "" }: Props) {
  const { snapshot, pricingPlans, newsPage, blogPage } = data;
  const {
    hero,
    sectionHeaders,
    howItWorks,
    keyAdvantages,
    orders,
    advantages,
    industries,
    reviews,
    faq,
    pricingContent,
  } = snapshot;

  return (
    <div className={s.page}>
      <main>
        <LandingHero
          title={hero.title}
          subtitle={hero.subtitle}
          buttonText={hero.buttonText}
          bullets={hero.bullets}
        />
        <LandingSearchBlock />
        <LandingNotificationsCta />
        <LandingHowItWorks
          clientSteps={howItWorks.client}
          expertSteps={howItWorks.expert}
          licenseHolderSteps={howItWorks.licenseHolder}
          title={sectionHeaders.howItWorks.title}
          subtitle={sectionHeaders.howItWorks.subtitle}
        />
        <LandingKeyAdvantages
          clientSteps={keyAdvantages.client}
          expertSteps={keyAdvantages.expert}
          licenseHolderSteps={keyAdvantages.licenseHolder}
          title={sectionHeaders.keyAdvantages.title}
          subtitle={sectionHeaders.keyAdvantages.subtitle}
        />
        <LandingOrders
          orders={orders}
          title={sectionHeaders.orders.title}
          subtitle={sectionHeaders.orders.subtitle}
        />
        <LandingAdvantages features={advantages} />
        <LandingIndustryDirections
          industries={industries}
          title={sectionHeaders.industries.title}
          subtitle={sectionHeaders.industries.subtitle}
        />
        <LandingReviews
          reviews={reviews}
          title={sectionHeaders.reviews.title}
          subtitle={sectionHeaders.reviews.subtitle}
        />
        <LandingArticlesPreview
          title="Новости отрасли"
          subtitle="Что происходит в горной, нефтегазовой и других отраслях промышленности"
          ctaHref={`${articleBasePath}/news`}
          ctaLabel="Все новости"
          items={newsPage.items}
        />
        <LandingArticlesPreview
          title="Блог платформы"
          subtitle="Развитие Ресурс-Плюс, кейсы и инструкции по работе с экспертизой"
          ctaHref={`${articleBasePath}/blog`}
          ctaLabel="Все статьи"
          items={blogPage.items}
        />
        {pricingPlans.length > 0 ? (
          <PricingSection
            expert={{
              title: pricingContent.expertTitle,
              subtitle: pricingContent.expertSubtitle,
            }}
            customer={{
              title: pricingContent.customerTitle,
              subtitle: pricingContent.customerSubtitle,
            }}
            footnote={pricingContent.expertFootnote}
            plans={pricingPlans}
            customerHeadline={pricingContent.customerHeadline}
            customerFeatures={pricingContent.customerFeatures}
            customerFootnote={pricingContent.customerFootnote}
            customerCta={{
              label: pricingContent.customerCtaLabel,
              href: pricingContent.customerCtaHref,
            }}
            licenseHolder={{
              title: pricingContent.licenseHolderTitle,
              subtitle: pricingContent.licenseHolderSubtitle,
              headline: pricingContent.licenseHolderHeadline,
              features: pricingContent.licenseHolderFeatures,
              footnote: pricingContent.licenseHolderFootnote,
              cta: {
                label: pricingContent.licenseHolderCtaLabel,
                href: pricingContent.licenseHolderCtaHref,
              },
            }}
            openAuthOnSelect
          />
        ) : null}
        <ServiceLandingFaq
          items={faq}
          title={sectionHeaders.faq.title}
          subtitle={sectionHeaders.faq.subtitle}
          decoration
        />
        <LandingSeoText />
      </main>
      <LandingCtaFooter />
      <LandingFooter />
    </div>
  );
}
