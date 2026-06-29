from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.ticket import TicketPriority, TicketStatus


class TicketBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    description: Optional[str] = Field(None, max_length=1000)
    priority: TicketPriority = TicketPriority.NORMAL


class TicketCreate(TicketBase):
    pass


class TicketUpdate(BaseModel):
    status: Optional[TicketStatus] = None
    title: Optional[str] = Field(None, min_length=3, max_length=120)
    description: Optional[str] = Field(None, max_length=1000)
    priority: Optional[TicketPriority] = None


class TicketResponse(TicketBase):
    id: int
    status: TicketStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TicketListResponse(BaseModel):
    items: list[TicketResponse]
    total: int
    page: int
    limit: int
