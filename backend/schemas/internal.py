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


class ImportStartedResult(BaseModel):
    "Импорт базы запущен в фоне. Прогресс — через /companies/stats (растущий счётчик)."
    started: bool = True


class CompaniesStatsResponse(BaseModel):
    "Состояние базы: всего компаний, пригодны к рассылке (действующие с email), уже отправлено, осталось."
    total: int
    sendable: int
    sent: int
    remaining: int


class SendBatchRequest(BaseModel):
    "Разослать одну пачку: тема, текст письма, размер пачки, ссылка на размещённую презентацию (опц.)."
    subject: str = Field(..., min_length=1, max_length=300)
    body_text: str = Field(..., min_length=1, max_length=5000)
    batch_size: int = Field(100, ge=1, le=5000)
    presentation_url: str | None = Field(None, max_length=500)


class SendBatchQueuedResult(BaseModel):
    "Пачка поставлена на отправку в фоне."
    queued: bool = True
