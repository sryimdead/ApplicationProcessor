from typing import Optional

from sqlalchemy.orm import Session

from app.core.exceptions import (
    CannotChangeStatusFromDoneException,
    TicketCannotBeModifiedException,
    TicketNotFoundException,
)
from app.models.ticket import Ticket, TicketPriority, TicketStatus
from app.repositories.ticket_repository import TicketRepository
from app.schemas.ticket import TicketCreate, TicketUpdate


class TicketService:
    def __init__(self, db: Session):
        self.db = db
        self.ticket_repo = TicketRepository(db)

    def get_tickets(
        self,
        status: Optional[TicketStatus] = None,
        priority: Optional[TicketPriority] = None,
        search: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
        page: int = 1,
        limit: int = 10,
    ) -> tuple[list[Ticket], int]:
        return self.ticket_repo.get_all(
            status=status,
            priority=priority,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
            page=page,
            limit=limit,
        )

    def get_ticket(self, ticket_id: int) -> Ticket:
        ticket = self.ticket_repo.get_by_id(ticket_id)
        if not ticket:
            raise TicketNotFoundException()
        return ticket

    def create_ticket(self, ticket_data: TicketCreate) -> Ticket:
        ticket = Ticket(
            title=ticket_data.title,
            description=ticket_data.description,
            priority=ticket_data.priority,
            status=TicketStatus.NEW,
        )
        return self.ticket_repo.create(ticket)

    def update_ticket(self, ticket_id: int, ticket_data: TicketUpdate) -> Ticket:
        ticket = self.get_ticket(ticket_id)

        # Сначала проверяем: нельзя изменить статус с done на другой
        if ticket_data.status is not None and ticket.status == TicketStatus.DONE:
            raise CannotChangeStatusFromDoneException()

        # Потом проверяем: нельзя редактировать заявку в статусе done
        if ticket.status == TicketStatus.DONE:
            raise TicketCannotBeModifiedException()

        # Обновление полей
        if ticket_data.title is not None:
            ticket.title = ticket_data.title
        if ticket_data.description is not None:
            ticket.description = ticket_data.description
        if ticket_data.priority is not None:
            ticket.priority = ticket_data.priority
        if ticket_data.status is not None:
            ticket.status = ticket_data.status

        return self.ticket_repo.update(ticket)

    def delete_ticket(self, ticket_id: int) -> None:
        ticket = self.get_ticket(ticket_id)

        # Проверка: нельзя удалить заявку в статусе done
        if ticket.status == TicketStatus.DONE:
            raise TicketCannotBeModifiedException()

        self.ticket_repo.delete(ticket)
