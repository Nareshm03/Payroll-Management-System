from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..utils.auth import get_current_user, require_admin
from ..utils.database import get_db
from ..models.user import User
from ..services.analytics import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/salary-trends")
def get_salary_trends(
    months: int = 6,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return analytics_service.get_monthly_salary_trends(db, months)

@router.get("/expense-breakdown")
def get_expense_breakdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return analytics_service.get_expense_category_breakdown(db)

@router.get("/employee-expenses")
def get_employee_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return analytics_service.get_employee_expense_summary(db)

@router.get("/my-expense-breakdown")
def get_my_expense_breakdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return analytics_service.get_expense_category_breakdown(db, current_user.id)
