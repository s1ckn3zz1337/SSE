# General Information
This backup method is only suitable for very small database instances.
For larger database instances or a distributed database please refer to the mongoDB documentation or seek help from the developers as described in the main documentation.
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
