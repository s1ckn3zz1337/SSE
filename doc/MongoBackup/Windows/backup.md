# Windows

## Create Backup
Please update the variables before running createBackup.bat
e.g.
```
SET backupRootDir=I:\backup\
SET backupPrefix=dump_
```
backupRootDir is the root directory where the backup folders will be created
backupPrefix is the prefix for every folder. The folder name will be like this: prefix_year_month_day

## Apply Backup
Please set the variable "backupInstancePath" at applyBackup.bat  
e.g.
```
SET backupInstancePath=i:\backup\dump_2018_01_08
```
