"Pydantic-схема для данных компании из DaData."
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class CompanyName(BaseModel):
    "Вложенный блок name в data DaData."
    full_with_opf: str | None = Field(None, max_length=1000)
    short_with_opf: str | None = Field(None, max_length=1000)
    full: str | None = Field(None, max_length=1000)
    short: str | None = Field(None, max_length=500)

    model_config = ConfigDict(extra="allow")


class CompanyDetails(BaseModel):
    "Блок data в подсказке DaData — содержит ИНН/КПП/ОГРН и прочее."
    inn: str | None = Field(None, max_length=12)
    kpp: str | None = Field(None, max_length=9)
    ogrn: str | None = Field(None, max_length=15)
    name: CompanyName | None = None

    model_config = ConfigDict(extra="allow")


class CompanyData(BaseModel):
    "Подсказка компании DaData в формате, который мы храним в JSONB."
    value: str | None = Field(None, max_length=500)
    unrestricted_value: str | None = Field(None, max_length=500)
    data: CompanyDetails | None = None

    model_config = ConfigDict(extra="allow")


def validate_company_data(value: Any) -> dict[str, Any] | None:
    "Валидирует словарь компании по схеме CompanyData; возвращает исходный dict при успехе."
    if value is None:
        return None
    if not isinstance(value, dict):
        raise ValueError("Данные компании должны быть объектом")  # noqa: TRY004
    CompanyData.model_validate(value)
    return value
