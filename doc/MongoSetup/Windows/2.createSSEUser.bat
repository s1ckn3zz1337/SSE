@echo off
REM set the flag below to true, if you changed the password for sseUser
SET updatedJavascriptFiles=
if "%updatedJavascriptFiles%" == "" (
    echo.Please set the password of the sseUser in createSSEUser.js, then set the flag in this script file to true
    echo.After running this script you might want to reset the password in the file, so that it does not remain readable
    pause >nul
    goto :eof
)
mongo admin ../createSSEUser.js
pause