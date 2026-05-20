from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.landing import (
    LandingAdvantage,
    LandingFaq,
    LandingHero,
    LandingIndustry,
    LandingOrderExample,
    LandingPricingContent,
    LandingReview,
    LandingSectionHeader,
    LandingStep,
)
from schemas.landing import (
    LandingAdvantageDto,
    LandingFaqItemDto,
    LandingHeroDto,
    LandingIndustryDto,
    LandingOrderExampleDto,
    LandingPricingContentDto,
    LandingReviewDto,
    LandingSectionHeaderDto,
    LandingSectionHeadersDto,
    LandingSnapshot,
    LandingStepDto,
    LandingTabSteps,
)


class LandingService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_snapshot(self) -> LandingSnapshot:
        return LandingSnapshot(
            hero=await self.get_hero(),
            section_headers=await self.get_section_headers(),
            how_it_works=await self.get_steps("how_it_works"),
            key_advantages=await self.get_steps("key_advantages"),
            orders=await self.get_orders(),
            advantages=await self.get_advantages(),
            industries=await self.get_industries(),
            reviews=await self.get_reviews(),
            faq=await self.get_faq(),
            pricing_content=await self.get_pricing_content(),
        )

    async def get_pricing_content(self) -> LandingPricingContentDto:
        row = (
            await self.db.execute(select(LandingPricingContent).limit(1))
        ).scalar_one_or_none()
        if row is None:
            return LandingPricingContentDto(
                expert_title="",
                expert_subtitle="",
                expert_footnote="",
                customer_title="",
                customer_subtitle="",
                customer_headline="",
                customer_features=[],
                customer_footnote="",
                customer_cta_label="",
                customer_cta_href="",
                license_holder_title="",
                license_holder_subtitle="",
                license_holder_headline="",
                license_holder_features=[],
                license_holder_footnote="",
                license_holder_cta_label="",
                license_holder_cta_href="",
            )
        return LandingPricingContentDto(
            expert_title=row.expert_title,
            expert_subtitle=row.expert_subtitle,
            expert_footnote=row.expert_footnote,
            customer_title=row.customer_title,
            customer_subtitle=row.customer_subtitle,
            customer_headline=row.customer_headline,
            customer_features=list(row.customer_features or []),
            customer_footnote=row.customer_footnote,
            customer_cta_label=row.customer_cta_label,
            customer_cta_href=row.customer_cta_href,
            license_holder_title=row.license_holder_title,
            license_holder_subtitle=row.license_holder_subtitle,
            license_holder_headline=row.license_holder_headline,
            license_holder_features=list(row.license_holder_features or []),
            license_holder_footnote=row.license_holder_footnote,
            license_holder_cta_label=row.license_holder_cta_label,
            license_holder_cta_href=row.license_holder_cta_href,
        )

    async def get_hero(self) -> LandingHeroDto:
        row = (await self.db.execute(select(LandingHero).where(LandingHero.id == 1))).scalar_one()
        return LandingHeroDto(
            title=row.title,
            subtitle=row.subtitle,
            button_text=row.button_text,
            bullets=list(row.bullets or []),
        )

    async def get_section_headers(self) -> LandingSectionHeadersDto:
        rows = (await self.db.execute(select(LandingSectionHeader))).scalars().all()
        by_key = {
            row.block_key: LandingSectionHeaderDto(title=row.title, subtitle=row.subtitle)
            for row in rows
        }
        return LandingSectionHeadersDto(
            how_it_works=by_key["how_it_works"],
            key_advantages=by_key["key_advantages"],
            orders=by_key["orders"],
            advantages=by_key["advantages"],
            industries=by_key["industries"],
            reviews=by_key["reviews"],
            faq=by_key["faq"],
        )

    async def get_steps(self, block: str) -> LandingTabSteps:
        rows = (
            await self.db.execute(
                select(LandingStep)
                .where(LandingStep.block == block)
                .order_by(LandingStep.position.asc())
            )
        ).scalars().all()

        client: list[LandingStepDto] = []
        expert: list[LandingStepDto] = []
        license_holder: list[LandingStepDto] = []
        for row in rows:
            dto = LandingStepDto(
                id=row.id,
                position=row.position,
                title=row.title,
                description=row.description,
                sub_description=row.sub_description,
                icon=row.icon,
            )
            if row.role == "client":
                client.append(dto)
            elif row.role == "expert":
                expert.append(dto)
            elif row.role == "license_holder":
                license_holder.append(dto)
        return LandingTabSteps(client=client, expert=expert, license_holder=license_holder)

    async def get_orders(self) -> list[LandingOrderExampleDto]:
        rows = (
            await self.db.execute(
                select(LandingOrderExample).order_by(LandingOrderExample.position.asc())
            )
        ).scalars().all()
        return [
            LandingOrderExampleDto(
                id=row.id,
                title=row.title,
                price=row.price,
                description=row.description,
            )
            for row in rows
        ]

    async def get_advantages(self) -> list[LandingAdvantageDto]:
        rows = (
            await self.db.execute(
                select(LandingAdvantage).order_by(LandingAdvantage.position.asc())
            )
        ).scalars().all()
        return [
            LandingAdvantageDto(
                id=row.id,
                title=row.title,
                description=row.description,
                icon_key=row.icon_key,
                photo=row.photo,
            )
            for row in rows
        ]

    async def get_industries(self) -> list[LandingIndustryDto]:
        rows = (
            await self.db.execute(
                select(LandingIndustry).order_by(LandingIndustry.position.asc())
            )
        ).scalars().all()
        return [
            LandingIndustryDto(
                id=row.id,
                title=row.title,
                description=list(row.descriptions or []),
                photo=row.photo,
            )
            for row in rows
        ]

    async def get_reviews(self) -> list[LandingReviewDto]:
        rows = (
            await self.db.execute(
                select(LandingReview).order_by(LandingReview.position.asc())
            )
        ).scalars().all()
        return [
            LandingReviewDto(
                id=row.id,
                reviewer=row.reviewer,
                position=row.reviewer_position,
                text=row.text,
                created_at=row.created_at,
            )
            for row in rows
        ]

    async def get_faq(self) -> list[LandingFaqItemDto]:
        rows = (
            await self.db.execute(
                select(LandingFaq).order_by(LandingFaq.position.asc())
            )
        ).scalars().all()
        return [
            LandingFaqItemDto(
                id=str(row.id),
                question=row.question,
                answer=row.answer,
            )
            for row in rows
        ]
