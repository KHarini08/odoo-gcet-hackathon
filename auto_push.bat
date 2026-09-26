@echo off 
:loop 
git add . 
git commit -m "Auto-commit: Hourly StockSense updates" 
git push origin main 
echo Waiting for 1 hour until next push... 
timeout /t 3600 /nobreak 
goto loop 
