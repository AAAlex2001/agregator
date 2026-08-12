"""Use cases: анкета проектировщика."""
from models.design import ExpertDesignProfile
from schemas.design import DesignExpertProfileInput, DesignExpertProfileResponse
from services.design.repository import DesignRepository
from services.design.validators import DesignValidator


class GetDesignExpertProfileUseCase:
    """Возвращает анкету проектировщика; пока не заполнена — пустую с дефолтами."""

    def __init__(self, validator: DesignValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> DesignExpertProfileResponse:
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)
        if expert.design_profile is None:
            return DesignExpertProfileResponse()
        return DesignExpertProfileResponse.model_validate(expert.design_profile)


class SaveDesignExpertProfileUseCase:
    """Создаёт анкету проектировщика при первом сохранении и записывает поля формы."""

    def __init__(self, repo: DesignRepository, validator: DesignValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, data: DesignExpertProfileInput
    ) -> DesignExpertProfileResponse:
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.design_profile
        if profile is None:
            profile = ExpertDesignProfile(
                expert_id=expert.id,
                education_documents=[],
                nok_documents=[],
                nrs_documents=[],
                qualification_documents=[],
                rtn_documents=[],
            )
            expert.design_profile = profile

        profile.education = data.education
        profile.specialties = data.specialties
        profile.nok_passed = data.nok_passed
        profile.nrs_number = data.nrs_number
        profile.sro_gip_declared = data.sro_gip_declared
        profile.qualification_courses = data.qualification_courses
        profile.rtn_areas = data.rtn_areas

        await self.repo.add(profile)
        return DesignExpertProfileResponse.model_validate(profile)
