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


class CreateCampaignRequest(BaseModel):
    "Создание кампании из админки. Файлы (JSON-база + PDF) лежат в общем томе под import_token, бэк читает их оттуда."
    name: str = Field(..., min_length=1, max_length=200)
    subject: str = Field(..., min_length=1, max_length=300)
    batch_size: int = Field(100, ge=1, le=5000)
    import_token: str = Field(..., min_length=8, max_length=64)
    has_presentation: bool = False
    only_active: bool = True


class CampaignCreatedResult(BaseModel):
    "Кампания создана, импорт получателей идёт в фоне. Счётчики смотреть через /stats."
    campaign_id: int
    status: str
    importing: bool = True


class CampaignStatsResponse(BaseModel):
    "Состояние кампании: статус, размер пачки, счётчики получателей по статусам."
    campaign_id: int
    status: str
    batch_size: int
    pending: int
    counts: dict[str, int]


class CampaignActionResult(BaseModel):
    "Результат смены статуса кампании (старт/пауза)."
    campaign_id: int
    status: str
