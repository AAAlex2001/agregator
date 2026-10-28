
from src.accounts.models import Account
from src.support.exceptions import EmptyReplyError, TicketClosedError, TicketNotFoundError
from src.support.files import TicketFiles
from src.support.messages import new_user_message
from src.support.models import TicketStatus
from src.support.repository import TicketRepository
from src.support.schemas import ReplyToTicketRequest, TicketDetailResponse


class ReplyToTicketUseCase:
    """Ответ пользователя в своё обращение."""

    def __init__(self, tickets: TicketRepository, files: TicketFiles) -> None:
        """Принимает обращения в базе и файлы."""
        self.tickets = tickets
        self.files = files

    async def execute(
        self,
        *,
        user: Account,
        ticket_id: int,
        data: ReplyToTicketRequest,
    ) -> TicketDetailResponse:
        """Добавляет сообщение и снова отдаёт обращение поддержке на рассмотрение."""
        ticket = await self.tickets.get_for_user(ticket_id, user.id)

        if ticket is None:
            raise TicketNotFoundError()

        if ticket.status == TicketStatus.CLOSED:
            raise TicketClosedError()

        chosen_files = self.files.check(data.files)
        text = data.text.strip()

        if not text and not chosen_files:
            raise EmptyReplyError()

        attachments = await self.files.save(ticket.id, chosen_files)
        message = new_user_message(user, text, attachments)

        ticket.messages.append(message)
        ticket.status = TicketStatus.REVIEW
        ticket.has_unread_for_admin = True
        ticket.has_unread_for_user = False
        ticket.last_message_text = message.text
        ticket.last_message_at = message.created_at
        await self.tickets.save()

        return TicketDetailResponse.from_ticket(ticket)
