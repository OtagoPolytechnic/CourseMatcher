@echo off
echo Starting setup process...

:: --- Backend ---
echo.
echo Setting up Python backend...
cd backend

:: Create virtual environment if not exists
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

:: Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

:: Install Python dependencies
echo Installing Python packages...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install Python dependencies
    exit /b 1
)

:: Deactivate
call venv\Scripts\deactivate.bat
cd ..

:: --- Frontend ---
echo.
echo Setting up React frontend...
cd frontend

echo Installing npm packages...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    exit /b 1
)

cd ..

echo.
echo ✅ Setup complete!
