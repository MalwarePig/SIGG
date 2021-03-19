@echo off
echo =================================================
echo =                  MalwarePig                   =
echo =================================================
echo =================================================
echo =        Comandos cargados correctamente        =
echo =================================================
echo.
pause
net stop spooler
cls
echo.
echo ====================================================================
echo =  Servicios de impresion detenidos, presione Enter para conectar  =
echo ====================================================================
pause>nul
net start spooler
cls
pause
echo.
echo =================================================
echo =               Tarea terminada                 =
echo =================================================
echo.
pause
exit
