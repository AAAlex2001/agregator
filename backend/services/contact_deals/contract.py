import hashlib
import html
import json
from datetime import date
from typing import Any
from zoneinfo import ZoneInfo

from weasyprint import HTML

from models.contact_deal import ContactDealSignature
from models.user import User

CONTRACT_VERSION = "2026-07-21"
MOSCOW_TIMEZONE = ZoneInfo("Europe/Moscow")

CLAUSES = [
    "Продавец предоставляет Покупателю информацию о своих персональных данных и контактные данные (номер телефона, адрес электронной почты) для использования в работе, а именно для подбора состава экспертной (рабочей) группы при проведении экспертизы промышленной безопасности или иного проекта.",
    "Контактные данные предоставляются за плату в размере {price} рублей, включая все налоги и сборы.",
    "Покупатель получает доступ к контактным данным в течение одного рабочего дня после оплаты.",
    "Контактные данные предоставляются исключительно для целей, указанных в настоящем договоре.",
    "Продавец обязуется самостоятельно отражать все полученные доходы в налоговой декларации и самостоятельно оплачивать применимые налоги и сборы.",
    "Покупатель обязуется оплатить обусловленную договором цену и использовать полученную информацию исключительно для целей, указанных в настоящем договоре.",
    "Покупатель обязуется не передавать полученную информацию третьим лицам, не размещать ее в открытых источниках и не использовать в противоправных действиях.",
    "Стороны осведомлены, что площадка «Ресурс-Плюс» не является стороной расчетов, не принимает и не переводит денежные средства и не несет ответственности за надлежащее исполнение сторонами настоящего договора, в том числе за достоверность предоставленных Продавцом сведений.",
    "Стороны настоящего договора несут ответственность в соответствии с действующим законодательством Российской Федерации.",
    "Настоящий договор заключается в электронном виде с подписанием простой электронной подписью, которая посредством использования кодов, паролей или иных средств подтверждает факт ее формирования определенным лицом.",
]


def party_name(user: User) -> str:
    full_name = " ".join(filter(None, (user.last_name, user.first_name))).strip()
    company = user.company_data or {}
    company_name = (((company.get("data") or {}).get("name") or {}).get("short_with_opf"))
    return full_name or company_name or user.email or f"Пользователь #{user.id}"


def party_requisites(user: User) -> dict[str, str]:
    requisites = {"Наименование": party_name(user)}
    if user.inn:
        requisites["ИНН"] = user.inn
    return requisites


def specialist_areas(seller: User) -> str:
    values: list[str] = []
    for certificate in seller.expert_certificates or []:
        area = str(certificate.get("area") or "").strip()
        category = str(certificate.get("category") or "").strip()
        value = " ".join(filter(None, (area, category)))
        if value and value not in values:
            values.append(value)
    return ", ".join(values) or "промышленной безопасности"


def build_contract_snapshot(
    public_id: str,
    contract_date: date,
    seller: User,
    buyer: User,
    price_kopecks: int,
) -> dict[str, Any]:
    price_rubles = price_kopecks // 100
    return {
        "version": CONTRACT_VERSION,
        "title": "Договор-оферта",
        "number": f"РП-КД-{contract_date.year}-{public_id.split('-')[0].upper()}",
        "date": contract_date.isoformat(),
        "seller_name": party_name(seller),
        "seller_area": specialist_areas(seller),
        "buyer_name": party_name(buyer),
        "price_rubles": price_rubles,
        "preamble": (
            f"{party_name(seller)}, являющийся специалистом в области "
            f"{specialist_areas(seller)}, с одной стороны, далее — Продавец, и "
            f"{party_name(buyer)}, с другой стороны, далее — Покупатель, заключили "
            "настоящий договор о нижеследующем:"
        ),
        "clauses": [clause.format(price=price_rubles) for clause in CLAUSES],
        "seller_requisites": party_requisites(seller),
        "buyer_requisites": party_requisites(buyer),
    }


def contract_hash(snapshot: dict[str, Any]) -> str:
    canonical = json.dumps(snapshot, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def build_contract_pdf(
    snapshot: dict[str, Any],
    document_hash: str,
    signatures: list[ContactDealSignature],
) -> bytes:
    clauses = "".join(
        f"<li>{html.escape(str(clause))}</li>" for clause in snapshot.get("clauses", [])
    )
    seller_requisites = requisites_html(snapshot.get("seller_requisites", {}))
    buyer_requisites = requisites_html(snapshot.get("buyer_requisites", {}))
    signature_rows = "".join(
        "<tr>"
        f"<td>{html.escape(signature.party.value)}</td>"
        f"<td>{html.escape(signature.signer_name)}</td>"
        f"<td>{signature.signed_at.astimezone(MOSCOW_TIMEZONE):%d.%m.%Y %H:%M:%S} МСК</td>"
        f"<td>{html.escape(signature.method.value)}</td>"
        "</tr>"
        for signature in sorted(signatures, key=lambda item: item.signed_at)
    )
    content = f"""
    <!doctype html><html lang="ru"><head><meta charset="utf-8"><style>
      @page {{ size: A4; margin: 20mm; }}
      body {{ font-family: DejaVu Sans, sans-serif; font-size: 11pt; line-height: 1.45; color: #111; }}
      h1 {{ text-align: center; font-size: 16pt; margin: 0 0 8mm; }}
      .meta {{ display: flex; justify-content: space-between; margin-bottom: 8mm; }}
      li {{ margin-bottom: 3mm; text-align: justify; }}
      table {{ border-collapse: collapse; width: 100%; margin-top: 6mm; }}
      th, td {{ border: 1px solid #666; padding: 6px; vertical-align: top; text-align: left; }}
      .hash {{ margin-top: 8mm; font-size: 8pt; word-break: break-all; color: #555; }}
    </style></head><body>
      <h1>{html.escape(str(snapshot.get("title", "Договор-оферта")))}</h1>
      <div class="meta"><span>№ {html.escape(str(snapshot.get("number", "")))}</span>
      <span>{html.escape(str(snapshot.get("date", "")))}</span></div>
      <p>{html.escape(str(snapshot.get("preamble", "")))}</p>
      <ol>{clauses}</ol>
      <h2>11. Реквизиты сторон</h2>
      <table><tr><th>Продавец</th><th>Покупатель</th></tr>
      <tr><td>{seller_requisites}</td><td>{buyer_requisites}</td></tr></table>
      <h2>Лист простых электронных подписей</h2>
      <table><tr><th>Сторона</th><th>Подписант</th><th>Дата и время</th><th>Способ</th></tr>
      {signature_rows or '<tr><td colspan="4">Подписей пока нет</td></tr>'}</table>
      <p class="hash">SHA-256 документа: {html.escape(document_hash)}</p>
    </body></html>
    """
    return HTML(string=content).write_pdf()


def requisites_html(requisites: dict[str, Any]) -> str:
    return "<br>".join(
        f"{html.escape(str(key))}: {html.escape(str(value))}"
        for key, value in requisites.items()
    )
