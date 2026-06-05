from datetime import datetime

from pydantic import BaseModel


class LandingHeroDto(BaseModel):
    "Hero-блок лендинга (заголовок, подзаголовок, CTA и буллеты)."
    title: str
    subtitle: str
    button_text: str
    bullets: list[str]


class LandingSectionHeaderDto(BaseModel):
    "Заголовок секции лендинга (title + subtitle)."
    title: str
    subtitle: str


class LandingSectionHeadersDto(BaseModel):
    "Набор заголовков всех секций лендинга."
    how_it_works: LandingSectionHeaderDto
    key_advantages: LandingSectionHeaderDto
    orders: LandingSectionHeaderDto
    advantages: LandingSectionHeaderDto
    industries: LandingSectionHeaderDto
    reviews: LandingSectionHeaderDto
    faq: LandingSectionHeaderDto


class LandingStepDto(BaseModel):
    "Шаг в блоке «как это работает» / «преимущества» лендинга."
    id: int
    position: int
    title: str
    description: str
    sub_description: str
    icon: str


class LandingTabSteps(BaseModel):
    "Шаги, разбитые по ролям-вкладкам (клиент / эксперт / держатель лицензии)."
    client: list[LandingStepDto]
    expert: list[LandingStepDto]
    license_holder: list[LandingStepDto]


class LandingOrderExampleDto(BaseModel):
    "Пример заказа в витрине лендинга."
    id: int
    title: str
    price: str
    description: str


class LandingAdvantageDto(BaseModel):
    "Карточка преимущества платформы на лендинге."
    id: int
    title: str
    description: str
    icon_key: str
    photo: str


class LandingIndustryDto(BaseModel):
    "Карточка отрасли в блоке «индустрии» лендинга."
    id: int
    title: str
    description: list[str]
    photo: str


class LandingReviewDto(BaseModel):
    "Отзыв пользователя для блока reviews на лендинге."
    id: int
    reviewer: str
    position: str
    text: str
    created_at: datetime


class LandingFaqItemDto(BaseModel):
    "Пара вопрос-ответ в блоке FAQ лендинга."
    id: str
    question: str
    answer: str


class LandingPricingContentDto(BaseModel):
    "Тексты блока тарифов на лендинге для всех ролей."
    expert_title: str
    expert_subtitle: str
    expert_footnote: str
    customer_title: str
    customer_subtitle: str
    customer_headline: str
    customer_features: list[str]
    customer_footnote: str
    customer_cta_label: str
    customer_cta_href: str
    license_holder_title: str
    license_holder_subtitle: str
    license_holder_headline: str
    license_holder_features: list[str]
    license_holder_footnote: str
    license_holder_cta_label: str
    license_holder_cta_href: str


class LandingSnapshot(BaseModel):
    "Полный снимок данных лендинга, отдаваемый одним запросом."
    hero: LandingHeroDto
    section_headers: LandingSectionHeadersDto
    how_it_works: LandingTabSteps
    key_advantages: LandingTabSteps
    orders: list[LandingOrderExampleDto]
    advantages: list[LandingAdvantageDto]
    industries: list[LandingIndustryDto]
    reviews: list[LandingReviewDto]
    faq: list[LandingFaqItemDto]
    pricing_content: LandingPricingContentDto
