"Схемы для внутренних ручек, которые дёргает admin-сервис."

from pydantic import BaseModel, Field


class BlogPublishedRequest(BaseModel):
    "Тело запроса о публикации статьи: данные нужны для in-app уведомления и email."
    slug: str = Field(..., min_length=1, max_length=220)
    title: str = Field(..., min_length=1, max_length=300)
    preview: str = Field("", max_length=2000)


class BroadcastResult(BaseModel):
    "Результат массовой рассылки: сколько in-app уведомлений создано и сколько писем поставлено в очередь."
    notifications_sent: int
    emails_queued: int
