@echo off
echo Quick Railway Deploy...
git commit --allow-empty -m "Redeploy" && git push origin main
echo Done! Check Railway dashboard.
pause

