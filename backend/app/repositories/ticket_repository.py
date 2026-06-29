from typing import Optional

from sqlalchemy import case, or_
from sqlalchemy.orm import Session

from app.models.ticket import Ticket, TicketPriority, TicketStatus


class TicketRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(
    self,
    status: Optional[TicketStatus] = None,
    priority: Optional[TicketPriority] = None,
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    limit: int = 10
    ) -> tuple[list[Ticket], int]:
        query = self.db.query(Ticket)
        
        # Фильтрация по статусу
        if status:
            query = query.filter(Ticket.status == status)
        
        # Фильтрация по приоритету
        if priority:
            query = query.filter(Ticket.priority == priority)
        
        # Поиск по title и description
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                or_(
                    Ticket.title.ilike(search_pattern),
                    Ticket.description.ilike(search_pattern)
                )
            )
        
        # Подсчет общего количества
        total = query.count()
        
        # Сортировка
        if sort_by == "priority":
            priority_order = case(
                (Ticket.priority == TicketPriority.HIGH, 3),  # Высокий = 3
                (Ticket.priority == TicketPriority.NORMAL, 2),  # Normal = 2
                (Ticket.priority == TicketPriority.LOW, 1),    # Low = 1
                else_=0
            )
            
            if sort_order == "asc":
                query = query.order_by(priority_order.asc())
            else:
                query = query.order_by(priority_order.desc())
        else:
            if sort_order == "asc":
                query = query.order_by(Ticket.created_at.asc())
            else:
                query = query.order_by(Ticket.created_at.desc())
        
        # Пагинация
        offset = (page - 1) * limit
        tickets = query.offset(offset).limit(limit).all()
        
        return tickets, total

    def get_by_id(self, ticket_id: int) -> Optional[Ticket]:
        return self.db.query(Ticket).filter(Ticket.id == ticket_id).first()

    def create(self, ticket: Ticket) -> Ticket:
        self.db.add(ticket)
        self.db.commit()
        self.db.refresh(ticket)
        return ticket

    def update(self, ticket: Ticket) -> Ticket:
        self.db.commit()
        self.db.refresh(ticket)
        return ticket

    def delete(self, ticket: Ticket) -> None:
        self.db.delete(ticket)
        self.db.commit()
