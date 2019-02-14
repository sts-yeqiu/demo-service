rmdir /q /s node_modules
mklink /d node_modules ..\epc-shared\node_modules

rmdir /q /s keys
mklink /d keys ..\epc-shared\keys

rmdir /q /s src\shared
mklink /d src\shared ..\..\epc-shared\src\shared

rmdir /q /s src\repository
mklink /d src\repository ..\..\epc-shared\src\repository