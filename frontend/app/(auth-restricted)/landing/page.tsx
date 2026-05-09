import ReactDOM from "react-dom";
import {
  LandingAdvantages,
  LandingCtaFooter,
  LandingFaq,
  LandingFooter,
  LandingHero,
  LandingHowItWorks,
  LandingIndustryDirections,
  LandingKeyAdvantages,
  LandingOrders,
  LandingReviews,
  loadLandingSnapshot,
} from "@/source/widgets/landing";
import { PricingSection } from "@/source/widgets/pricing-section";
import { fetchPricingPlans } from "@/source/features/pricing/subscribe";
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
  ] = await Promise.all([loadLandingSnapshot(), fetchPricingPlans()]);

  return (
    <div className={s.page}>
      <LandingHero
        title={hero.title}
        subtitle={hero.subtitle}
        buttonText={hero.buttonText}
      />
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
  );
}
