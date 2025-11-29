Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FORCING RAILWAY DEPLOYMENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
Set-Location "C:\final system thesis"

Write-Host "[1/5] Checking git status..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
    Write-Host "Changes found:" -ForegroundColor Green
    Write-Host $status
} else {
    Write-Host "No uncommitted changes" -ForegroundColor Gray
}
Write-Host ""

Write-Host "[2/5] Adding all changes..." -ForegroundColor Yellow
git add -A
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to add files" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Files added" -ForegroundColor Green
Write-Host ""

Write-Host "[3/5] Creating commit..." -ForegroundColor Yellow
git commit -m "DEPLOY: CSS syntax fix - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
if ($LASTEXITCODE -ne 0) {
    Write-Host "No changes to commit, creating empty commit..." -ForegroundColor Yellow
    git commit --allow-empty -m "FORCE DEPLOY: Trigger Railway - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create commit" -ForegroundColor Red
        exit 1
    }
}
Write-Host "OK: Commit created" -ForegroundColor Green
Write-Host ""

Write-Host "[4/5] Pushing to GitHub..." -ForegroundColor Yellow
$pushOutput = git push origin main 2>&1
Write-Host $pushOutput
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Check your GitHub credentials and internet connection" -ForegroundColor Yellow
    exit 1
}
Write-Host "OK: Pushed to GitHub" -ForegroundColor Green
Write-Host ""

Write-Host "[5/5] Verifying..." -ForegroundColor Yellow
$lastCommit = git log --oneline -1
Write-Host "Last commit: $lastCommit" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SUCCESS! Deployment triggered!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to: https://railway.app" -ForegroundColor White
Write-Host "2. Click your project" -ForegroundColor White
Write-Host "3. Check 'Deployments' tab" -ForegroundColor White
Write-Host "4. Wait 2-5 minutes for deployment" -ForegroundColor White
Write-Host ""

