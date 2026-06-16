# Etik Mail - Frontend baslatma scripti
# Kullanim: frontend klasorunde  .\start.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path ".\node_modules")) {
    Write-Host "Paketler kuruluyor (ilk sefer)..." -ForegroundColor Yellow
    npm install
}

Write-Host "Frontend baslatiliyor: http://localhost:5173" -ForegroundColor Green
npm run dev
