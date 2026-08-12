import "server-only";

import { SERVER_API_URL } from "@/source/shared/api/config";
import type {
  AdvantageIconKey,
  LandingPricingContent,
  LandingSectionHeaders,
  LandingSnapshot,
  LandingStep,
} from "../model/types";

type ApiStep = {
  id: number;
  position: number;
  title: string;
  description: string;
  sub_description: string;
  icon: string;
};

type ApiSectionHeader = { title: string; subtitle: string };

type ApiSectionHeaders = {
  how_it_works: ApiSectionHeader;
  key_advantages: ApiSectionHeader;
  orders: ApiSectionHeader;
  advantages: ApiSectionHeader;
  industries: ApiSectionHeader;
  reviews: ApiSectionHeader;
  faq: ApiSectionHeader;
};

type ApiPricingContent = {
  expert_title: string;
  expert_subtitle: string;
  expert_footnote: string;
  customer_title: string;
  customer_subtitle: string;
  customer_headline: string;
  customer_features: string[];
  customer_footnote: string;
  customer_cta_label: string;
  customer_cta_href: string;
  license_holder_title: string;
  license_holder_subtitle: string;
  license_holder_headline: string;
  license_holder_features: string[];
  license_holder_footnote: string;
  license_holder_cta_label: string;
  license_holder_cta_href: string;
};

type ApiSnapshot = {
  hero: { title: string; subtitle: string; button_text: string; bullets: string[] };
  section_headers: ApiSectionHeaders;
  how_it_works: { client: ApiStep[]; expert: ApiStep[]; license_holder: ApiStep[] };
  key_advantages: { client: ApiStep[]; expert: ApiStep[]; license_holder: ApiStep[] };
  orders: Array<{ id: number; title: string; price: string; description: string }>;
  advantages: Array<{ id: number; title: string; description: string; icon_key: string; photo: string }>;
  industries: Array<{ id: number; title: string; description: string[]; photo: string }>;
  reviews: Array<{ id: number; reviewer: string; position: string; text: string }>;
  faq: Array<{ id: string; question: string; answer: string }>;
  pricing_content: ApiPricingContent;
};

export async function loadLandingSnapshot(): Promise<LandingSnapshot> {
  const response = await fetch(`${SERVER_API_URL}/public/landing`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Не удалось загрузить контент лендинга: ${response.status}`);
  }
  const api = (await response.json()) as ApiSnapshot;

  return {
    hero: {
      title: api.hero.title,
      subtitle: api.hero.subtitle,
      buttonText: api.hero.button_text,
      bullets: api.hero.bullets ?? [],
    },
    sectionHeaders: mapSectionHeaders(api.section_headers),
    howItWorks: {
      client: api.how_it_works.client.map(mapStep),
      expert: api.how_it_works.expert.map(mapStep),
      licenseHolder: (api.how_it_works.license_holder ?? []).map(mapStep),
    },
    keyAdvantages: {
      client: api.key_advantages.client.map(mapStep),
      expert: api.key_advantages.expert.map(mapStep),
      licenseHolder: (api.key_advantages.license_holder ?? []).map(mapStep),
    },
    orders: api.orders.map((order) => ({
      title: order.title,
      price: order.price,
      description: order.description,
    })),
    advantages: api.advantages.map((advantage) => ({
      id: advantage.id,
      title: advantage.title,
      description: advantage.description,
      iconKey: advantage.icon_key as AdvantageIconKey,
      photo: advantage.photo,
    })),
    industries: api.industries.map((industry) => ({
      id: industry.id,
      title: industry.title,
      description: industry.description,
      photo: industry.photo,
    })),
    reviews: api.reviews.map((review) => ({
      id: review.id,
      reviewer: review.reviewer,
      position: review.position,
      text: review.text,
    })),
    faq: api.faq.map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
    })),
    pricingContent: mapPricingContent(api.pricing_content),
  };
}

function mapStep(step: ApiStep): LandingStep {
  return {
    id: step.position,
    title: step.title,
    description: step.description,
    icon: step.icon,
    subDescription: step.sub_description || undefined,
  };
}

function mapSectionHeaders(api: ApiSectionHeaders): LandingSectionHeaders {
  return {
    howItWorks: api.how_it_works,
    keyAdvantages: api.key_advantages,
    orders: api.orders,
    advantages: api.advantages,
    industries: api.industries,
    reviews: api.reviews,
    faq: api.faq,
  };
}

function mapPricingContent(api: ApiPricingContent): LandingPricingContent {
  return {
    expertTitle: api.expert_title,
    expertSubtitle: api.expert_subtitle,
    expertFootnote: api.expert_footnote,
    customerTitle: api.customer_title,
    customerSubtitle: api.customer_subtitle,
    customerHeadline: api.customer_headline,
    customerFeatures: api.customer_features ?? [],
    customerFootnote: api.customer_footnote,
    customerCtaLabel: api.customer_cta_label,
    customerCtaHref: api.customer_cta_href,
    licenseHolderTitle: api.license_holder_title ?? "",
    licenseHolderSubtitle: api.license_holder_subtitle ?? "",
    licenseHolderHeadline: api.license_holder_headline ?? "",
    licenseHolderFeatures: api.license_holder_features ?? [],
    licenseHolderFootnote: api.license_holder_footnote ?? "",
    licenseHolderCtaLabel: api.license_holder_cta_label ?? "",
    licenseHolderCtaHref: api.license_holder_cta_href ?? "",
  };
}
