@echo off
echo ========================================
echo PayrollPulse - Automated Installation
echo ========================================
echo.

echo [1/4] Setting up Backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
python seed_data.py
cd ..

echo.
echo [2/4] Setting up Frontend...
cd frontend
call npm install
cd ..

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the application, run: start.bat
echo.
pause
