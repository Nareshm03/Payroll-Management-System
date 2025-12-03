import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_signup_success():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signup",
            json={
                "email": "test@example.com",
                "password": "password123",
                "name": "Test User"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["name"] == "Test User"
        assert data["role"] == "employee"
        assert "password" not in data

@pytest.mark.asyncio
async def test_signup_duplicate_email():
    async with AsyncClient(app=app, base_url="http://test") as client:
        await client.post(
            "/auth/signup",
            json={
                "email": "duplicate@example.com",
                "password": "password123",
                "name": "User One"
            }
        )
        response = await client.post(
            "/auth/signup",
            json={
                "email": "duplicate@example.com",
                "password": "password456",
                "name": "User Two"
            }
        )
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"]

@pytest.mark.asyncio
async def test_signup_weak_password():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signup",
            json={
                "email": "weak@example.com",
                "password": "123",
                "name": "Weak Password User"
            }
        )
        assert response.status_code == 400
        assert "at least 6 characters" in response.json()["detail"]

@pytest.mark.asyncio
async def test_login_success():
    async with AsyncClient(app=app, base_url="http://test") as client:
        await client.post(
            "/auth/signup",
            json={
                "email": "login@example.com",
                "password": "password123",
                "name": "Login User"
            }
        )
        response = await client.post(
            "/auth/login",
            data={
                "username": "login@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_invalid_credentials():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/login",
            data={
                "username": "nonexistent@example.com",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]

@pytest.mark.asyncio
async def test_get_me_success():
    async with AsyncClient(app=app, base_url="http://test") as client:
        await client.post(
            "/auth/signup",
            json={
                "email": "me@example.com",
                "password": "password123",
                "name": "Me User"
            }
        )
        login_response = await client.post(
            "/auth/login",
            data={
                "username": "me@example.com",
                "password": "password123"
            }
        )
        token = login_response.json()["access_token"]
        
        response = await client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "me@example.com"
        assert data["name"] == "Me User"

@pytest.mark.asyncio
async def test_get_me_unauthorized():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/auth/me")
        assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_me_invalid_token():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/auth/me",
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == 401
