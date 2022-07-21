SET SQL_SAFE_UPDATES = 0;

UPDATE itemprestado SET Devuelto = '0'

ALTER TABLE empleados CHANGE Nombre Nombre VARCHAR(60);

INSERT INTO usuarios(Nombre,usuario,pass,Planta,Area,Nivel,Turno) VALUES ('Sergio','admin','admin','Morelos','admin','Admin','Dia');

UPDATE itemprestado SET Almacen = 'Bravo' WHERE id = '2'

INSERT INTO EstadoAuditoria(Turno,Estado,Almacen) VALUES ('Dia','0','Bravo');

ALTER TABLE usuarios ADD Turno VARCHAR(20) AFTER nombre_columna_anterior;

UPDATE EstadoAuditoria SET Estado = 1 WHERE  Almacen ='Morelos' AND Turno = 'Dia'

SELECT * FROM almacen;

SELECT * FROM recepcion;

SELECT * FROM productoflotante;

SELECT * FROM maquinas WHERE Planta = 'Bravo';

UPDATE maquinas SET Familia = 'TORNOS CNC' WHERE  Familia = 'TORNOS GRANDES' AND Planta = 'Bravo'

TRUNCATE TABLE Recepcion;

TRUNCATE TABLE ProductoFlotante;

ALTER TABLE almacen CHANGE Producto Producto varchar(180) DEFAULT NULL UNIQUE;
SELECT pronostico.id,pronostico.Clave, pronostico.Producto, pronostico.Cantidad, almacen.Stock, pronostico.OT, pronostico.Comentarios, pronostico.Planta, pronostico.EmpleadoReq, pronostico.FechaReq, pronostico.Estatus FROM pronostico 
             INNER JOIN almacen ON pronostico.Producto = almacen.Producto;

SELECT * FROM almacen WHERE Producto LIKE '%TCHBNC-01 DGR 2202C-6D IC908%'
														'TCHBNC-01 - DGR 2202C-6D IC908'												 

SELECT * FROM almacen WHERE Producto LIKE '%TCHBNC-01%'

SELECT * FROM almacen WHERE Producto LIKE '%DGR%'

update almacen SET Clave = '-' WHERE Clave is NULL

update almacen SET Clave = '-' WHERE Clave is null OR Clave = ''
/**********************************************************************************************************************************************************************/






 
/**********************************************************************************************************************************************************************/
   
SELECT DISTINCT Familia FROM maquinas WHERE Planta = 'Morelos' AND Familia != 'OTROS' ORDER BY Familia Asc;             
             
SELECT * FROM almacen WHERE Producto = 'ProductoPrueba'
             
UPDATE `mysql`.`proc` p SET definer = 'root@%' WHERE definer='ucswrbktlathvrkc@%'
update sigg.Asignar set definer='root@%' where name='ucswrbktlathvrkc@%';
             
UPDATE `mysql`.`Asignar` p SET definer = "Soporte@%" WHERE definer="ucswrbktlathvrkc@%"


    
             
 /*==================================================================*/            
SET @Condicion := 'IN0340 - GUANTE SEGURIDAD';

SELECT @Condicion

	SELECT almacen.Producto, almacen.Stock, almacen.StockUsado, almacen.Almacen, pronostico.Comentarios, pronostico.Planta, pronostico.EmpleadoReq, pronostico.FechaReq, pronostico.Estatus
	FROM pronostico
	INNER JOIN almacen ON pronostico.Producto = 'ProductoPrueba' AND almacen.Producto = 'ProductoPrueba';




             
 /*==================================================================*/    
SELECT OT COUNT(*) Total
FROM controlplaner
GROUP BY OT
HAVING COUNT(*) > 1

             
 /*==================================================================*/    
SELECT * FROM almacen t1 join almacen t2 WHERE (t1.Producto=t2.Producto) && (t1.id!=t2.id) ORDER BY t1.Producto

 
              
 /*==================================================================*/    
 SELECT Producto,Stock,StockUsado,Almacen,group_concat(distinct Producto,Stock,StockUsado,Almacen) FROM almacen GROUP BY 1
             
/*==================================================================*/            
SELECT * FROM 
(SELECT Producto,Stock,StockUsado,Almacen, "1" FROM almacen WHERE Producto = 'IN0340 - GUANTE SEGURIDAD' AND Almacen = 'Almacen Morelos'
UNION SELECT Producto,Stock,StockUsado,almacen, "2" FROM almacen WHERE Producto = 'IN0340 - GUANTE SEGURIDAD' AND Almacen = 'Almacen Bravo');
AS Producto
GROUP BY Producto
ORDER BY 1 DESC 
/*==================================================================*/              
             SELECT * FROM 
     (SELECT A, B, C, "1" FROM table WHERE B LIKE 'query%' LIMIT 3
      UNION
      SELECT A, B, C, "2" FROM table WHERE B LIKE '%query%' LIMIT 5)
