import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def admin_token(client):
    response = client.post("/auth/login", json={
        "email": "hire-me@anshumat.org",
        "password": "HireMe@2025!"
    })
    if response.status_code == 200:
        return response.json()["access_token"]
    return None

@pytest.fixture
def employee_token(client):
    response = client.post("/auth/login", json={
        "email": "john.doe@company.com",
        "password": "password123"
    })
    if response.status_code == 200:
        return response.json()["access_token"]
    return None
