# Model zip'ini backend/model/ altina cikarir
# Kullanim: backend klasorunde  .\restore-model.ps1

$zip = "C:\Users\kubra\OneDrive\Desktop\final-toxic-mail-model.zip"
$dest = Join-Path $PSScriptRoot "model"

if (-not (Test-Path $zip)) {
    Write-Host "Zip bulunamadi: $zip" -ForegroundColor Red
    Write-Host "final-toxic-mail-model.zip dosyasini Masaustu'ne koyun."
    exit 1
}

New-Item -ItemType Directory -Force -Path $dest | Out-Null
Remove-Item -Recurse -Force (Join-Path $dest "final-toxic-mail-model") -ErrorAction SilentlyContinue

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($zip, $dest)

Write-Host "Model hazir:" -ForegroundColor Green
Get-ChildItem (Join-Path $dest "final-toxic-mail-model") | ForEach-Object {
    Write-Host "  $($_.Name)"
}
