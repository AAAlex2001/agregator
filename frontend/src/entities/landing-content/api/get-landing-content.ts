import "server-only";

import { SERVER_API_URL } from "@/shared/config/server-api";
import type { LandingContent } from "../model/types";

/** Загружает публичные тексты лендинга с прежними значениями для пустых блоков. */
export async function getLandingContent(): Promise<LandingContent> {
  const response = await fetch(`${SERVER_API_URL}/public/landing`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить контент лендинга: ${response.status}`);
  }

  const content: LandingContent = await response.json();
  const pricing = content.pricing_content;

  return {
    ...content,
    hero: {
      ...content.hero,
      bullets: content.hero.bullets ?? [],
    },
    how_it_works: {
      ...content.how_it_works,
      license_holder: content.how_it_works.license_holder ?? [],
    },
    key_advantages: {
      ...content.key_advantages,
      license_holder: content.key_advantages.license_holder ?? [],
    },
    pricing_content: {
      ...pricing,
      customer_features: pricing.customer_features ?? [],
      license_holder_title: pricing.license_holder_title ?? "",
      license_holder_subtitle: pricing.license_holder_subtitle ?? "",
      license_holder_headline: pricing.license_holder_headline ?? "",
      license_holder_features: pricing.license_holder_features ?? [],
      license_holder_footnote: pricing.license_holder_footnote ?? "",
      license_holder_cta_label: pricing.license_holder_cta_label ?? "",
      license_holder_cta_href: pricing.license_holder_cta_href ?? "",
    },
  };
}
