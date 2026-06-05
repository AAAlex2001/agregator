"Общие схемы ответов для эндпоинтов, не возвращающих доменный объект."

from pydantic import BaseModel


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
