param(
    [switch]$InstallDeps = $false
)

$ErrorActionPreference = "Stop"

Write-Host "Starting Schrödinger's Box natively on Windows..." -ForegroundColor Cyan

# Check if Python is installed
if (-not (Get-Command 'python' -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Python is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# Check if Node is installed
if (-not (Get-Command 'npm' -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js (npm) is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# Paths
$BackendDir = Join-Path $PSScriptRoot "backend"
$FrontendDir = Join-Path $PSScriptRoot "frontend"

if ($InstallDeps) {
    Write-Host "`n[1/2] Installing Backend Dependencies..." -ForegroundColor Yellow
    Push-Location $BackendDir
    if (-not (Test-Path "venv")) {
        python -m venv venv
    }
    venv\Scripts\python -m pip install -r requirements.txt
    Pop-Location

    Write-Host "`n[2/2] Installing Frontend Dependencies..." -ForegroundColor Yellow
    Push-Location $FrontendDir
    npm install
    Pop-Location
} else {
    Write-Host "`nChecking for virtual environment... (Run with -InstallDeps if missing)" -ForegroundColor DarkGray
    if (-not (Test-Path (Join-Path $BackendDir "venv"))) {
        Write-Host "Virtual environment not found! Run '.\start_windows.ps1 -InstallDeps' first!" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "`n============== Starting Services ==============" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop both servers." -ForegroundColor Gray
Write-Host "Backend API will be at:  http://localhost:8000"
Write-Host "Frontend App will be at: http://localhost:5173"
Write-Host "==============================================="

# Start backend in a background job
$BackendJob = Start-Job -Name "SchrodingerBackend" -ScriptBlock {
    param($Dir)
    Set-Location $Dir
    # Use venv python to run uvicorn
    & ".\venv\Scripts\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000
} -ArgumentList $BackendDir

# Start frontend in the current shell
try {
    Push-Location $FrontendDir
    npm run dev
} finally {
    Pop-Location
    Write-Host "Stopping Backend..." -ForegroundColor Yellow
    Stop-Job -Name "SchrodingerBackend"
    Remove-Job -Name "SchrodingerBackend"
    Write-Host "Goodbye." -ForegroundColor Cyan
}
