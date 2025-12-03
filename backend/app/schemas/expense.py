from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class ExpenseCreate(BaseModel):
    amount: float
    category: str
    description: str
    expense_date: date
    receipt_url: Optional[str] = None

class ExpenseUpdate(BaseModel):
    status: str

class ExpenseResponse(BaseModel):
    id: int
    employee_id: int
    amount: float
    category: str
    description: str
    expense_date: date
    receipt_url: Optional[str]
    status: str
    reviewed_by: Optional[int]
    reviewed_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
