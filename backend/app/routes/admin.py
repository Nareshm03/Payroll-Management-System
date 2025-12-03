from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from io import StringIO
from ..schemas.salary_slip import SalarySlipCreate, SalarySlipResponse, SalarySlipUpdate
from ..schemas.expense import ExpenseResponse, ExpenseUpdate
from ..schemas.user import UserResponse
from ..models.salary_slip import SalarySlip
from ..models.expense import Expense
from ..models.user import User
from ..utils.auth import require_admin
from ..utils.database import get_db
from ..services.export import export_service

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/salary-slips", response_model=SalarySlipResponse)
def create_salary_slip(
    slip: SalarySlipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    net_salary = slip.basic_salary + slip.allowances + slip.bonuses - slip.deductions - slip.tax
    new_slip = SalarySlip(
        employee_id=slip.employee_id,
        month_year=slip.month_year,
        basic_salary=slip.basic_salary,
        allowances=slip.allowances,
        deductions=slip.deductions,
        bonuses=slip.bonuses,
        tax=slip.tax,
        net_salary=net_salary,
        notes=slip.notes,
        created_by=current_user.id
    )
    db.add(new_slip)
    db.commit()
    db.refresh(new_slip)
    return new_slip

@router.put("/salary-slips/{slip_id}", response_model=SalarySlipResponse)
def update_salary_slip(
    slip_id: int,
    slip_update: SalarySlipUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    slip = db.query(SalarySlip).filter(SalarySlip.id == slip_id).first()
    if not slip:
        raise HTTPException(status_code=404, detail="Salary slip not found")
    
    update_data = slip_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(slip, key, value)
    
    slip.net_salary = slip.basic_salary + slip.allowances + slip.bonuses - slip.deductions - slip.tax
    slip.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(slip)
    return slip

@router.get("/salary-slips", response_model=List[SalarySlipResponse])
def get_all_salary_slips(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return db.query(SalarySlip).order_by(SalarySlip.created_at.desc()).all()

@router.get("/expenses", response_model=List[ExpenseResponse])
def get_all_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return db.query(Expense).order_by(Expense.created_at.desc()).all()

@router.patch("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense_status(
    expense_id: int,
    expense_update: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    expense.status = expense_update.status
    expense.reviewed_by = current_user.id
    expense.reviewed_at = datetime.utcnow()
    db.commit()
    db.refresh(expense)
    return expense

@router.get("/employees", response_model=List[UserResponse])
def get_all_employees(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return db.query(User).filter(User.role == "employee").all()

@router.get("/dashboard-stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    total_employees = db.query(User).filter(User.role == "employee").count()
    pending_expenses = db.query(Expense).filter(Expense.status == "pending").count()
    total_salary_slips = db.query(SalarySlip).count()
    
    return {
        "total_employees": total_employees,
        "pending_expenses": pending_expenses,
        "total_salary_slips": total_salary_slips
    }

@router.get("/salary-slips/export")
def export_salary_slips(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    slips = db.query(SalarySlip).all()
    csv_data = export_service.export_salary_slips_to_csv(slips)
    
    return StreamingResponse(
        iter([csv_data]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=salary_slips.csv"}
    )

@router.get("/expenses/export")
def export_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    expenses = db.query(Expense).all()
    csv_data = export_service.export_expenses_to_csv(expenses)
    
    return StreamingResponse(
        iter([csv_data]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=expenses.csv"}
    )
