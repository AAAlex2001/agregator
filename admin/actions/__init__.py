"Регистрация всех POST/GET роутов админ-действий на FastAPI-приложении."

from fastapi import FastAPI

from actions import expert_room, mailing, support, users


def setup_action_routes(app: FastAPI) -> None:
    "Подключает все action-роуты (пользователи, поддержка, чат исполнителей, рассылка) к приложению."
    users.setup(app)
    support.setup(app)
    expert_room.setup(app)
    mailing.setup(app)
