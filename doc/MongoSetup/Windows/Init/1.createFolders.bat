
@echo off
REM set the variable below to the desired database path and also update the mongo.cfg file with the corresponding paths
SET databasePath=
if "%databasePath%" == "" (
    echo.Please set the path to the database in this script and in the mongo.cfg file two directory up
    pause >nul
    goto :eof
)
pushd %databasePath%
md data\db
md data\log
popd