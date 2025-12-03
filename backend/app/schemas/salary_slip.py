from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SalarySlipCreate(BaseModel):
    employee_id: int
    month_year: str
    basic_salary: float
    allowances: float = 0
    deductions: float = 0
    bonuses: float = 0
    tax: float = 0
    notes: Optional[str] = None

class SalarySlipUpdate(BaseModel):
    basic_salary: Optional[float] = None
    allowances: Optional[float] = None
    deductions: Optional[float] = None
    bonuses: Optional[float] = None
    tax: Optional[float] = None
    notes: Optional[str] = None

class SalarySlipResponse(BaseModel):
    id: int
    employee_id: int
    month_year: str
    basic_salary: float
    allowances: float
    deductions: float
    bonuses: float
    tax: float
    net_salary: float
    notes: Optional[str]
    created_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
