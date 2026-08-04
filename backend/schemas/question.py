from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class QuestionAsk(BaseModel):
    "Payload отправки вопроса экспертом по заказу."
    question: str = Field(..., min_length=1, max_length=2000)
    is_anonymous: bool = True


class QuestionUpdate(BaseModel):
    "Payload редактирования ранее заданного вопроса."
    question: str = Field(..., min_length=1, max_length=2000)
    is_anonymous: bool | None = None


class QuestionAnswer(BaseModel):
    "Payload ответа клиента на вопрос эксперта."
    answer: str = Field(..., min_length=1, max_length=2000)


class QuestionResponse(BaseModel):
    "Карточка вопроса/ответа по заказу для UI."
    id: int
    order_id: int
    expert_id: int
    expert_name: str
    expert_avatar_url: str | None = None
    question: str
    answer: str | None = None
    asked_at: datetime
    answered_at: datetime | None = None
    is_anonymous: bool = True

    model_config = ConfigDict(from_attributes=True)


class QuestionListResponse(BaseModel):
    "Список вопросов по заказу с общим счётчиком."
    items: list[QuestionResponse]
    total: int
