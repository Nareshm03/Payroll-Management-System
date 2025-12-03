import pytest
from httpx import AsyncClient
from main import app

@pytest.fixture
async def admin_token():
    async with AsyncClient(app=app, base_url="http://test") as client:
        await client.post(
            "/auth/signup",
            json={"email": "admin@test.com", "password": "admin123", "name": "Admin"}
        )
        # Manually set role to admin (in real scenario, this would be done via database)
        response = await client.post(
            "/auth/login",
            data={"username": "admin@test.com", "password": "admin123"}
        )
        return response.json()["access_token"]

@pytest.fixture
async def employee_id():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signup",
            json={"email": "emp@test.com", "password": "pass123", "name": "Employee"}
        )
        return response.json()["id"]

@pytest.mark.asyncio
async def test_create_salary_slip(admin_token, employee_id):
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/admin/salary-slips",
            json={
                "employee_id": employee_id,
                "month": "2024-01",
                "basic": 5000.0,
                "hra": 1000.0,
                "allowances": 500.0,
                "deductions": 300.0,
                "net_pay": 6200.0
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 201
        data = response.json()
        assert data["employee_id"] == employee_id
        assert data["month"] == "2024-01"
        assert data["net_pay"] == 6200.0

@pytest.mark.asyncio
async def test_get_all_salary_slips(admin_token):
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/admin/salary-slips",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_dashboard_stats(admin_token):
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/admin/dashboard-stats",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_employees" in data
        assert "total_expenses" in data
