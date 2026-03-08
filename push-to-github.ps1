# Run this script in PowerShell to push your changes to GitHub.
# You will see all output and can complete any login prompt.

$repoPath = "\\192.168.0.180\files\s-bb\service-bb\Brajan-Biegalski"
Set-Location $repoPath

Write-Host "=== Git status ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Staging all changes ===" -ForegroundColor Cyan
git add -A

Write-Host "`n=== Committing ===" -ForegroundColor Cyan
git commit -m "Update website"

Write-Host "`n=== Pushing to origin main ===" -ForegroundColor Cyan
git push origin main

Write-Host "`nDone. Check https://github.com/BBi-Coding/Brajan-Biegalski/commits/main" -ForegroundColor Green
