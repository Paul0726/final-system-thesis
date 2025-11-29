Write-Host "=== Checking Git Status ===" -ForegroundColor Cyan
git status --short
Write-Host "`n=== Last 3 Commits ===" -ForegroundColor Cyan
git log --oneline -3
Write-Host "`n=== Checking Remote Status ===" -ForegroundColor Cyan
git fetch origin
git log origin/main..HEAD --oneline
if ($LASTEXITCODE -eq 0) {
    $unpushed = git log origin/main..HEAD --oneline
    if ($unpushed) {
        Write-Host "`n=== UNPUSHED COMMITS FOUND ===" -ForegroundColor Yellow
        Write-Host $unpushed
        Write-Host "`nPushing now..." -ForegroundColor Green
        git push origin main
    } else {
        Write-Host "`n=== All commits are pushed ===" -ForegroundColor Green
    }
}
Write-Host "`n=== Done ===" -ForegroundColor Cyan

