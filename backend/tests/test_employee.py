import pytest
from httpx import AsyncClient
from main import app
from datetime import datetime

@pytest.fixture
async def employee_token():
    async with AsyncClient(app=app, base_url="http://test") as client:
        await client.post(
            "/auth/signup",
            json={"email": "employee@test.com", "password": "pass123", "name": "Test Employee"}
        )
        response = await client.post(
            "/auth/login",
            data={"username": "employee@test.com", "password": "pass123"}
        )
        return response.json()["access_token"]

@pytest.mark.asyncio
async def test_create_expense(employee_token):
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/employee/expenses",
            json={
                "title": "Travel Expense",
                "amount": 150.0,
                "date": datetime.now().isoformat()
            },
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Travel Expense"
        assert data["amount"] == 150.0
        assert data["status"] == "PENDING"

@pytest.mark.asyncio
async def test_get_my_expenses(employee_token):
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Create an expense first
        await client.post(
            "/employee/expenses",
            json={
                "title": "Test Expense",
                "amount": 100.0,
                "date": datetime.now().isoformat()
            },
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        
        response = await client.get(
            "/employee/expenses",
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        assert len(response.json()) > 0

@pytest.mark.asyncio
async def test_get_my_salary_slips(employee_token):
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/employee/salary-slips",
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_employee_dashboard_stats(employee_token):
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/employee/dashboard-stats",
            headers={"Authorization": f"Bearer {employee_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_expenses" in data
        assert "approved_expenses" in data
        assert "pending_count" in data
