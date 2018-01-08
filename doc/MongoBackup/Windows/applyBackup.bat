@echo off
REM Please set the backupInstancePath to the folder that contains the dump you want to import... if you used the createBackup.bat the folder should be called something like PREFIX_YYYY_MM_DD, where PREFIX_ is the prefix set in the createBackup.bat
REM e.g. prefix: dump_ =^> SET backupInstancePath=i:\backup\dump_2018_01_08
SET backupInstancePath=
@REM If in doubt, do not modify the contents below
if "%backupInstancePath%" == "" (
    echo.Please set the backupInstancePath as described in this script
    pause >nul
    goto :eof
)
@REM get current date year_month_day
set backupTimestamp=%date:~6,4%_%date:~3,2%_%date:~0,2%
@REM get username
set /p user="Adminuser: "
@REM get password with powershell helper
for /f "delims=" %%i in ('powershell -file .\windowsHelper\readPwd.ps1') do set passwd=%%i
@REM use credentials to backup/dump the database
mongorestore "%backupInstancePath%" --username %user% --password "%passwd%"
pause >nul