#!/bin/bash

echo "========================================"
echo "PayrollPulse - Automated Installation"
echo "========================================"
echo ""

echo "[1/4] Setting up Backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed_data.py
cd ..

echo ""
echo "[2/4] Setting up Frontend..."
cd frontend
npm install
cd ..

echo ""
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "To start the application, run: ./start.sh"
echo ""
