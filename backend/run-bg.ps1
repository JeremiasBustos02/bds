param(
    [string]$DbPassword = "postgres123",
    [string]$JwtSecret = "dGVzdC1zZWNyZXQta2V5LWZvci1zbW9rZS10ZXN0cy1vbmx5IQo=",
    [string[]]$AdditionalEnvVars = @(),
    [int]$WaitSeconds = 15
)

$ErrorActionPreference = "Stop"
$LogDir = Join-Path $PSScriptRoot "logs"
$LogFile = Join-Path $LogDir "backend.log"
$PidFile = Join-Path $LogDir "backend.pid"

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null

Write-Host "[run-bg] Killing any existing java on port 8080..." -ForegroundColor Yellow
try {
    $conn = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
    if ($conn) {
        $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        if ($proc -and $proc.ProcessName -eq "java") {
            $proc | Stop-Process -Force
            Start-Sleep -Seconds 2
        }
    }
} catch { }

$env:DB_PASSWORD = $DbPassword
$env:JWT_SECRET = $JwtSecret
foreach ($pair in $AdditionalEnvVars) {
    $parts = $pair -split '=', 2
    if ($parts.Count -eq 2) { Set-Item -Path "env:$($parts[0])" -Value $parts[1] }
}

Write-Host "[run-bg] Starting backend -> log: $LogFile" -ForegroundColor Green

# Redirect stderr to stdout via cmd, then capture only stdout
$proc = Start-Process -FilePath "cmd.exe" `
    -ArgumentList '/c "mvnw.cmd" spring-boot:run 2>&1' `
    -WorkingDirectory $PSScriptRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $LogFile `
    -PassThru

Write-Host "[run-bg] Backend PID: $($proc.Id)" -ForegroundColor Cyan
$proc.Id | Set-Content -Path $PidFile

Write-Host "[run-bg] Waiting $WaitSeconds seconds for startup..." -ForegroundColor Gray
Start-Sleep -Seconds $WaitSeconds

try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -ErrorAction Stop
    Write-Host "[run-bg] Backend is UP! (health: $($health.status))" -ForegroundColor Green
} catch {
    Write-Host "[run-bg] WARNING: Backend may not be ready yet. Check $LogFile" -ForegroundColor Red
}

Write-Host "[run-bg] Done (control returned)" -ForegroundColor Green
