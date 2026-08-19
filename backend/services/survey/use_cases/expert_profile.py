"""Use cases: анкета изыскателя."""
from models.survey import ExpertSurveyProfile
from schemas.survey import SurveyExpertProfileInput, SurveyExpertProfileResponse
from services.survey.repository import SurveyRepository
from services.survey.validators import SurveyValidator


class GetSurveyExpertProfileUseCase:
    """Возвращает анкету изыскателя; пока не заполнена — пустую с дефолтами."""

    def __init__(self, validator: SurveyValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> SurveyExpertProfileResponse:
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)
        if expert.survey_profile is None:
            return SurveyExpertProfileResponse()
        return SurveyExpertProfileResponse.model_validate(expert.survey_profile)


class SaveSurveyExpertProfileUseCase:
    """Создаёт анкету изыскателя при первом сохранении и записывает поля формы."""

    def __init__(self, repo: SurveyRepository, validator: SurveyValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, data: SurveyExpertProfileInput
    ) -> SurveyExpertProfileResponse:
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        profile = expert.survey_profile
        if profile is None:
            profile = ExpertSurveyProfile(
                expert_id=expert.id,
                education_documents=[],
                nok_documents=[],
                nrs_documents=[],
                qualification_documents=[],
                rtn_documents=[],
            )
            expert.survey_profile = profile

        profile.education = data.education
        profile.kinds = data.kinds
        profile.kinds_other = data.kinds_other
        profile.nok_passed = data.nok_passed
        profile.nrs_number = data.nrs_number
        profile.sro_gip_declared = data.sro_gip_declared
        profile.qualification_courses = data.qualification_courses
        profile.rtn_areas = data.rtn_areas

        await self.repo.add(profile)
        return SurveyExpertProfileResponse.model_validate(profile)
