"Use case: update email preferences."
from models.account import Account, UserRole
from models.customer import Customer
from models.expert import Expert
from models.license_holder import LicenseHolder
from schemas.settings import UpdateEmailPreferencesRequest
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UpdateEmailPreferencesUseCase:
    "Частичный патч флагов email-уведомлений: каждое поле пишется в аккаунт или профиль своей роли."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, patch: dict[str, bool | None]) -> Account:
        "Запускает основной сценарий use case; поля чужой роли молча пропускаются."
        account = await self.validator.require_user(user_id)
        prefs = UpdateEmailPreferencesRequest.model_validate(patch)
        self.apply_account_flags(account, prefs)
        if account.customer_profile is not None:
            self.apply_customer_flags(account.customer_profile, prefs)
        if account.expert_profile is not None:
            self.apply_expert_flags(account.expert_profile, prefs)
        if account.license_holder_profile is not None:
            self.apply_license_holder_flags(
                account.license_holder_profile,
                prefs,
                labor_locked=account.role == UserRole.LICENSE_HOLDER,
            )
        await self.repo.flush()
        return account

    @staticmethod
    def apply_account_flags(account: Account, prefs: UpdateEmailPreferencesRequest) -> None:
        "Пишет флаги, живущие прямо на аккаунте."
        if prefs.email_on_chat_message is not None:
            account.email_on_chat_message = prefs.email_on_chat_message
        if prefs.email_on_new_blog_post is not None:
            account.email_on_new_blog_post = prefs.email_on_new_blog_post
        if prefs.notify_telegram_enabled is not None:
            account.notify_telegram_enabled = prefs.notify_telegram_enabled

    @staticmethod
    def apply_customer_flags(customer: Customer, prefs: UpdateEmailPreferencesRequest) -> None:
        "Пишет флаги профиля заказчика."
        if prefs.email_on_response_created is not None:
            customer.email_on_response_created = prefs.email_on_response_created
        if prefs.email_on_response_updated is not None:
            customer.email_on_response_updated = prefs.email_on_response_updated
        if prefs.email_on_expert_rejected is not None:
            customer.email_on_expert_rejected = prefs.email_on_expert_rejected
        if prefs.email_on_question_asked is not None:
            customer.email_on_question_asked = prefs.email_on_question_asked

    @staticmethod
    def apply_expert_flags(expert: Expert, prefs: UpdateEmailPreferencesRequest) -> None:
        "Пишет флаги профиля исполнителя."
        if prefs.email_on_order_updated is not None:
            expert.email_on_order_updated = prefs.email_on_order_updated
        if prefs.email_on_bidding_finished is not None:
            expert.email_on_bidding_finished = prefs.email_on_bidding_finished
        if prefs.email_on_question_answered is not None:
            expert.email_on_question_answered = prefs.email_on_question_answered
        if prefs.email_on_labor_listing is not None:
            expert.email_on_labor_listing = prefs.email_on_labor_listing

    @staticmethod
    def apply_license_holder_flags(
        holder: LicenseHolder, prefs: UpdateEmailPreferencesRequest, labor_locked: bool
    ) -> None:
        "Пишет флаги профиля держателя лицензии; рассылку о вакансиях лицензиат отключить не может."
        if prefs.email_on_order_updated is not None:
            holder.email_on_order_updated = prefs.email_on_order_updated
        if prefs.email_on_bidding_finished is not None:
            holder.email_on_bidding_finished = prefs.email_on_bidding_finished
        if labor_locked:
            holder.email_on_labor_listing = True
            return
        if prefs.email_on_labor_listing is not None:
            holder.email_on_labor_listing = prefs.email_on_labor_listing
