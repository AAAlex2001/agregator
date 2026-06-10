export type LandingStep = {
  id: number;
  title: string;
  description: string;
  icon: string;
  subDescription?: string;
};

export type LandingOrder = {
  title: string;
  price: string;
  description: string;
};

export type LandingReview = {
  id: number;
  reviewer: string;
  position: string;
  text: string;
};

export type LandingIndustry = {
  id: number;
  title: string;
  description: string[];
  photo: string;
};

export type LandingFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type AdvantageIconKey = "diploma" | "quick" | "search" | "comment";

export type LandingAdvantage = {
  id: number;
  title: string;
  description: string;
  iconKey: AdvantageIconKey;
  photo: string;
};

export type LandingSectionHeader = {
  title: string;
  subtitle: string;
};

export type LandingSectionHeaders = {
  howItWorks: LandingSectionHeader;
  keyAdvantages: LandingSectionHeader;
  orders: LandingSectionHeader;
  advantages: LandingSectionHeader;
  industries: LandingSectionHeader;
  reviews: LandingSectionHeader;
  faq: LandingSectionHeader;
};

export type LandingHeroContent = {
  title: string;
  subtitle: string;
  buttonText: string;
  bullets: string[];
};

export type LandingPricingContent = {
  expertTitle: string;
  expertSubtitle: string;
  expertFootnote: string;
  customerTitle: string;
  customerSubtitle: string;
  customerHeadline: string;
  customerFeatures: string[];
  customerFootnote: string;
  customerCtaLabel: string;
  customerCtaHref: string;
  licenseHolderTitle: string;
  licenseHolderSubtitle: string;
  licenseHolderHeadline: string;
  licenseHolderFeatures: string[];
  licenseHolderFootnote: string;
  licenseHolderCtaLabel: string;
  licenseHolderCtaHref: string;
};

export type LandingSnapshot = {
  hero: LandingHeroContent;
  sectionHeaders: LandingSectionHeaders;
  howItWorks: { client: LandingStep[]; expert: LandingStep[]; licenseHolder: LandingStep[] };
  keyAdvantages: { client: LandingStep[]; expert: LandingStep[]; licenseHolder: LandingStep[] };
  orders: LandingOrder[];
  advantages: LandingAdvantage[];
  industries: LandingIndustry[];
  reviews: LandingReview[];
  faq: LandingFaqItem[];
  pricingContent: LandingPricingContent;
};
