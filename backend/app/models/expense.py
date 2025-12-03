from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date
from datetime import datetime
from .user import Base

class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    description = Column(String, nullable=False)
    expense_date = Column(Date, nullable=False)
    receipt_url = Column(String, nullable=True)
    status = Column(String, default="pending")
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
