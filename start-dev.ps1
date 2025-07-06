Set-Location "C:\Users\DELL\project-bolt-fitcha2\project"
Write-Host "Starting Fitcha development server..." -ForegroundColor Green
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host "Checking package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "package.json found" -ForegroundColor Green
} else {
    Write-Host "package.json NOT found" -ForegroundColor Red
}
Write-Host "Starting npm run dev..." -ForegroundColor Yellow
npm run dev
