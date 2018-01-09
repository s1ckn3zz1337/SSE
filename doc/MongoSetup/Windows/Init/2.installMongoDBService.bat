@echo off
REM set the flag to "true", if you updated the mongo.cfg at ../../mongo.cfg to fit your needs
SET mongoCfgIsUpdated=
if "%mongoCfgIsUpdated%" == "" (
    echo.Please confirm that you updated the mongo.cfg accordingly, by setting the variable in this script to "true"
    pause >nul
    goto :eof
)
pushd ..\..
set configPath=%cd%\mongo.cfg
popd
mongod --config "%configPath%" --install
net start MongoDB