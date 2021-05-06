@echo off
echo =================================================
echo =                  MalwarePig                   =
echo =================================================
echo =================================================
echo =        Comandos cargados correctamente        =
echo =================================================
echo.
pm2 stop "all" 
cd C:\Users\Soporte\Documents\Proyectos web\Proyectos JavaScript
pm2 start sigg\src\index.js --name SIGG --watch
