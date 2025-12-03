from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from ..models.salary_slip import SalarySlip
from ..models.expense import Expense
from ..models.user import User

class AnalyticsService:
    def get_monthly_salary_trends(self, db: Session, months: int = 6):
        results = db.query(
            SalarySlip.month_year,
            func.sum(SalarySlip.net_salary).label('total')
        ).group_by(SalarySlip.month_year).order_by(SalarySlip.month_year.desc()).limit(months).all()
        
        return [{"month": r.month_year, "total": float(r.total)} for r in results]
    
    def get_expense_category_breakdown(self, db: Session, employee_id: int = None):
        query = db.query(
            Expense.category,
            func.sum(Expense.amount).label('total')
        ).filter(Expense.status == 'approved')
        
        if employee_id:
            query = query.filter(Expense.employee_id == employee_id)
        
        results = query.group_by(Expense.category).all()
        return [{"category": r.category, "total": float(r.total)} for r in results]
    
    def get_employee_expense_summary(self, db: Session):
        results = db.query(
            User.id,
            User.full_name,
            User.email,
            func.count(Expense.id).label('total_expenses'),
            func.sum(Expense.amount).label('total_amount')
        ).join(Expense, User.id == Expense.employee_id).group_by(User.id).all()
        
        return [{
            "employee_id": r.id,
            "name": r.full_name or r.email,
            "total_expenses": r.total_expenses,
            "total_amount": float(r.total_amount or 0)
        } for r in results]

analytics_service = AnalyticsService()
