from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_admin_user, get_current_user
from app.models.ticket import TicketPriority, TicketStatus
from app.models.user import User
from app.schemas.common import MessageResponse
from app.schemas.ticket import TicketCreate, TicketListResponse, TicketResponse, TicketUpdate
from app.services.ticket_service import TicketService

router = APIRouter(prefix="/tickets", tags=["Tickets"])


@router.get("", response_model=TicketListResponse)
def get_tickets(
    status_filter: Optional[TicketStatus] = Query(None, alias="status"),
    priority: Optional[TicketPriority] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("created_at", pattern="^(created_at|priority)$"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Получение списка заявок с фильтрацией, поиском, сортировкой и пагинацией"""
    ticket_service = TicketService(db)
    tickets, total = ticket_service.get_tickets(
        status=status_filter,
        priority=priority,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        limit=limit,
    )

    return TicketListResponse(
        items=[TicketResponse.model_validate(ticket) for ticket in tickets], total=total, page=page, limit=limit
    )


@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket_data: TicketCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Создание новой заявки"""
    ticket_service = TicketService(db)
    ticket = ticket_service.create_ticket(ticket_data)
    return TicketResponse.model_validate(ticket)


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Получение заявки по ID"""
    ticket_service = TicketService(db)
    ticket = ticket_service.get_ticket(ticket_id)
    return TicketResponse.model_validate(ticket)


@router.patch("/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: int,
    ticket_data: TicketUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Обновление заявки"""
    ticket_service = TicketService(db)
    ticket = ticket_service.update_ticket(ticket_id, ticket_data)
    return TicketResponse.model_validate(ticket)


@router.delete("/{ticket_id}", response_model=MessageResponse)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Удаление заявки (только для администратора)"""
    ticket_service = TicketService(db)
    ticket_service.delete_ticket(ticket_id)
    return MessageResponse(message="Заявка успешно удалена")
