@echo off
REM confirm: Using this script is a security risk, you should never hardcode the admin logins, this script is only a for convenience during offline/isolated development
REM also please set the username and password below accordingly
SET confirm=
if "%confirm%" == "" (
    echo.Please confirm that you use this script only during offline/isolated development by setting the variable in this script to true
    pause >nul
    goto :eof
)
mongo admin -u "admin" -p "1234" --authenticationDatabase "admin"