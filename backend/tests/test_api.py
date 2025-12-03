import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_signup():
    response = client.post("/auth/signup", json={
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User",
        "role": "employee"
    })
    assert response.status_code in [200, 201, 400]

def test_login_invalid():
    response = client.post("/auth/login", json={
        "email": "invalid@example.com",
        "password": "wrongpass"
    })
    assert response.status_code == 401

def test_protected_route_without_token():
    response = client.get("/auth/me")
    assert response.status_code == 401
