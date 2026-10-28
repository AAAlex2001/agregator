
from src.accounts.models import Account
from src.support.files import TicketFiles
from src.support.messages import new_user_message
from src.support.models import Ticket
from src.support.repository import TicketRepository
from src.support.schemas import CreateTicketRequest, TicketDetailResponse


class CreateTicketUseCase:
    """Создание обращения в поддержку."""

    def __init__(self, tickets: TicketRepository, files: TicketFiles) -> None:
        """Принимает обращения в базе и файлы."""
        self.tickets = tickets
        self.files = files

    async def execute(
        self,
        *,
        user: Account,
        data: CreateTicketRequest,
    ) -> TicketDetailResponse:
        """Создаёт обращение с первым сообщением и файлами. Обращение ждёт ответа поддержки."""
        chosen_files = self.files.check(data.files)
        ticket_id = await self.tickets.next_id()
        attachments = await self.files.save(ticket_id, chosen_files)
        message = new_user_message(user, data.message.strip(), attachments)

        ticket = Ticket(
            id=ticket_id,
            number=f"T-{ticket_id + 1000}",
            user_id=user.id,
            subject=data.subject.strip(),
            category=data.category,
            last_message_text=message.text,
            last_message_at=message.created_at,
            messages=[message],
        )
        await self.tickets.add(ticket)

        return TicketDetailResponse.from_ticket(ticket)
