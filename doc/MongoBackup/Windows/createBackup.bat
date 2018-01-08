@echo off
REM Please update the following two variables
REM e.g. I:\backup\
SET backupRootDir=
REM e.g. dump_
SET backupPrefix=
@REM If in doubt, do not modify the contents below
if "%backupRootDir%;%backupPrefix%" == ";" (
    echo.Please update the backup path and set the desired prefix ^(if any^) before proceeding
    pause >nul
    goto :eof
)
@REM get current date year_month_day
set backupTimestamp=%date:~6,4%_%date:~3,2%_%date:~0,2%
@REM get user
set /p user="Adminuser: "
@REM get password with powershell helper
for /f "delims=" %%i in ('powershell -file .\windowsHelper\readPwd.ps1') do set passwd=%%i
@REM use credentials to backup/dump the database
mongodump --out "%backupRootDir%%backupPrefix%%backupTimestamp%" --username "%user%" --password "%passwd%"
pause >nul