from pydantic import BaseModel


class ReportListItemResponse(BaseModel):
    order_id: int
    order_public_id: str
    title: str
    customer_company: str
    order_sum: str
    completed_at: str
    participants_count: int
    winner_name: str
    winner_sum: str
    winner_deadline: str


class ReportListResponse(BaseModel):
    items: list[ReportListItemResponse]
    has_more: bool
