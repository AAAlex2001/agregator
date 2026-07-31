export { default as LandingHero } from "./ui/Hero";
export { default as LandingComingSoon } from "./ui/ComingSoon";
export { default as LandingHowItWorks } from "./ui/HowItWorks";
export { default as LandingKeyAdvantages } from "./ui/KeyAdvantages";
export { default as LandingOrders } from "./ui/Orders";
export { default as LandingAdvantages } from "./ui/Advantages";
export { default as LandingIndustryDirections } from "./ui/IndustryDirections";
export { default as LandingReviews } from "./ui/Reviews";
export { default as LandingCtaFooter } from "./ui/CtaFooter";
export { default as LandingNotificationsCta } from "./ui/NotificationsCta";
export { default as LandingArticlesPreview } from "./ui/ArticlesPreview";
export { default as LandingSeoText } from "./ui/SeoText";
export { LandingSections } from "./ui/LandingSections";

export { loadLandingSnapshot } from "./model/landing.data";
export { loadLandingPageData } from "./model/loadLandingPageData";
export type { LandingPageData } from "./model/loadLandingPageData";

export type {
  AdvantageIconKey,
  LandingAdvantage,
  LandingFaqItem,
  LandingHeroContent,
  LandingIndustry,
  LandingOrder,
  LandingReview,
  LandingSectionHeader,
  LandingSectionHeaders,
  LandingSnapshot,
  LandingStep,
} from "./model/landing.data";
