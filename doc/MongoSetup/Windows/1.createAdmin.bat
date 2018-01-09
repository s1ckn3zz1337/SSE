@echo off
REM set the variable below to true, if you changed the password for adminUser, headSupport and sseUser
SET updatedJavascriptFiles=
if "%updatedJavascriptFiles%" == "" (
    echo.Please update the createAdmin.js to use specified passwords and then set the flag in this script file to true
    echo.After running this script you might want to reset the password in the file, so that it does not remain readable
    pause >nul
    goto :eof
)
mongo admin ../createAdmin.js
pause