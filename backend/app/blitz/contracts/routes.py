"""Договор и соглашение о конфиденциальности: проект до подписи, подписанный файл после."""

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse, Response

from app.auth.sessions.dependencies import require_user
from app.blitz.company import vat_rate
from app.blitz.contracts.dependencies import get_sign_contract_usecase
from app.blitz.contracts.services.document import Paper, build_paper, contract_problem, paper_name
from app.blitz.contracts.services.usecases.sign_contract import PAPER_KINDS, SignContractUseCase
from app.blitz.documents.services.download import DOCX_TYPE, file_response, generated_response
from app.blitz.orders.dependencies import get_locked_order, get_viewed_order
from app.blitz.orders.models import BlitzOrder
from app.blitz.orders.schemas import OrderSchema
from app.blitz.orders.services.exceptions import OrderNotFoundError, OrderStateError
from app.blitz.orders.services.presenter import details, is_party
from app.core.clock import now
from models.account import Account

router = APIRouter(tags=["blitz"])


@router.get("/orders/{order_id}/papers/{paper}", response_model=None)
async def download_paper(
    paper: Paper,
    order: BlitzOrder = Depends(get_viewed_order),
    user: Account = Depends(require_user),
) -> FileResponse | Response:
    """Подписанный документ, а до подписи — проект с сегодняшней датой."""

    if not is_party(order, user):
        raise OrderNotFoundError

    signed = [item for item in order.documents if item.kind == PAPER_KINDS[paper]]
    if signed:
        return file_response(signed[-1])

    problem = contract_problem(order)
    if problem is not None:
        raise OrderStateError(problem)

    today = now()
    content = build_paper(paper, order, vat_rate(), today)
    return generated_response(content, paper_name(paper, order, today), DOCX_TYPE)


@router.post("/orders/{order_id}/sign")
async def sign_contract(
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: SignContractUseCase = Depends(get_sign_contract_usecase),
) -> OrderSchema:
    """Заказчик соглашается с договором и соглашением о конфиденциальности."""

    return details(await usecase.execute(user, order), user)
