param(
    [int]$WaitSeconds = 8
)

$ErrorActionPreference = "Stop"
$LogDir = Join-Path $PSScriptRoot "logs"
$LogFile = Join-Path $LogDir "frontend.log"
$PidFile = Join-Path $LogDir "frontend.pid"

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null

Write-Host "[run-bg] Killing any existing node on port 5173..." -ForegroundColor Yellow
try {
    $conn = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
    if ($conn) {
        $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        if ($proc -and $proc.ProcessName -eq "node") {
            $proc | Stop-Process -Force
            Start-Sleep -Seconds 2
        }
    }
} catch { }

Write-Host "[run-bg] Starting frontend -> log: $LogFile" -ForegroundColor Green

$proc = Start-Process -FilePath "cmd.exe" `
    -ArgumentList '/c "npx.cmd" vite --port 5173 2>&1' `
    -WorkingDirectory $PSScriptRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $LogFile `
    -PassThru

Write-Host "[run-bg] Frontend PID: $($proc.Id)" -ForegroundColor Cyan
$proc.Id | Set-Content -Path $PidFile

Write-Host "[run-bg] Waiting $WaitSeconds seconds for startup..." -ForegroundColor Gray
Start-Sleep -Seconds $WaitSeconds

try {
    $r = Invoke-WebRequest -Uri "http://localhost:5173/" -UseBasicParsing -ErrorAction Stop
    Write-Host "[run-bg] Frontend is UP! (HTTP $($r.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "[run-bg] WARNING: Frontend may not be ready yet. Check $LogFile" -ForegroundColor Red
}

Write-Host "[run-bg] Done (control returned)" -ForegroundColor Green
