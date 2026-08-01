"Регистрация всех POST/GET роутов админ-действий на FastAPI-приложении."

from fastapi import FastAPI

from actions import accounts, expert_room, mailing, support


def setup_action_routes(app: FastAPI) -> None:
    "Подключает все action-роуты (аккаунты, поддержка, чат исполнителей, рассылка) к приложению."
    accounts.setup(app)
    support.setup(app)
    expert_room.setup(app)
    mailing.setup(app)
