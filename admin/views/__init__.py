"Список всех ModelView/BaseView в порядке регистрации в админке (этот порядок виден в боковой панели)."

from typing import Any

from views.accounts import AccountAdmin, PasswordResetCodeAdmin, SessionAdmin
from views.billing import PaymentAdmin, PricingPlanAdmin, UserSubscriptionAdmin
from views.campaigns import CompanyAdmin, MailingView
from views.chats import (
    ChatAdmin,
    ExpertRoomBanAdmin,
    ExpertRoomChatView,
    ExpertRoomMessageAdmin,
)
from views.dashboard import DashboardView
from views.landing import (
    LandingAdvantageAdmin,
    LandingFaqAdmin,
    LandingHeroAdmin,
    LandingIndustryAdmin,
    LandingOrderExampleAdmin,
    LandingPricingContentAdmin,
    LandingReviewAdmin,
    LandingSectionHeaderAdmin,
    LandingStepAdmin,
)
from views.orders import OrderAdmin, OrderResponseAdmin, ReviewAdmin
from views.platform import PlatformSettingsAdmin
from views.role_profiles import CustomerAdmin, ExpertAdmin, LicenseHolderAdmin
from views.support import SupportTicketAdmin, SupportTicketMessageAdmin

ALL_VIEWS: list[Any] = [
    DashboardView,
    AccountAdmin,
    CustomerAdmin,
    ExpertAdmin,
    LicenseHolderAdmin,
    OrderAdmin,
    OrderResponseAdmin,
    ChatAdmin,
    PaymentAdmin,
    PricingPlanAdmin,
    UserSubscriptionAdmin,
    ReviewAdmin,
    SessionAdmin,
    PasswordResetCodeAdmin,
    LandingHeroAdmin,
    LandingSectionHeaderAdmin,
    LandingStepAdmin,
    LandingOrderExampleAdmin,
    LandingAdvantageAdmin,
    LandingIndustryAdmin,
    LandingReviewAdmin,
    LandingFaqAdmin,
    LandingPricingContentAdmin,
    PlatformSettingsAdmin,
    SupportTicketAdmin,
    SupportTicketMessageAdmin,
    ExpertRoomChatView,
    ExpertRoomMessageAdmin,
    ExpertRoomBanAdmin,
    MailingView,
    CompanyAdmin,
]
