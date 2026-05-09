from datetime import datetime
from typing import List

from pydantic import BaseModel


class LandingHeroDto(BaseModel):
    title: str
    subtitle: str
    button_text: str


class LandingSectionHeaderDto(BaseModel):
    title: str
    subtitle: str


class LandingSectionHeadersDto(BaseModel):
    how_it_works: LandingSectionHeaderDto
    key_advantages: LandingSectionHeaderDto
    orders: LandingSectionHeaderDto
    advantages: LandingSectionHeaderDto
    industries: LandingSectionHeaderDto
    reviews: LandingSectionHeaderDto
    faq: LandingSectionHeaderDto


class LandingStepDto(BaseModel):
    id: int
    position: int
    title: str
    description: str
    sub_description: str
    icon: str


class LandingTabSteps(BaseModel):
    client: List[LandingStepDto]
    expert: List[LandingStepDto]
    license_holder: List[LandingStepDto]


class LandingOrderExampleDto(BaseModel):
    id: int
    title: str
    price: str
    description: str


class LandingAdvantageDto(BaseModel):
    id: int
    title: str
    description: str
    icon_key: str
    photo: str


class LandingIndustryDto(BaseModel):
    id: int
    title: str
    description: List[str]
    photo: str


class LandingReviewDto(BaseModel):
    id: int
    reviewer: str
    position: str
    text: str
    created_at: datetime


class LandingFaqItemDto(BaseModel):
    id: str
    question: str
    answer: str


class LandingPricingContentDto(BaseModel):
    expert_title: str
    expert_subtitle: str
    expert_footnote: str
    customer_title: str
    customer_subtitle: str
    customer_headline: str
    customer_features: List[str]
    customer_footnote: str
    customer_cta_label: str
    customer_cta_href: str
    license_holder_title: str
    license_holder_subtitle: str
    license_holder_headline: str
    license_holder_features: List[str]
    license_holder_footnote: str
    license_holder_cta_label: str
    license_holder_cta_href: str


class LandingSnapshot(BaseModel):
    hero: LandingHeroDto
    section_headers: LandingSectionHeadersDto
    how_it_works: LandingTabSteps
    key_advantages: LandingTabSteps
    orders: List[LandingOrderExampleDto]
    advantages: List[LandingAdvantageDto]
    industries: List[LandingIndustryDto]
    reviews: List[LandingReviewDto]
    faq: List[LandingFaqItemDto]
    pricing_content: LandingPricingContentDto
