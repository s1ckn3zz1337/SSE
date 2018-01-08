set-executionpolicy remotesigned
$password = Read-Host "Enter password" -AsSecureString
$password = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$password = [Runtime.InteropServices.Marshal]::PtrToStringAuto($password)
echo $password