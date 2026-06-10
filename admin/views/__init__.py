"Список всех ModelView/BaseView в порядке регистрации в админке (этот порядок виден в боковой панели)."

from typing import Any

from views.billing import PaymentAdmin, PricingPlanAdmin, UserSubscriptionAdmin
from views.campaigns import CompanyAdmin, MailingView
from views.chats import (
    ChatAdmin,
    ExpertRoomBanAdmin,
    ExpertRoomChatView,
    ExpertRoomMessageAdmin,
)
from views.content import ArticleAdmin
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
from views.support import SupportTicketAdmin, SupportTicketMessageAdmin
from views.users import PasswordResetCodeAdmin, SessionAdmin, UserAdmin

ALL_VIEWS: list[Any] = [
    DashboardView,
    UserAdmin,
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
    ArticleAdmin,
    SupportTicketAdmin,
    SupportTicketMessageAdmin,
    ExpertRoomChatView,
    ExpertRoomMessageAdmin,
    ExpertRoomBanAdmin,
    MailingView,
    CompanyAdmin,
]
