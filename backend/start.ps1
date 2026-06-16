# Etik Mail - Backend baslatma scripti
# Kullanim: backend klasorunde  .\start.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Klasor: $PWD" -ForegroundColor Cyan

if (-not (Test-Path ".\.venv\Scripts\python.exe")) {
    Write-Host "Sanal ortam bulunamadi. Ilk kurulum yapiliyor..." -ForegroundColor Yellow
    python -m venv .venv
    & .\.venv\Scripts\python.exe -m pip install --upgrade pip
    & .\.venv\Scripts\python.exe -m pip install -r requirements.txt
    Write-Host "Kurulum tamamlandi." -ForegroundColor Green
}

Write-Host "Backend baslatiliyor: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Durdurmak icin Ctrl+C" -ForegroundColor Gray

& .\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
