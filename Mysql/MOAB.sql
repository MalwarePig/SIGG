DELIMITER //
CREATE PROCEDURE `MOAB`()
BEGIN

SET SQL_SAFE_UPDATES = 0;
 TRUNCATE TABLE requisiciones;
 TRUNCATE TABLE folioalmacen;
 TRUNCATE TABLE folioalmacenRetorno;
 TRUNCATE TABLE HisRecoleccion;
 TRUNCATE TABLE itemprestado;
 TRUNCATE TABLE itemretorno;
 TRUNCATE TABLE ProductoFlotante;
 TRUNCATE TABLE pronostico;
 TRUNCATE TABLE Recepcion;
 TRUNCATE TABLE requisiciones;
 TRUNCATE TABLE RegistrosFaltantes;
END
 
 call MOAB();
  
USE  sigg


TRUNCATE TABLE requisiciones;

SELECT * FROM almacen;


SELECT * FROM itemprestado;


SELECT * FROM almacen;


SELECT * FROM usuarios;




