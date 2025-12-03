from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from datetime import datetime
from .user import Base

class SalarySlip(Base):
    __tablename__ = "salary_slips"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    month_year = Column(String, nullable=False)
    basic_salary = Column(Float, nullable=False)
    allowances = Column(Float, default=0)
    deductions = Column(Float, default=0)
    bonuses = Column(Float, default=0)
    tax = Column(Float, default=0)
    net_salary = Column(Float, nullable=False)
    notes = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
