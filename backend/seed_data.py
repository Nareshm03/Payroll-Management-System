import asyncio
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.utils.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.salary_slip import SalarySlip
from app.models.expense import Expense
from app.utils.auth import get_password_hash

async def seed_database():
    """Seed the database with sample data"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    async with SessionLocal() as db:
        # Create admin user
        admin = User(
            email="hire-me@anshumat.org",
            password_hash=get_password_hash("HireMe@2025!"),
            name="Admin User",
            role=UserRole.ADMIN
        )
        db.add(admin)
        
        # Create employee users
        employees = [
            User(
                email="john.doe@company.com",
                password_hash=get_password_hash("password123"),
                name="John Doe",
                role=UserRole.EMPLOYEE
            ),
            User(
                email="jane.smith@example.com",
                password_hash=get_password_hash("password123"),
                name="Jane Smith",
                role=UserRole.EMPLOYEE
            ),
            User(
                email="bob.wilson@example.com",
                password_hash=get_password_hash("password123"),
                name="Bob Wilson",
                role=UserRole.EMPLOYEE
            )
        ]
        
        for emp in employees:
            db.add(emp)
        
        await db.commit()
        
        # Refresh to get IDs
        await db.refresh(admin)
        for emp in employees:
            await db.refresh(emp)
        
        # Create salary slips
        salary_slips = [
            SalarySlip(
                employee_id=employees[0].id,
                month="2024-01",
                basic=5000.0,
                hra=1000.0,
                allowances=500.0,
                deductions=300.0,
                net_pay=6200.0
            ),
            SalarySlip(
                employee_id=employees[1].id,
                month="2024-01",
                basic=6000.0,
                hra=1200.0,
                allowances=600.0,
                deductions=400.0,
                net_pay=7400.0
            ),
            SalarySlip(
                employee_id=employees[0].id,
                month="2024-02",
                basic=5000.0,
                hra=1000.0,
                allowances=500.0,
                deductions=300.0,
                net_pay=6200.0
            )
        ]
        
        for slip in salary_slips:
            db.add(slip)
        
        # Create expenses
        expenses = [
            Expense(
                employee_id=employees[0].id,
                title="Travel Expense",
                amount=150.0,
                date=datetime(2024, 1, 15),
                status=ExpenseStatus.APPROVED
            ),
            Expense(
                employee_id=employees[1].id,
                title="Office Supplies",
                amount=75.0,
                date=datetime(2024, 1, 20),
                status=ExpenseStatus.PENDING
            ),
            Expense(
                employee_id=employees[2].id,
                title="Client Lunch",
                amount=120.0,
                date=datetime(2024, 1, 25),
                status=ExpenseStatus.PENDING
            ),
            Expense(
                employee_id=employees[0].id,
                title="Conference Fee",
                amount=500.0,
                date=datetime(2024, 2, 1),
                status=ExpenseStatus.REJECTED
            )
        ]
        
        for expense in expenses:
            db.add(expense)
        
        await db.commit()
        
        print("✅ Database seeded successfully!")
        print("\n📝 Sample Credentials:")
        print("Admin: hire-me@anshumat.org / HireMe@2025!")
        print("Employee: john.doe@company.com / password123")
        print("Employee: jane.smith@example.com / password123")
        print("Employee: bob.wilson@example.com / password123")

if __name__ == "__main__":
    asyncio.run(seed_database())
