@echo off
echo Starting setup process...

:: --- Backend ---
echo.
echo Setting up Python backend...
cd backend

:: Create virtual environment if not exists
if not exist venv (
    echo Creating Python virtual environment...
    py -m venv venv
)

:: Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

if not exist .env (
    echo Creating .env file...
    echo OPENAI_API_KEY=your-api-key-goes-here > .env
)

:: Install Python dependencies
echo Installing Python packages...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install Python dependencies
)

:: Deactivate
call venv\Scripts\deactivate.bat
cd ..

:: --- Frontend ---
echo.
echo Setting up React frontend...
cd frontend

if not exist .env (
    echo Creating frontend .env file...
    echo VITE_API_BASE_URL=http://localhost:8000 > .env
)

echo Installing npm packages...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    exit /b 1
)

cd ..

echo.
echo ✅ Setup complete!
