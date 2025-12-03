from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .models.user import Base
from .models.salary_slip import SalarySlip
from .models.expense import Expense
from .utils.database import engine
from .routes import auth, admin, employee

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Payroll Management System",
    description="A comprehensive payroll management system with role-based access control",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    print(f"Error: {exc}")
    print(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )

from .routes import analytics

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(employee.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {
        "message": "Payroll Management System API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
