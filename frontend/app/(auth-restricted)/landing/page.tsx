import ReactDOM from "react-dom";
import {
  LandingAdvantages,
  LandingArticlesPreview,
  LandingCtaFooter,
  LandingFaq,
  LandingFooter,
  LandingHero,
  LandingHowItWorks,
  LandingIndustryDirections,
  LandingKeyAdvantages,
  LandingOrders,
  LandingReviews,
  LandingSearchBlock,
  loadLandingSnapshot,
} from "@/source/widgets/landing";
import { AuthedHeader } from "@/source/widgets/authed-header";
import { PricingSection } from "@/source/widgets/pricing-section";
import { fetchPricingPlans } from "@/source/features/pricing/subscribe";
import { fetchArticleList } from "@/source/entities/article";
import s from "./landing.module.scss";

export const dynamic = "force-dynamic";

export default async function AuthRestrictedLandingPage() {
  ReactDOM.preload("/hero_svg.webp", { as: "image", fetchPriority: "high" });

  const [
    {
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
    },
    pricingPlans,
    newsPage,
    blogPage,
  ] = await Promise.all([
    loadLandingSnapshot(),
    fetchPricingPlans(),
    fetchArticleList({ kind: "news", limit: 3, offset: 0 }, { server: true }),
    fetchArticleList({ kind: "blog", limit: 3, offset: 0 }, { server: true }),
  ]);

  return (
    <>
      <AuthedHeader />
      <div className={s.page}>
        <LandingHero
          title={hero.title}
          subtitle={hero.subtitle}
          buttonText={hero.buttonText}
        />
        <LandingSearchBlock />
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
          ctaHref="/news"
          ctaLabel="Все новости"
          items={newsPage.items}
        />
        <LandingArticlesPreview
          title="Блог платформы"
          subtitle="Развитие Ресурс-Плюс, кейсы и инструкции по работе с экспертизой"
          ctaHref="/blog"
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
            redirectOnSelect="/register"
          />
        ) : null}
        <LandingFaq
          items={faq}
          title={sectionHeaders.faq.title}
          subtitle={sectionHeaders.faq.subtitle}
        />
        <LandingCtaFooter />
        <LandingFooter />
      </div>
    </>
  );
}
