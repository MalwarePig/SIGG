

select* from controlplaner WHERE OT = '73738';

UPDATE controlplaner SET Enviadas = 0 WHERE id = 408

SELECT * FROM almacen WHERE Producto like '%ENDMILL%'

SELECT * FROM empleados WHERE nomina = 'M769'

SELECT * FROM eficiencia

ALTER TABLE eficiencia ADD Planta VARCHAR(20) DEFAULT NULL;

 UPDATE almacen SET Familia = 'Endmills' WHERE Producto LIKE '%ENDMILL%'
 
SELECT * FROM controlplaner WHERE Planta = 'Morelos' AND Origen != 'Inicial' AND Fisico != 'Original' AND Estatus != 'Cerrada' AND Estatus != 'Espera' AND Enviadas < (CantOt + Extra) AND FechaInicio IS NOT NULL ORDER BY FechaInicio ASC;
 
 
 SELECT * FROM controlplaner WHERE  Planta = 'Morelos' AND FechaInicio IS not NULL;  
 /******************************************************************/
  UPDATE controlplaner SET Estatus = 'Linea',Fisico = 'Linea', Origen = 'controlplaner', Maquina = 'x' WHERE id = 1;
  UPDATE controlplaner SET Enviadas = 0 WHERE id = 1;
  UPDATE controlplaner SET fechaProd =  NULL, FechaInicio = null WHERE id = 1;
    UPDATE controlplaner SET CantOt = 100 , Recibido =  0 WHERE id = 1;
    UPDATE controlplaner SET Fisico =  1 WHERE id = 1;
  
  SELECT * FROM controlplaner WHERE  OT = '72769' or OT = '72862';
  
  UPDATE controlplaner SET Terminadas = 0, Enviadas = 0, Stock = 0, PNC = 0 where Terminadas IS null
  /******************************************************************/
 
SELECT * FROM controlplaner WHERE OT =  '72825'
 
 UPDATE controlplaner SET Estatus = 'Linea' WHERE id = 2280

SELECT * FROM controlplaner WHERE Terminadas IS null


SELECT * FROM controlplaner WHERE Planta = 'Bravo' AND FechaInicio is not null

SELECT NOW()

UPDATE controlplaner SET FechaRegistro = NOW() WHERE id = 2

 
SELECT * FROM controlplaner WHERE FechaInicio IS NULL AND Estatus != 'Cerrada' AND Estatus != 'Espera'

DELETE FROM controlplaner WHERE id > 551


SELECT * FROM empleados
 	
ALTER TABLE empleados DROP COLUMN curp;
 	
ALTER TABLE empleados ADD CURP VARCHAR(40) AFTER correo;



SELECT * FROM almacen WHERE producto LIKE '%XXX%' OR Clave = 'XXX'

UPDATE usuarios SET Planta = 'Morelos' WHERE id = 19


DELETE from empleados WHERE id >4

INSERT INTO usuarios(Nombre,usuario,pass,Planta,AREA,Nivel,Turno)VALUES("Paty","nom","N0205","Morelos","Nominas","RH","Dia")


SELECT * FROM almacen WHERE Producto LIKE '%prueba%'



SELECT * FROM controlplaner WHERE OT = '72263'

INSERT INTO controlplaner() 

DROP TABLE tmp;
CREATE TEMPORARY TABLE tmp SELECT OT,Parte FROM controlplaner WHERE OT = '59407';
 
SELECT * FROM tmp;
INSERT INTO controlplaner(OT,Parte ) SELECT OT,Parte FROM tmp WHERE OT = '59407';

DROP TABLE TEMPORARY;

UPDATE usuarios SET AREA = 'Tratamientos' WHERE id  = 32


SELECT   * FROM maquinas WHERE Planta = 'Bravo'


ALTER TABLE TratamientosExterno CHANGE Terminadas Terminadas SMALLINT (9) DEFAULT 0;
ALTER TABLE TratamientosExterno CHANGE Enviadas Enviadas SMALLINT (9) DEFAULT 0;
ALTER TABLE TratamientosExterno CHANGE Stock Stock SMALLINT(9) DEFAULT 0;
ALTER TABLE TratamientosExterno CHANGE Recibido Recibido SMALLINT (9) DEFAULT 0;
ALTER TABLE TratamientosExterno CHANGE Extra Extra SMALLINT(9) DEFAULT 0;
ALTER TABLE TratamientosExterno CHANGE PNC PNC SMALLINT (9) DEFAULT 0;


UPDATE almacen SET Categoria = '-'

SELECT * FROM almacen WHERE Almacen = 'Morelos' AND Categoria IS not null AND Familia IS not NULL
 

SELECT * FROM eficiencia




SELECT * FROM itemprestado  





SELECT * FROM almacen  


SELECT * FROM SalidaAccesorios
INSERT INTO SalidaAccesorios (idAccesorio, Folio)VALUES(1,1);

SELECT A.OCGemak,A.OT,A.Producto,A.POCliente,A.ENS,F.Cantidad,F.Ubicacion,F.Entregado,F.Recibe FROM accesorios A, SalidaAccesorios F WHERE A.id = F.idAccesorio AND F.Folio = 'FAC-00000';

SELECT * FROM accesorios WHERE Producto = 'TORNILLO SOCKET M6x1.0x25 longitud'

TRUNCATE TABLE accesorios;
TRUNCATE TABLE notaaccesorios;
TRUNCATE TABLE SalidaAccesorios;

SELECT * FROM usuarios

SELECT COUNT (DISTINCT  Folio) FROM salidaaccesorios 

select count(distinct Folio) AS Total  from salidaaccesorios;
 
  
 
 
 //RESET de OT
 UPDATE controlplaner SET Recibido = 0, Extra = 0, Maquina = NULL, Fisico = 'Original',Origen = 'Inicial',FechaInicio = null WHERE OT  = '73196'
 
 
 SELECT * FROM eficiencia
 
 SELECT Enviadas,Recibido FROM areatratamientos
 
 
 SELECT * FROM areatratamientos
 
 
 UPDATE usuarios SET Area = 'Tratamientos' WHERE id = 32
 
 
 SELECT * FROM usuarios
 
 
 SELECT * FROM controlplaner WHERE OT = '73651'
 
 
 DELETE FROM controlplaner WHERE id  = 9992
 
 
 
 SELECT * FROM TratamientosExterno 

SELECT * FROM eficiencia
  
  
  
  
  
  
  
  
SELECT * FROM  areaacabados
  


SELECT * FROM  areaacabados
  
  
   SELECT  A.*,N.Notas FROM accesorios A, notaaccesorios N WHERE (A.OCGemak = V_Variable OR A.POCliente = V_Variable OR A.OT = V_Variable) AND N.POCliente = A.POCliente ORDER BY Entregado;
  
  SELECT C.*,A.OT FROM controlplaner C, areaacabados A WHERE C.OT = A.OT AND C.FechaProd IS null
  
  SELECT * FROM controlplaner WHERE OT = '72631'
  
  SELECT * FROM areaacabados WHERE OT = '72631'
  
  

SELECT * FROM  areaacabados