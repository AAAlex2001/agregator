"Регистрация всех POST/GET роутов админ-действий на FastAPI-приложении."

from fastapi import FastAPI

from actions import articles, campaigns, expert_room, support, users


def setup_action_routes(app: FastAPI) -> None:
    "Подключает все action-роуты (пользователи, статьи, поддержка, чат экспертов, рассылки) к приложению."
    users.setup(app)
    articles.setup(app)
    support.setup(app)
    expert_room.setup(app)
    campaigns.setup(app)
