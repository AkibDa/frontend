@echo off
REM GreenPlate Frontend Setup Script for Windows
REM This script automates the installation process

echo.
echo =============================
echo  GreenPlate Frontend Setup
echo =============================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js v18 or higher from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed
    echo npm should come with Node.js. Please reinstall Node.js
    pause
    exit /b 1
)

echo [OK] npm is installed
npm --version
echo.

echo Installing Dependencies...
echo.

REM Install dependencies
call npm install

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies
    echo Try running: npm cache clean --force
    pause
    exit /b 1
)

echo.
echo [OK] Dependencies installed successfully!
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    (
        echo # Google Gemini API Key ^(optional^)
        echo # Get your API key from: https://makersuite.google.com/app/apikey
        echo VITE_API_KEY=your_google_api_key_here
        echo.
        echo # Backend API URL ^(if applicable^)
        echo VITE_API_URL=http://localhost:8000
    ) > .env
    echo [OK] .env file created
    echo Remember to add your Google API key if using AI features
    echo.
)

REM Create .gitignore if it doesn't exist
if not exist .gitignore (
    echo Creating .gitignore...
    (
        echo # Dependencies
        echo node_modules/
        echo package-lock.json
        echo.
        echo # Build output
        echo dist/
        echo build/
        echo.
        echo # Environment variables
        echo .env
        echo .env.local
        echo .env.production
        echo.
        echo # IDE
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo.
        echo # OS
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # Logs
        echo *.log
        echo npm-debug.log*
        echo yarn-debug.log*
        echo yarn-error.log*
        echo.
        echo # Testing
        echo coverage/
        echo .nyc_output/
    ) > .gitignore
    echo [OK] .gitignore file created
    echo.
)

echo.
echo =============================
echo  Setup Complete!
echo =============================
echo.
echo Next Steps:
echo.
echo 1. Start the development server:
echo    npm run dev
echo.
echo 2. Open your browser to:
echo    http://localhost:3000
echo.
echo 3. ^(Optional^) Add your Google API key to .env file
echo.
echo 4. Start coding! Edit files in Pages/ and Layouts/
echo.
echo Available commands:
echo    npm run dev       - Start development server
echo    npm run build     - Build for production
echo    npm run preview   - Preview production build
echo    npm run lint      - Check code quality
echo    npm run type-check - Run TypeScript checks
echo.
echo For more details, see INSTALLATION.md
echo.
pause
