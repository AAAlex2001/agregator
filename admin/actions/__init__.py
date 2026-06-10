"Регистрация всех POST/GET роутов админ-действий на FastAPI-приложении."

from fastapi import FastAPI

from actions import articles, expert_room, mailing, support, users


def setup_action_routes(app: FastAPI) -> None:
    "Подключает все action-роуты (пользователи, статьи, поддержка, чат экспертов, рассылка) к приложению."
    users.setup(app)
    articles.setup(app)
    support.setup(app)
    expert_room.setup(app)
    mailing.setup(app)
