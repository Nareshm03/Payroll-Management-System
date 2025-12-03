from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List
from datetime import datetime
from ..schemas.expense import ExpenseCreate, ExpenseResponse
from ..schemas.salary_slip import SalarySlipResponse
from ..models.expense import Expense
from ..models.salary_slip import SalarySlip
from ..models.user import User
from ..utils.auth import get_current_user
from ..utils.database import get_db

router = APIRouter(prefix="/employee", tags=["employee"])

@router.post("/expenses", response_model=ExpenseResponse)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_expense = Expense(
        employee_id=current_user.id,
        amount=expense.amount,
        category=expense.category,
        description=expense.description,
        expense_date=expense.expense_date,
        receipt_url=expense.receipt_url
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

@router.get("/expenses", response_model=List[ExpenseResponse])
def get_my_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Expense).filter(Expense.employee_id == current_user.id).order_by(Expense.created_at.desc()).all()

@router.get("/salary-slips", response_model=List[SalarySlipResponse])
def get_my_salary_slips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(SalarySlip).filter(SalarySlip.employee_id == current_user.id).order_by(SalarySlip.created_at.desc()).all()

@router.get("/dashboard-stats")
def get_employee_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_month = datetime.now().strftime("%Y-%m")
    
    current_month_slip = db.query(SalarySlip).filter(
        SalarySlip.employee_id == current_user.id,
        SalarySlip.month_year == current_month
    ).first()
    
    total_expenses = db.query(Expense).filter(Expense.employee_id == current_user.id).count()
    pending_expenses = db.query(Expense).filter(
        Expense.employee_id == current_user.id,
        Expense.status == "pending"
    ).count()
    
    return {
        "current_month_salary": current_month_slip.net_salary if current_month_slip else 0,
        "total_expenses": total_expenses,
        "pending_expenses": pending_expenses
    }
