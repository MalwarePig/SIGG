/*Comentarios*/
select * from maquinas WHERE Planta = 'Bravo';

select * from usuarios;

/********** - ALMACEN - **********/
select * from almacen WHERE Producto  LIKE '%XCNT%';

SELECT DISTINCT Producto from itemprestado WHERE Producto  LIKE '%XCNT%';

select * from itemretorno;

select * from recepcion;

select * from estadoauditoria;

select * from RegistrosFaltantes;

select * from maquinas WHERE Familia = 'OTROS' AND Planta = 'Bravo';
 
SELECT * FROM empleados

INSERT INTO almacen (Clave,Producto,almacen, Stock,StockMin,StockMax,StockUsado,Ubicacion,Estado)VALUES('-','TCHBNC-06 - XCNT 10T 304C TPP 430','Almacen Bravo','1','1','1','1','-','-')

/********** - Obtener id mas actual de recepcion - **********/
 SELECT MAX(t.Entrada),t.*
FROM recepcion t WHERE Producto = 'ENDMILL 3/32 BOLA CORTO CON RECUBRIMIENTO'


/********** - Materiales - **********/
SELECT * FROM StockMateriales;
/********** - Materiales - **********/





SELECT * from controlplaner

UPDATE controlplaner SET Fisico = 'Acabados' WHERE id = 11



INSERT INTO maquinas (Nombre,Familia, Planta)VALUES ('FOSFATO','OTROS','Morelos');



SELECT * FROM itemretorno WHERE Salida BETWEEN '2021-10-20' AND '2019-20-31'

SELECT * FROM itemprestado WHERE Salida BETWEEN '2020-01-00'  AND '2020-12-00';
DELETE FROM itemprestado WHERE Empleado = 'Sergio Mañas'


SELECT pronostico.id,pronostico.Clave, pronostico.Producto, pronostico.Cantidad, almacen.Stock, pronostico.OT, pronostico.Comentarios, pronostico.Planta, pronostico.EmpleadoReq, pronostico.FechaReq, pronostico.Estatus FROM pronostico 
             INNER JOIN almacen ON pronostico.Producto = 'G1690 - INS.ESPADA 2-1/4 (45°)' AND almacen.Producto = 'G1690 - INS.ESPADA 2-1/4 (45°)' AND pronostico.Planta = 'Almacen Morelos' AND almacen.Almacen = 'Almacen Bravo'


SELECT * FROM AudiCiclico

SELECT * FROM registrosfaltantes

SELECT * FROM almacen where Producto ='IG1690 - INS.ESPADA 2-1/4 (45°)' AND Almacen = 'Almacen Morelos'


UPDATE usuarios SET Turno = 'Completo' WHERE id = 1


UPDATE itemprestado SET Salida = '2020-11-05 09:51:08' WHERE id = '359'

SELECT * FROM itemprestado where Almacen = 'Morelos' AND Turno != 'Dia' AND Salida  >= '2020-11-05'
SELECT Clave,Producto,almacen,Stock,StockMin,StockMax,StockUsado,Ubicacion FROM almacen order by Almacen


SELECT * FROM productoflotante




DELETE FROM recepcion WHERE Estatus = 'N/A'


SELECT * FROM Importaciones 
WHERE CONCAT_WS(Producto, OT, Empleado, Maquina) LIKE '%prueba%'




SELECT * FROM Importaciones WHERE CONCAT_WS(Pedimento, Origen, Proveedor, Factura, OT, OC, Descripcion, Colada) LIKE '%0001247%'
 

 /********** - Busqueda por un grupo de posibles filtros - **********/
SELECT *
FROM Importaciones  WHERE CONCAT_WS(Pedimento, Origen, Proveedor, Factura, OT, OC, Descripcion, Colada) LIKE '%1700 0001247%'
GROUP BY Pedimento
 
SELECT COUNT(Pedimento), Pedimento
FROM Importaciones
GROUP BY Pedimento


 /********** - Busqueda unidas dos tablas diferentes con coincidencias- **********/
SELECT pronostico.id,pronostico.Clave, pronostico.Producto, pronostico.Cantidad, almacen.Stock, pronostico.OT, pronostico.Comentarios, pronostico.Planta, pronostico.EmpleadoReq, pronostico.FechaReq, pronostico.Estatus FROM pronostico 
             INNER JOIN almacen ON pronostico.Producto = 'G1690 - INS.ESPADA 2-1/4 (45°)' AND almacen.Producto = 'G1690 - INS.ESPADA 2-1/4 (45°)' AND pronostico.Planta = 'Almacen Morelos' AND almacen.Almacen = 'Almacen Bravo'

 

 /********** - Busqueda unidas dos tablas diferentes - **********/
 SELECT itemretorno.Producto, itemretorno.Cantidad, itemretorno.Estado, itemretorno.OT, itemretorno.Empleado, itemretorno.Maquina, itemretorno.Movimiento,  itemretorno.Almacen,  itemretorno.Salida AS Fecha
    FROM itemretorno WHERE Producto = '--Avellanador 3/4 45°'
    
    UNION ALL

    SELECT itemprestado.Producto, itemprestado.Entregado, itemprestado.Estado, itemprestado.OT, itemprestado.Empleado, itemprestado.Maquina, itemprestado.Movimiento,  itemprestado.Almacen,  itemprestado.Salida AS Fecha
    FROM itemprestado  WHERE Producto = '--Avellanador 3/4 45°'
    
   
    
    SELECT * FROM almacen WHERE Producto LIKE '%prueba%'
    

 DELETE FROM itemprestado WHERE Producto LIKE '%prueba%'
 
 INSERT INTO estadoauditoria(Turno,Estado,Almacen)VALUES('Completo',1,'Bravo')
 
 SELECT * FROM recepcion WHERE Producto LIKE 'ENDMILL 3/32 BOLA CORTO CON RECUBRIMIENTO'
    
 
 SELECT MAX(t.id), t.*
FROM recepcion t WHERE Producto = 'ENDMILL 3/32 BOLA CORTO CON RECUBRIMIENTO'


SELECT * FROM usuarios

SELECT * FROM itemprestado WHERE Producto = 'IG0139 - CCGT 5.52.20.5 J SH730' ORDER BY Salida

    
 SELECT MAX(t.Salida),t.*
FROM itemprestado t WHERE Producto = 'IG0139 - CCGT 5.52.20.5 J SH730';


SELECT DISTINCT Familia, Planta FROM maquinas WHERE Familia != 'OTROS' AND Familia != 'ACABADO' AND Familia != 'CALIDAD' AND Familia != 'EROSIONADO';
 
 
 SELECT * FROM maquinas WHERE Planta = 'Bravo';