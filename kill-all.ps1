Write-Host "[kill-all] Killing backend (java)..." -ForegroundColor Yellow
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "[kill-all] Killing frontend (node)..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Start-Sleep -Seconds 3

Write-Host "[kill-all] Verifying ports..." -ForegroundColor Gray
$ports = netstat -ano | Select-String ":8080 |:5173 "
if ($ports) {
    Write-Host "[kill-all] WARNING: Ports still in use:" -ForegroundColor Red
    $ports
} else {
    Write-Host "[kill-all] Ports 8080 and 5173 are free." -ForegroundColor Green
}
