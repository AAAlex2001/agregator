"""Решения модератора в запросах API."""

from enum import StrEnum


class ModerationStatus(StrEnum):
    """Скрыть пост или вернуть его в ленту."""

    HIDDEN = "hidden"
    PUBLISHED = "published"
