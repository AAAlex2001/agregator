from models.chat import Chat
from models.labor import LaborListing
from models.user import User
from schemas.labor import LaborListingResponse, LaborResponderResponse


def display_name(user: User) -> str:
    company = user.company_data or {}
    company_data = company.get("data") or {}
    company_name = (company_data.get("name") or {}).get("short_with_opf")
    full_name = " ".join(
        part
        for part in (user.first_name, user.last_name)
        if part
    ).strip()
    return company_name or full_name or user.email or f"Пользователь #{user.id}"


def listing_to_response(
    item: LaborListing,
    actor_id: int,
    include_responders: bool = False,
) -> LaborListingResponse:
    responders: list[LaborResponderResponse] = []
    if include_responders and item.owner_id == actor_id:
        for chat in sorted(
            item.chats,
            key=lambda value: value.created_at,
            reverse=True,
        ):
            responder = responder_for(chat, item.owner_id)
            responders.append(
                LaborResponderResponse(
                    user_id=responder.id,
                    public_id=responder.public_id,
                    name=display_name(responder),
                    avatar_url=responder.avatar_url,
                    role=responder.role,
                    responded_at=chat.created_at,
                    chat_uuid=str(chat.uuid),
                )
            )

    return LaborListingResponse(
        id=item.id,
        public_id=item.public_id,
        owner_id=item.owner_id,
        owner_name=display_name(item.owner),
        owner_avatar_url=item.owner.avatar_url,
        kind=item.kind,
        certificates=item.certificates or [],
        other_profession=item.other_profession,
        region=item.region,
        employment_term=item.employment_term,
        fixed_term=item.fixed_term,
        start_date=item.start_date,
        employment_type=item.employment_type,
        current_job_status=item.current_job_status,
        is_active=item.is_active,
        is_mine=item.owner_id == actor_id,
        created_at=item.created_at,
        responders=responders,
    )


def responder_for(chat: Chat, owner_id: int) -> User:
    return chat.expert if chat.customer_id == owner_id else chat.customer
