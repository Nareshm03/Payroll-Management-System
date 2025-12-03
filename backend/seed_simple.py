import os
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User, Base
from app.models.salary_slip import SalarySlip
from app.models.expense import Expense
from app.utils.auth import get_password_hash

# Get DATABASE_URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in environment")
    exit(1)

print(f"Connecting to database...")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)
print("Tables created")

# Seed data
db = SessionLocal()

try:
    # Create admin
    admin = User(
        email="hire-me@anshumat.org",
        password_hash=get_password_hash("HireMe@2025!"),
        full_name="Admin User",
        role="admin"
    )
    db.add(admin)
    
    # Create employees
    emp1 = User(
        email="john.doe@company.com",
        password_hash=get_password_hash("password123"),
        full_name="John Doe",
        role="employee"
    )
    db.add(emp1)
    
    db.commit()
    db.refresh(admin)
    db.refresh(emp1)
    
    # Create salary slip
    slip = SalarySlip(
        employee_id=emp1.id,
        month_year="2024-01",
        basic_salary=5000.0,
        allowances=1000.0,
        deductions=500.0,
        bonuses=200.0,
        tax=300.0,
        net_salary=5400.0,
        created_by=admin.id
    )
    db.add(slip)
    
    # Create expense
    expense = Expense(
        employee_id=emp1.id,
        amount=150.0,
        category="Travel",
        description="Client meeting travel",
        expense_date=datetime(2024, 1, 15),
        status="pending"
    )
    db.add(expense)
    
    db.commit()
    
    print("✅ Database seeded successfully!")
    print("\n📝 Credentials:")
    print("Admin: hire-me@anshumat.org / HireMe@2025!")
    print("Employee: john.doe@company.com / password123")
    
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