AS RS
GROUP BY B
ORDER BY 1

/*==================================================================*/   
(SELECT Producto,Stock,StockUsado,Almacen, "1" FROM almacen WHERE Producto = 'IN0340 - GUANTE SEGURIDAD' AND Almacen = 'Almacen Morelos')
UNION ALL
(SELECT Producto,Stock,StockUsado,almacen, "2" FROM almacen WHERE Producto = 'IN0340 - GUANTE SEGURIDAD' AND Almacen = 'Almacen Bravo')
ORDER BY Producto

/*==================================================================*/   
select 
i.id_cli,i.nombre,i.fecha,i.mes,i.descripcion,i.bono,h.calculo,i.valor
from info i,historia h  where i.id_cli=h.id and i.id_cli=10 and h.id=10

/*==================================================================*/   
SELECT Producto,Stock,StockUsado,Almacen, "1" FROM almacen WHERE Producto = 'IN0340 - GUANTE SEGURIDAD' AND Almacen = 'Almacen Bravo';
/*==================================================================*/   
SELECT M.Producto,M.Stock,M.StockUsado,M.Almacen,B.Producto,B.Stock,B.StockUsado,B.Almacen FROM almacen M, almacen B WHERE M.Producto = B.Producto AND M.Almacen = 'Almacen Morelos' AND B.Almacen = 'Almacen Bravo' ORDER BY M.Producto,B.Producto
/*==================================================================*/

SELECT M.Clave, M.Producto,M.Stock,M.StockUsado,B.Stock AS B_Nuevo,B.StockUsado AS B_Usado FROM almacen M, almacen B WHERE M.Producto LIKE '%1/2%' AND  B.Producto = M.Producto AND M.Almacen = 'Almacen Morelos' AND B.Almacen = 'Almacen Bravo' ORDER BY M.Producto,B.Producto
/*==================================================================*/

/*======================== UNION DE TABLAS CONTROLPLANER ==========================================*/
SELECT M.Clave, M.Producto,M.Stock,M.StockUsado,B.Stock AS B_Nuevo,B.StockUsado AS B_Usado FROM almacen M, almacen B WHERE M.Producto = 'Producto_Prueba' AND  B.Producto = M.Producto AND M.Almacen = 'Almacen Morelos' AND B.Almacen = 'Almacen Bravo' ORDER BY M.Producto,B.Producto
 
SELECT P.OT,P.Parte,P.Estatus,P.CantOt,P.FechaInicio AS Pro_Inicio,P.FechaVenc AS Pro_Venc,A.FechaInicio AS Aca_Inicio, A.FechaVenc AS Aca_Venc,C.FechaInicio AS Cal_Inicio,C.FechaVenc AS Cal_Venc,E.FechaInicio AS Emb_Inicio,E.FechaVenc AS Emb_Venc,T.FechaInicio AS Trat_Inicio,T.FechaVenc AS Tra_Venc  
FROM controlplaner P, areaacabados A,areacalidad C, areaembarques E, areatratamientos T  WHERE P.OT = '65787' AND  A.OT = P.OT AND C.OT = A.OT AND E.OT = C.OT AND T.OT = E.OT  
 
SELECT * FROM areaacabados WHERE OT = '71619'
SELECT * FROM controlplaner WHERE FechaInicio IS NULL AND Estatus != 'Cerrada' AND Estatus != 'Espera'


SELECT * FROM areatratamientos

SELECT * FROM areaacabados WHERE Planta = 'Morelos' AND FechaInicio IS NOT NULL ORDER BY FechaInicio ASC


UPDATE controlplaner SET Planta = 'Morelos'

UPDATE controlplaner SET FechaInicio = CURDATE() WHERE id = 192


/*Produccion , Acabados, Calidad, Embarques, Tratamientos*/

SELECT * FROM controlplaner WHERE FechaInicio is NULL

SELECT * FROM controlplaner WHERE Planta = 'Morelos' AND FechaInicio IS NOT NULL ORDER BY FechaInicio Asc



UPDATE areaembarques SET FechaInicio = '2021-01-24 00:00:00', FechaProd = '2021-01-30 00:00:00' WHERE OT = '1702861'






SELECT* FROM almacen WHERE producto LIKE '%xcnt%'



SELECT * FROM itemprestado WHERE producto LIKE '%xcnt%'

UPDATE almacen SET Stock = 1 WHERE id = 6270


DELETE from itemprestado WHERE id = 6306

SELECT * from maquinas where Familia ='" + familia + "' AND Planta = '" + planta + "'


SELECT FROM controlplaner WHERE PNC != 0






















