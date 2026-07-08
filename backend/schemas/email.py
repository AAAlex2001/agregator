from datetime import date

from pydantic import BaseModel, ConfigDict


class BaseContext(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class OrderBrief(BaseContext):
    company: str = ""
    sum_amount: int | None = None
    deadline: date | None = None
    comment: str = ""
    badges: list[str] = []


class ExpertBrief(BaseContext):
    name: str = "Эксперт"
    contact: str = ""
    review_count: int = 0
    avg_rating: float | None = None


class ResponseBrief(BaseContext):
    proposed_sum_amount: int = 0
    proposed_deadline: date | None = None
    comment: str = ""
    files_count: int = 0


class ResponseCreatedContext(BaseContext):
    customer_greeting: str
    order_title: str
    cta_url: str
    order: OrderBrief
    expert: ExpertBrief
    response: ResponseBrief


class ResponseUpdatedContext(BaseContext):
    customer_greeting: str
    order_title: str
    cta_url: str
    expert: ExpertBrief
    response: ResponseBrief
    changes_summary: str


class ExpertRejectedContext(BaseContext):
    customer_greeting: str
    order_title: str
    cta_url: str
    expert_name: str


class NewOrderContext(BaseContext):
    expert_greeting: str
    order_title: str
    cta_url: str
    order: OrderBrief
    fallback_notice: str = ""


class OrderUpdatedContext(BaseContext):
    expert_greeting: str
    order_title: str
    cta_url: str
    order: OrderBrief
    changes_summary: str


class ChatMessageContext(BaseContext):
    recipient_greeting: str
    sender_name: str
    order_title: str
    message_preview: str
    cta_url: str


class BiddingFinishedContext(BaseContext):
    expert_greeting: str
    order_title: str
    outcome: str  # "won" либо "lost"
    cta_url: str
    badges: list[str] = []
    order_number: str = ""
    customer_name: str = ""
    winning_price: str = ""
    customer_inn: str = ""
    customer_email: str = ""
    customer_phone: str = ""
    customer_contact_name: str = ""


class QuestionAskedContext(BaseContext):
    customer_greeting: str
    expert_name: str
    order_title: str
    question_text: str
    cta_url: str


class QuestionAnsweredContext(BaseContext):
    expert_greeting: str
    order_title: str
    question_text: str
    answer_text: str
    cta_url: str


class NewBlogPostEmailContext(BaseContext):
    "Контекст письма о новой публикации в блоге."
    recipient_greeting: str
    blog_title: str
    preview: str
    cta_url: str
