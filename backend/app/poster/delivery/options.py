"""Как пост выходит в Telegram: настройки отправки, кнопки под постом и опрос."""

from enum import StrEnum
from typing import Any, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

AUTO_DELETE_HOURS = (1, 6, 24, 48, 168)
MAX_BUTTON_ROWS = 8
MAX_BUTTONS_IN_ROW = 3
MAX_CALLBACK_TEXT = 200
MAX_COPY_TEXT = 256
MAX_URL = 512


class ButtonKind(StrEnum):
    """Ссылка, копирование текста или скрытый текст для подписчиков."""

    URL = "url"
    COPY = "copy"
    HIDDEN = "hidden"


class ButtonStyle(StrEnum):
    """Цвет кнопки в Telegram."""

    PRIMARY = "primary"
    SUCCESS = "success"
    DANGER = "danger"


class LinkPreview(StrEnum):
    """Превью ссылки в тексте: как решит Telegram, без превью, маленькое или большое."""

    AUTO = "auto"
    OFF = "off"
    SMALL = "small"
    LARGE = "large"


class TelegramButton(BaseModel):
    """Кнопка под постом. value — адрес, текст для копирования или скрытый текст подписчику."""

    model_config = ConfigDict(str_strip_whitespace=True)

    kind: ButtonKind
    text: str = Field(..., min_length=1, max_length=64, description="Надпись на кнопке")
    value: str = Field(
        ...,
        min_length=1,
        max_length=MAX_URL,
        description="Ссылка, текст для копирования или скрытый текст",
    )
    alt: str = Field(
        "",
        max_length=MAX_CALLBACK_TEXT,
        description="Скрытая кнопка: что показать не подписчику",
    )
    style: ButtonStyle | None = Field(None, description="Цвет кнопки")

    @model_validator(mode="after")
    def check_value(self) -> Self:
        """Ссылка — только http(s); у копирования и скрытого текста свои лимиты Telegram."""

        if self.kind == ButtonKind.URL and not self.value.startswith(("https://", "http://")):
            raise ValueError("Ссылка на кнопке должна начинаться с https://")

        if self.kind == ButtonKind.COPY and len(self.value) > MAX_COPY_TEXT:
            raise ValueError(f"Текст для копирования — не длиннее {MAX_COPY_TEXT} символов")

        if self.kind == ButtonKind.HIDDEN and len(self.value) > MAX_CALLBACK_TEXT:
            raise ValueError(f"Скрытый текст — не длиннее {MAX_CALLBACK_TEXT} символов")

        return self


class TelegramPoll(BaseModel):
    """Опрос, который бот отправляет следом за постом."""

    model_config = ConfigDict(str_strip_whitespace=True)

    question: str = Field(..., min_length=1, max_length=300, description="Вопрос")
    options: list[str] = Field(..., min_length=2, max_length=10, description="Варианты ответа")
    is_anonymous: bool = Field(True, description="Анонимный опрос")
    allows_multiple_answers: bool = Field(False, description="Можно выбрать несколько вариантов")

    @model_validator(mode="after")
    def check_options(self) -> Self:
        """Варианты не пустые и не длиннее 100 символов."""

        if any(not option.strip() or len(option) > 100 for option in self.options):
            raise ValueError("Вариант ответа — от 1 до 100 символов")

        return self


class TelegramOptions(BaseModel):
    """Настройки Telegram-поста. Хранятся в posts.telegram как JSON."""

    silent: bool = Field(False, description="Без звука у подписчиков")
    protect: bool = Field(False, description="Запретить пересылку и сохранение")
    pin: bool = Field(False, description="Закрепить в чате")
    link_preview: LinkPreview = Field(LinkPreview.AUTO, description="Превью ссылки")
    link_preview_above: bool = Field(False, description="Превью ссылки над текстом")
    caption_above: bool = Field(False, description="Подпись над фото и видео")
    auto_delete_hours: int | None = Field(None, description="Удалить из Telegram через столько часов")
    buttons: list[list[TelegramButton]] = Field([], max_length=MAX_BUTTON_ROWS, description="Ряды кнопок")
    poll: TelegramPoll | None = Field(None, description="Опрос после поста")

    @model_validator(mode="after")
    def check_limits(self) -> Self:
        """Автоудаление — из списка, в ряду от одной до трёх кнопок."""

        if self.auto_delete_hours is not None and self.auto_delete_hours not in AUTO_DELETE_HOURS:
            raise ValueError("Выберите срок автоудаления из списка")

        if any(not row or len(row) > MAX_BUTTONS_IN_ROW for row in self.buttons):
            raise ValueError(f"В ряду кнопок — от 1 до {MAX_BUTTONS_IN_ROW} кнопок")

        return self

    @classmethod
    def of(cls, stored: dict[str, Any] | None) -> "TelegramOptions":
        """Настройки из базы; у старых постов их нет — значения по умолчанию."""

        return cls.model_validate(stored or {})
