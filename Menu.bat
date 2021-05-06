@echo off
:inicio
echo.
echo =================================================
echo =                  MalwarePig                   =
echo =================================================
echo =================================================
echo =        Comandos cargados correctamente        =
echo =						     =
echo = 						     =
echo =	1)Ejecutar sistema  			     =
echo =	2)Deter Servicios    			     =
echo =	3)Salir    			     =
echo.
set/p opcion= Selecciona una opcion...
echo.
cls
echo.
if %opcion%==1 goto ejecutar else goto detener
:detener
echo.
echo Deteniendo servicios!!
cd "C:\Users\Soporte\Documents\Proyectos\SIGG"
call Stop.bat
echo.
echo continuar?..
pause
cls
goto inicio
:ejecutar
echo.
echo Ejecutando!!
cd "C:\Users\Soporte\Documents\Proyectos\SIGG"
call Run.bat
cd "C:\Users\Soporte\Documents\Proyectos\SIGG"
call Monit.bat
exit
 
 