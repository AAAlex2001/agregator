import { PricingSection } from "@/source/widgets/pricing-section";
import LandingFooter from "../../shared/ui/Footer";
import { ServiceLandingFaq } from "../../shared/ui/ServiceLandingFaq";
import type { LandingPageData } from "../model/loadLandingPageData";
import { MainHero } from "./MainHero";
import { RoleHighlights } from "./RoleHighlights";
import { DirectionsSlider } from "./DirectionsSlider";
import LandingOrders from "./Orders";
import LandingAdvantages from "./Advantages";
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
  const { sectionHeaders, orders, advantages, reviews, faq, pricingContent } = snapshot;

  return (
    <div className={s.page}>
      <main>
        <MainHero />
        <DirectionsSlider basePath={articleBasePath} />
        <RoleHighlights />
        <LandingOrders
          orders={orders}
          title={sectionHeaders.orders.title}
          subtitle={sectionHeaders.orders.subtitle}
        />
        <LandingAdvantages
          features={advantages}
          title={sectionHeaders.advantages.title || "Почему выбирают Ресурс-Плюс"}
          subtitle={
            sectionHeaders.advantages.subtitle ||
            "Преимущества работы через платформу для заказчиков и исполнителей"
          }
        />
        <LandingNotificationsCta />
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
          navPrefix="news-nav"
        />
        <LandingArticlesPreview
          title="Блог платформы"
          subtitle="Развитие Ресурс-Плюс, кейсы и инструкции по работе с экспертизой"
          ctaHref={`${articleBasePath}/blog`}
          ctaLabel="Все статьи"
          items={blogPage.items}
          navPrefix="blog-nav"
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
