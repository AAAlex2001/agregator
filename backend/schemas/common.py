"Общие схемы ответов для эндпоинтов, не возвращающих доменный объект."

from pydantic import BaseModel, Field


class DirectionFileSchema(BaseModel):
    "Приложенный файл: имя для показа и ссылка на хранилище."

    name: str = Field(..., min_length=1, max_length=300)
    url: str = Field(..., min_length=1, max_length=500)


class DocumentUrl(BaseModel):
    "Ссылка на удаляемый документ анкеты."

    url: str = Field(..., min_length=1, max_length=500)


class DetailResponse(BaseModel):
    "Ответ с человекочитаемым описанием результата операции."

    detail: str


class OkResponse(BaseModel):
    "Простой подтверждающий ответ без описания."

    ok: bool = True


class DeletedCountResponse(BaseModel):
    "Ответ массовой операции удаления — сколько строк фактически удалено."

    deleted: int


class UpdatedCountResponse(BaseModel):
    "Ответ массовой операции обновления — сколько строк фактически изменено."

    updated: int
