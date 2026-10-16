/** Заголовок, описание и призыв к действию первого экрана из API. */
export interface LandingHero {
  title: string;
  subtitle: string;
  button_text: string;
  bullets: string[];
}

/** Заголовок и подзаголовок одного блока лендинга. */
export interface LandingSectionHeader {
  title: string;
  subtitle: string;
}

/** Заголовки блоков, которые редактор задаёт через API. */
export interface LandingSectionHeaders {
  how_it_works: LandingSectionHeader;
  key_advantages: LandingSectionHeader;
  orders: LandingSectionHeader;
  advantages: LandingSectionHeader;
  industries: LandingSectionHeader;
  reviews: LandingSectionHeader;
  faq: LandingSectionHeader;
}

/** Шаг работы с платформой; position задаёт номер, показанный пользователю. */
export interface LandingStep {
  id: number;
  position: number;
  title: string;
  description: string;
  sub_description: string;
  icon: string;
}

/** Шаги для заказчика, исполнителя и держателя разрешительных документов. */
export interface LandingRoleSteps {
  client: LandingStep[];
  expert: LandingStep[];
  license_holder: LandingStep[];
}

/** Пример заказа для публичной витрины платформы. */
export interface LandingOrderExample {
  id: number;
  title: string;
  price: string;
  description: string;
}

/** Преимущество платформы с фотографией и кодом иллюстрации. */
export interface LandingAdvantage {
  id: number;
  title: string;
  description: string;
  icon_key: string;
  photo: string;
}

/** Отрасль применения платформы с описанием и фотографией. */
export interface LandingIndustry {
  id: number;
  title: string;
  description: string[];
  photo: string;
}

/** Опубликованный отзыв пользователя из API. */
export interface LandingReview {
  id: number;
  reviewer: string;
  position: string;
  text: string;
  created_at: string;
}

/** Вопрос и ответ для раскрывающегося списка и SEO-разметки FAQ. */
export interface LandingFaqItem {
  id: string;
  question: string;
  answer: string;
}

/** Тексты блока тарифов для трёх ролей на платформе. */
export interface LandingPricingContent {
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
}

/** Публичный контент главной страницы и лендинга экспертизы из одного запроса. */
export interface LandingContent {
  hero: LandingHero;
  section_headers: LandingSectionHeaders;
  how_it_works: LandingRoleSteps;
  key_advantages: LandingRoleSteps;
  orders: LandingOrderExample[];
  advantages: LandingAdvantage[];
  industries: LandingIndustry[];
  reviews: LandingReview[];
  faq: LandingFaqItem[];
  pricing_content: LandingPricingContent;
}
