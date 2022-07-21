
DELIMITER //
CREATE  PROCEDURE `RetornarAlmacen`(IN Cantidad int, IN ProductoARetornar varchar(200),IN Condicion varchar(20),IN Maquinas varchar(50),IN FolioSalida varchar(50),IN Planta varchar(50))
BEGIN
SET SQL_SAFE_UPDATES = 0;
SET @ActualNuevo := (SELECT Stock From almacen WHERE Producto = ProductoARetornar AND Almacen = Planta);
SET @TotalNuevo := (@ActualNuevo + Cantidad);
SET @ActualUsado := (SELECT StockUsado From almacen WHERE Producto = ProductoARetornar AND Almacen = Planta);
SET @TotalUsado := (@ActualUsado + Cantidad);
SET @ActualDevuelto := (SELECT Devuelto From itemprestado WHERE Producto = ProductoARetornar AND Maquina = Maquinas and Folio = FolioSalida );
SET @TotalDevuelto := (@ActualDevuelto + Cantidad);

	IF (Condicion = 'Nuevo') 
    THEN UPDATE almacen SET Stock = @TotalNuevo WHERE Producto = ProductoARetornar AND Almacen = Planta;
    ELSE UPDATE almacen SET StockUsado = @TotalUsado WHERE Producto = ProductoARetornar AND Almacen = Planta;
	END IF;
    UPDATE itemprestado SET Devuelto = @TotalDevuelto WHERE Producto = ProductoARetornar AND Folio = FolioSalida ;
END

call RetornarAlmacen(2,'Producto_Prueba','Nuevo','OTROS');

/**********************************************************************************************************************************************************************/

DELIMITER //
CREATE PROCEDURE `CambiarEstadoAuditoria`( IN V_Turno varchar(200),IN V_Planta varchar(20))
BEGIN

 update EstadoAuditoria SET Estado = 1 WHERE  Almacen = V_Planta AND Turno = V_Turno;
 update EstadoAuditoria SET Estado = 0 WHERE  Almacen = V_Planta AND Turno != V_Turno;

END;

/**********************************************************************************************************************************************************************/

DELIMITER //
CREATE PROCEDURE `VerPronosticos`()
BEGIN
	SELECT pronostico.id,pronostico.Clave, pronostico.Producto, pronostico.Cantidad, almacen.Stock, pronostico.OT, pronostico.Comentarios, pronostico.Planta, pronostico.EmpleadoReq, pronostico.FechaReq, pronostico.Estatus
	FROM pronostico
	INNER JOIN almacen ON pronostico.Producto = 'ProductoPrueba' AND almacen.Producto = 'ProductoPrueba';
END

/**********************************************************************************************************************************************************************/

DELIMITER //
CREATE PROCEDURE `RestarAlmacen`(IN Cantidad int, IN ProductoARestar varchar(200),IN Condicion varchar(20),IN Planta varchar(20))
BEGIN
SET SQL_SAFE_UPDATES = 0;
SET @ActualNuevo := (SELECT Stock From almacen WHERE Producto = ProductoARestar AND Almacen = Planta);
SET @TotalNuevo := (@ActualNuevo - Cantidad);
SET @ActualUsado := (SELECT StockUsado From almacen WHERE Producto = ProductoARestar AND Almacen = Planta);
SET @TotalUsado := (@ActualUsado - Cantidad);

	IF (Condicion = 'Nuevo') THEN UPDATE almacen SET Stock = @TotalNuevo WHERE Producto = ProductoARestar AND Almacen = Planta;
    ELSE UPDATE almacen SET StockUsado = @TotalUsado WHERE Producto = ProductoARestar AND  Almacen = Planta;
      END IF;
END

/**********************************************************************************************************************************************************************/

DELIMITER //
CREATE PROCEDURE IncrementarFolioRetornoAlmacen(in Nuevo varchar(20)
)
BEGIN
 INSERT INTO folioalmacenRetorno(Folio)values(Nuevo);
END;

/**********************************************************************************************************************************************************************/

DELIMITER //
CREATE PROCEDURE `Asignar`(IN indice int, IN Item varchar(200),IN Cantidad INT,IN Planta VARCHAR(20))
BEGIN
SET SQL_SAFE_UPDATES = 0;
INSERT INTO ProductoFlotante(Producto,Cantidad,Estatus,Planta)VALUES(Item,Cantidad,'N/A',Planta);
UPDATE Recepcion SET Entregado = (Entregado - Cantidad) where id = indice;
SET @Total := (SELECT Entregado FROM Recepcion WHERE id = indice);

		IF (@Total <= 0) THEN UPDATE Recepcion SET Estatus = "Entregado" WHERE id = indice;
		END IF;
END
 
 
/**********************************************************************************************************************************************************************/
DELIMITER //
CREATE PROCEDURE `Recolectar`(IN V_ID int, IN V_Producto varchar(200),IN V_Stock int,IN V_Planta VARCHAR(25),IN V_Usuario VARCHAR(25))
BEGIN

SET @Condicion := (SELECT 'Existe' WHERE EXISTS(SELECT Producto FROM almacen WHERE Producto = V_Producto AND almacen = V_Planta));
SELECT @Condicion;
	
		IF ((SELECT STRCMP(@Condicion,'Existe')) = 0) THEN
		
		SET @StockActual := (SELECT Stock FROM almacen WHERE Producto = V_Producto AND almacen = V_Planta);
		UPDATE almacen SET Stock  = @StockActual + V_Stock  WHERE Producto = V_Producto AND Almacen = V_Planta;
  
	  ELSE 
			INSERT IGNORE INTO almacen (Producto,Stock,almacen,StockUsado,Ubicacion) VALUES (V_Producto,V_Stock,V_Planta,0,'-');
			INSERT INTO HisRecoleccion (Producto,Cantidad,Usuario,Planta) VALUES (V_Producto,V_Stock,V_Usuario,V_Planta);
		
		END IF;
			
			DELETE FROM ProductoFlotante WHERE id = V_ID;
END


/**********************************************************************************************************************************************************************/
DELIMITER //
CREATE PROCEDURE `RecolectarGaveta`(IN V_ID int, IN V_Producto varchar(200),IN V_Stock int,IN V_Planta VARCHAR(25),IN V_Usuario VARCHAR(25))
BEGIN

SET @Condicion := (SELECT 'Existe' WHERE EXISTS(SELECT Producto FROM almacen WHERE Producto = V_Producto AND almacen = V_Planta));
SELECT @Condicion;
	
		IF ((SELECT STRCMP(@Condicion,'Existe')) = 0) THEN
		
		SET @StockActual := (SELECT Stock FROM almacen WHERE Producto = V_Producto AND almacen = V_Planta);
		UPDATE almacen SET Stock  = @StockActual + V_Stock  WHERE Producto = V_Producto AND Almacen = V_Planta;
  
	  ELSE 
			INSERT IGNORE INTO almacen (Producto,Stock,almacen,StockUsado,Ubicacion) VALUES (V_Producto,V_Stock,V_Planta,0,'-');
			INSERT INTO HisRecoleccion (Producto,Cantidad,Usuario,Planta) VALUES (V_Producto,V_Stock,V_Usuario,V_Planta);
		
		END IF;
			
			DELETE FROM ProductoFlotante WHERE id = V_ID;
END
SELECT * FROM almacen


SELECT * FROM controlplaner
/**********************************************************************************************************************************************************************/

DELIMITER //
CREATE PROCEDURE `ActualizarProducto`(IN V_ID INT, IN V_Clave VARCHAR(20), IN V_Producto varchar(200), IN V_Nuevo INT, IN V_Usado INT, IN V_Minimo INT, IN V_Max INT,IN V_Categoria varchar(200),IN V_Familia varchar(200))
BEGIN

	UPDATE almacen SET Clave = V_Clave, Producto = V_Producto, Stock = V_Nuevo, StockUsado = V_Usado, StockMin = V_Minimo, StockMax = V_Max, Categoria = V_Categoria, Familia = V_Familia  WHERE id = V_ID;
	
END
 
/**********************************************************************************************************************************************************************/
DELIMITER //
CREATE PROCEDURE `GuardarIntercambio`(IN V_Producto varchar(200),IN V_Cantidad int,IN V_Planta VARCHAR(25),IN V_Estado VARCHAR(25))
BEGIN

	SET @Condicion := (SELECT 'Existe' WHERE EXISTS(SELECT Producto FROM almacen WHERE Producto = V_Producto AND almacen = V_Planta));
	/*Si existe*/
		IF ((SELECT STRCMP(@Condicion,'Existe')) = 0) THEN
			IF (V_Estado = 'Nuevo') THEN
					SET @StockActual := (SELECT Stock FROM almacen WHERE Producto = V_Producto AND almacen = V_Planta);
					UPDATE almacen SET Stock  = @StockActual + V_Cantidad  WHERE Producto = V_Producto AND Almacen = V_Planta;
			 			SET @StockRestar := (SELECT Stock FROM almacen WHERE Producto = V_Producto AND almacen != V_Planta);
						UPDATE almacen SET Stock  = @StockRestar - V_Cantidad  WHERE Producto = V_Producto AND almacen != V_Planta;
			ELSE
					SET @StockActual := (SELECT StockUsado FROM almacen WHERE Producto = V_Producto AND almacen = V_Planta);
					UPDATE almacen SET StockUsado  = @StockActual + V_Cantidad  WHERE Producto = V_Producto AND Almacen = V_Planta;
						SET @StockRestar := (SELECT StockUsado FROM almacen WHERE Producto = V_Producto AND almacen != V_Planta);
						UPDATE almacen SET StockUsado  = @StockRestar - V_Cantidad  WHERE Producto = V_Producto AND almacen != V_Planta;
			END IF;
		ELSE
			IF (V_Estado = 'Nuevo') THEN
				INSERT INTO almacen(Producto,almacen,Stock,StockMin,StockMax,StockUsado,Ubicacion)VALUES(V_Producto,V_Planta,V_Cantidad,0,0,0,'-');
			ELSE
				INSERT INTO almacen(Producto,almacen,Stock,StockMin,StockMax,StockUsado,Ubicacion)VALUES(V_Producto,V_Planta,0,0,0,V_Cantidad,'-');
			END IF;
		END IF;
END

CALL GuardarIntercambio('Nuevo',1,'Almacen Bravo','Nuevo');
 
 /**********************************************************************************************************************************************************************/
DELIMITER //
CREATE PROCEDURE `IntercambioActivo`(IN V_Producto varchar(200),IN V_Planta varchar(200))
BEGIN
	UPDATE IntercambioActivo SET Estatus = 'Completado' WHERE Producto = V_Producto AND Planta != V_Planta;
END

SELECT * FROM IntercambioActivo
/**********************************************************************************************************************************************************************/
DELIMITER //
CREATE PROCEDURE `CancelarAsignacion`(IN V_ID INT)
BEGIN

SET @Producto := (SELECT Producto FROM productoflotante WHERE id = V_ID);
SET @Ordenado := 0;
SET @Entregado := (SELECT Cantidad FROM productoflotante WHERE id = V_ID);
SET @Usuario := 'Sistema';
SET @Estatus := 'N/A';
INSERT INTO recepcion (Producto,Ordenado,Entregado,Usuario,Estatus) VALUES(@Producto,@Ordenado,@Entregado,@Usuario,@Estatus);
	DELETE FROM productoflotante WHERE id = V_ID;
	
END

SELECT * FROM recepcion 

/********************************************************************* OBTENER TODAS LAS FEHCAS DE AREAS FLUJO ******************************************************************/
DELIMITER //
CREATE PROCEDURE `FechasFlujo`(IN V_OT varchar(200))
BEGIN

SELECT P.OT,P.Parte,P.Estatus,P.CantOt,P.FechaInicio AS Pro_Inicio,P.FechaVenc AS Pro_Venc,A.FechaInicio AS Aca_Inicio, A.FechaProd AS Aca_Venc,C.FechaInicio AS Cal_Inicio,C.FechaProd AS Cal_Venc,E.FechaInicio AS Emb_Inicio,E.FechaProd AS Emb_Venc,T.FechaInicio AS Trat_Inicio,T.FechaProd AS Tra_Venc  
FROM controlplaner P, areaacabados A,areacalidad C, areaembarques E, areatratamientos T  WHERE P.OT = V_OT AND  A.OT = P.OT AND C.OT = A.OT AND E.OT = C.OT AND T.OT = E.OT;  

END
 
CALL FechasFlujo('70098')

/********************************************************************* CALCULAR LAS FECHAS DE AREA FLUJO ******************************************************************/
 DELIMITER //
CREATE PROCEDURE `FechasFlujo`(IN V_OT varchar(200))
BEGIN
	SET @ActualNuevo := (SELECT Stock From almacen WHERE Producto = ProductoARestar AND Almacen = Planta);
END
 
/********************************************************************* Limpia las tablas de area flujo ******************************************************************/
 DELIMITER //
CREATE PROCEDURE `LimpiarAreaFlujos`()
BEGIN
	TRUNCATE TABLE areaacabados;
	TRUNCATE TABLE areacalidad;
	TRUNCATE TABLE areaembarques;
	TRUNCATE TABLE areatratamientos;
	TRUNCATE TABLE controlplaner;
	TRUNCATE TABLE TratamientosExterno;
	
	INSERT INTO controlplaner(Estatus,OT,Parte,CantOT,FechaInicio,FechaVenc,FechaProd,Horas,Comentarios,Planta)
VALUES ('Pivote','000000','000000','0','2021-02-05 00:00:00','2020-12-18 00:00:00','2021-02-10 00:00:00','5','N/A','Morelos');

END

CALL LimpiarAreaFlujos()

ALTER TABLE areatratamientos ADD Usuario VARCHAR(20) AFTER PNC;


USE sigg

SELECT * FROM controlplaner

SELECT * FROM controlplaner WHERE Maquina = 'VF-5' AND Estatus != 'Cerrada'

SELECT * FROM controlplaner WHERE OT ='59407'

SELECT * FROM controlplaner WHERE Planta = 'Bravo' AND Origen != 'Inicial' AND Fisico != 'Original' AND Estatus != 'Cerrada' AND Estatus != 'Espera' AND Enviadas < (CantOt + Extra) AND FechaInicio IS NOT NULL ORDER BY FechaInicio Asc


/*Pendientes*/
SELECT * FROM controlplaner WHERE Enviadas < CantOT AND Estatus != 'Cerrada' AND Estatus != 'Espera' AND Estatus != 'Linea' AND Enviadas < (CantOt + Extra) AND FechaInicio IS null AND OT = '59407'







SELECT * FROM controlplaner WHERE Estatus != 'Cerrada' AND Estatus != 'Espera' 



 ALTER TABLE TratamientosExterno add PNC smallint DEFAULT 0;

UPDATE areaacabados SET FechaInicio = (CURDATE()) WHERE id = 1
SELECT * FROM areaacabados WHERE FechaInicio IS NULL AND Estatus != 'Cerrada' AND Estatus != 'Espera'

SELECT * FROM areaacabados WHERE Planta = 'Morelos' AND Estatus != 'Cerrada' AND Enviadas < (CantOt + Extra) AND FechaInicio IS NOT NULL ORDER BY FechaInicio ASC
SELECT * FROM areaacabados WHERE Planta = 'Morelos' AND Estatus != 'Cerrada' AND Enviadas < (CantOt) AND FechaInicio IS NOT NULL ORDER BY FechaInicio ASC

SELECT * FROM areatratamientos

SELECT * FROM TratamientosExterno
UPDATE tratamientosexterno SET Terminadas = 10
SELECT * FROM controlplaner

SELECT * FROM areatratamientos

SELECT * FROM controlplaner WHERE Planta = 'Morelos' AND Estatus != 'Cerrada' AND FechaInicio IS NOT NULL ORDER BY FechaInicio ASC

SELECT * FROM  areaacabados

SELECT * FROM  areacalidad

SELECT OT, COUNT(*) Total
FROM controlplaner
GROUP BY OT
HAVING COUNT(*) > 1

SELECT * FROM  areaembarques

/**********************************************************************************************************************************************************************/
 DELIMITER //
CREATE PROCEDURE `HistorialFlujo`(IN V_Producto VARCHAR(20))
BEGIN
	(SELECT id,OT,Parte,Estatus,CantOt,Maquina,FechaRegistro,FechaInicio,FechaProd,Servicio,FechaVenc,Planta,Enviadas,Recibido,Origen,'Produccion' AS Area FROM controlplaner WHERE OT = V_Producto AND Fisico != 'Original')
	UNION ALL
	(SELECT id,OT,Parte,Estatus,CantOt,'',FechaRegistro,FechaInicio,FechaProd,Servicio,FechaVenc,Planta,Enviadas,Recibido,Origen,'Acabado'AS Area   FROM areaacabados WHERE OT = V_Producto )
	UNION ALL
	(SELECT id,OT,Parte,Estatus,CantOt,'',FechaRegistro,FechaInicio,FechaProd,Servicio,FechaVenc,Planta,Enviadas,Recibido,Origen,'Calidad'AS Area   FROM areacalidad WHERE OT = V_Producto )
	UNION ALL
	(SELECT id,OT,Parte,Estatus,CantOt,'',FechaRegistro,FechaInicio,FechaProd,Servicio,FechaVenc,Planta,Enviadas,Recibido,Origen, 'Embarques'AS Area   FROM areaembarques WHERE OT = V_Producto )
	UNION ALL
	(SELECT id,OT,Parte,Estatus,CantOt,'',FechaRegistro,FechaInicio,FechaProd,Servicio,FechaVenc,Planta,Enviadas,Recibido,Origen, 'Tratamientos'AS Area   FROM areatratamientos WHERE OT = V_Producto )
	UNION ALL
	(SELECT id,OT,Parte,Estatus,CantOt,'',FechaRegistro,FechaRegistro,FechaProd,Servicio,"-",Proveedor,Terminadas,Recibidas,'Tratamientos', 'TratamientosEx'AS Area   FROM tratamientosexterno WHERE OT = V_Producto )
	ORDER BY FechaRegistro ASC;
END
 
call HistorialFlujo('59407'); 


SELECT * FROM tratamientosexterno
/**********************************************************************************************************************************************************************/
DELIMITER //
CREATE PROCEDURE `CerrarLineas`(IN v_OT VARCHAR(20),IN v_Parte VARCHAR(100) ,IN v_Cantidad INT, IN v_id INT)
BEGIN

	SET @EnviadasAntes := (SELECT Enviadas FROM areaembarques WHERE id = v_id);
	UPDATE areaembarques SET Enviadas =  (v_Cantidad + @EnviadasAntes) WHERE id = v_id ;
 
	SET @TotalEnviados := (SELECT SUM(Enviadas) FROM areaembarques WHERE OT = v_OT AND Parte = v_Parte);
	SET @CantidadOT := (SELECT CantOt FROM controlplaner WHERE OT = v_OT AND Parte = v_Parte);
	SET @CantidadRecibido := (SELECT Recibido FROM controlplaner WHERE OT = v_OT AND Parte = v_Parte);
	
	IF( @CantidadRecibido >= @CantidadRecibido) THEN
		UPDATE areaembarques SET Estatus = 'Espera', FechaProd = NOW() WHERE id = v_id;
		ELSE
				(SELECT 'adios');
	END IF;
	
 
		IF (@TotalEnviados >= @CantidadOT) THEN
			UPDATE controlplaner SET Estatus = 'Cerrada' WHERE OT = v_OT AND Parte = v_Parte;
				UPDATE areaacabados SET Estatus = 'Cerrada' WHERE OT = v_OT AND Parte = v_Parte;
					UPDATE areacalidad SET Estatus = 'Cerrada' WHERE OT = v_OT AND Parte = v_Parte;
						UPDATE TratamientosExterno SET Estatus = 'Cerrada' WHERE OT = v_OT AND Parte = v_Parte;
							UPDATE areatratamientos SET Estatus = 'Cerrada' WHERE OT = v_OT AND Parte = v_Parte;
								UPDATE areaembarques SET Estatus = 'Cerrada' WHERE OT = v_OT AND Parte = v_Parte;
			
		ELSE
				(SELECT 'adios');
		END IF;
END


CALL CerrarLineas('59407','W54243',5,1);
 
UPDATE areaembarques SET Enviadas = 10 WHERE id = 1




 WHERE OT  = '72952'


ALTER TABLE areatratamientos ADD Usuario VARCHAR(30) DEFAULT NULL;

SELECT * FROM  areatratamientos;

mysqladmin flush-hosts

/****************************************************************************/

UPDATE areaacabados SET FechaRegistro = '2021-03-28 10:00:00' WHERE id = 1;


UPDATE areaacabados SET FechaProd = now() WHERE id = 1;
/**********************************************************************************************************************************************************************/
INSERT INTO V_Destino (Estatus,OT,Parte,CantOT,FechaVenc,Planta,Origen)VALUES('Abierta','"+OT+"','"+Parte+"','"+cantidadDestino+"','"+Fin+"','"+Planta+"','"+AreaOrigen+"'
CREATE PROCEDURE `TransFlujo`(IN OT VARCHAR(25),IN Parte VARCHAR(25),IN cantidadDestino INT,IN cantidadActual INT,IN FechaVenc VARCHAR(25), IN Planta VARCHAR(25), IN V_id INT,IN V_Caso VARCHAR(25),IN V_Origen VARCHAR(25),IN V_Destino VARCHAR(25))

SELECT * FROM maquinas


	SET @TotalEnviados := (SELECT SUM(Enviadas) FROM areaembarques WHERE OT = '59407' AND Parte = 'W54243');
	SET @CantidadOT := (SELECT CantOt FROM controlplaner WHERE OT = '59407' AND Parte = 'W54243');
SELECT  @CantidadOT,@TotalEnviados 
 

SELECT P.OT,P.Parte,P.Estatus,P.CantOt,P.FechaInicio AS Pro_Inicio,P.FechaVenc AS Pro_Venc,A.FechaInicio AS Aca_Inicio, A.FechaProd AS Aca_Venc,C.FechaInicio AS Cal_Inicio,C.FechaProd AS Cal_Venc,E.FechaInicio AS Emb_Inicio,E.FechaProd AS Emb_Venc,T.FechaInicio AS Trat_Inicio,T.FechaProd AS Tra_Venc  
FROM controlplaner P, areaacabados A,areacalidad C, areaembarques E, areatratamientos T  WHERE P.OT = '70098'



SELECT * FROM controlplaner WHERE ot = '70098'

SELECT * FROM areatratamientos

UPDATE areatratamientos SET FechaInicio = '2021-01-10 00:00:00', FechaProd = '2021-01-15 00:00:00'
UPDATE controlplaner SET Estatus = 'OK'

 /*
 mysql> SELECT STRCMP('text', 'text2');
        -> -1
mysql> SELECT STRCMP('text2', 'text');
        -> 1
mysql> SELECT STRCMP('text', 'text');
        -> 0
        SELECT IF(STRCMP('test','test1'),'no','yes');
*/

 
 
 
 
 SELECT 'ok' WHERE exists (SELECT * FROM almacen WHERE Producto = 'ProductoPrueba')
 
 SELECT * FROM almacen IF((SELECT * FROM almacen WHERE exist Producto = 'ProductoPrueba'));
 
 SELECT IF(STRCMP('test','test1')),'no','yes');
 
 
 
 (SELECT STRCMP(@Condicion,'Existe'))

/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
 
 DELIMITER //
CREATE PROCEDURE `Prueba`(IN V_ID int, IN V_Producto varchar(200),IN V_Stock int,IN V_Planta VARCHAR(25),IN V_Usuario VARCHAR(25))
BEGIN

SET @Condicion := (SELECT 'Existe' WHERE EXISTS(SELECT Producto FROM almacen WHERE Producto = V_Producto AND almacen = V_Planta));
SELECT @Condicion;
	
		IF ((SELECT STRCMP(@Condicion,'Existe')) = 0) THEN
		
		SET @StockActual := (SELECT Stock FROM almacen WHERE Producto = V_Producto AND almacen = V_Planta);
		UPDATE almacen SET Stock  = @StockActual + V_Stock  WHERE Producto = V_Producto AND Almacen = V_Planta;
  
	  ELSE 
			INSERT IGNORE INTO almacen (Producto,Stock,Almacen) VALUES (V_Producto,V_Stock,V_Planta);
			INSERT INTO HisRecoleccion (Producto,Cantidad,Usuario,Planta) VALUES (V_Producto,V_Stock,V_Usuario,V_Planta);
		END IF;
			DELETE FROM ProductoFlotante WHERE id = V_ID;
END


call Prueba(1,'Nuevo',10,'Almacen Bravo','Sergio');

SELECT * FROM almacen WHERE Producto ='IN0340 - GUANTE SEGURIDAD';

 /****************************************************************************************************************************************************/
(SELECT Producto,Stock,StockUsado,Almacen, "1" FROM almacen WHERE Producto = 'IN0340 - GUANTE SEGURIDAD' AND Almacen = 'Almacen Morelos')
UNION ALL
(SELECT Producto,Stock,StockUsado,almacen, "2" FROM almacen WHERE Producto = 'IN0340 - GUANTE SEGURIDAD' AND Almacen = 'Almacen Bravo')
ORDER BY Producto

 



  /****************************************************************************************************************************************************/
 DELIMITER //
CREATE PROCEDURE `NotasAccesorios`(IN V_PO varchar(200),IN V_Nota VARCHAR(300))
BEGIN
	IF NOT EXISTS ( SELECT 1 FROM NotaAccesorios WHERE POCliente = V_PO) then
	    INSERT INTO NotaAccesorios (POCliente,Notas)VALUES(V_PO,V_Nota);
	ELSE 
		 UPDATE notaaccesorios SET Notas = V_Nota WHERE POCliente = POCliente;
	END IF;
END;

CALL NotasAccesorios('4501392420_10','Nota11')

/****************************************************************************************************************************************************/
 DELIMITER //
CREATE PROCEDURE `LeerAccesorios`(IN V_Variable varchar(200))
BEGIN
	SET @Condicion := (SELECT 'Existe' AS Condicion  WHERE EXISTS (SELECT  A.*,N.Notas FROM accesorios A, notaaccesorios N WHERE (A.OCGemak = V_Variable OR A.POCliente = V_Variable OR A.OT = V_Variable) AND N.POCliente = A.POCliente ORDER BY Entregado));
		IF(@Condicion = 'Existe') then
		 SELECT  A.*,N.Notas FROM accesorios A, notaaccesorios N WHERE (A.OCGemak = V_Variable OR A.POCliente = V_Variable OR A.OT = V_Variable) AND N.POCliente = A.POCliente ORDER BY Entregado;
		ELSE 
			 SELECT  A.*,'N/A' FROM accesorios A WHERE A.OCGemak = V_Variable OR A.POCliente = V_Variable OR A.OT = V_Variable  ORDER BY Entregado ASC;
		END IF;
END

CALL LeerAccesorios('73428')
 
  SELECT * FROM accesorios  WHERE OT = '73428'
 
  SELECT * FROM accesorios  WHERE OT = '72873'
  
  SELECT * FROM notaaccesorios

73428
72873
 
 
  SELECT  A.*,'N/A' FROM accesorios A WHERE A.OCGemak = '73428' OR A.POCliente = '73428' OR A.OT = '73428'  ORDER BY Entregado ASC;

SET @V_Variable := '73428';
SET @Condicion := (SELECT 'Existe' AS Condicion  WHERE EXISTS (SELECT  A.*,N.Notas FROM accesorios A, notaaccesorios N WHERE (A.OCGemak = @V_Variable OR A.POCliente = @V_Variable OR A.OT = @V_Variable) AND N.POCliente = A.POCliente ORDER BY Entregado));
	SELECT @Condicion;
		 SELECT  A.*,N.Notas FROM accesorios A, notaaccesorios N WHERE (A.OCGemak = @V_Variable OR A.POCliente = @V_Variable OR A.OT = @V_Variable) AND N.POCliente = A.POCliente ORDER BY Entregado;


/**********************************************************************************************************************************************************************/
DELIMITER //
CREATE PROCEDURE `DespacharAccesorio`(IN V_Id INT,IN V_Cantidad INT,IN V_Recibe varchar(200))
BEGIN

	SET @CantidadActual := (SELECT Cantidad FROM accesorios WHERE id = V_Id)-V_Cantidad;
	SELECT @CantidadActual;
	
	 UPDATE accesorios SET Cantidad = @CantidadActual, Entregado = NOW(), Recibe = V_Recibe WHERE id = V_Id;
	 
END


/**********************************************************************************************************************************************************************/
DELIMITER //
CREATE PROCEDURE `DespacharTrabajoIn`(IN V_Id INT, IN V_Cantidad INT)
BEGIN

	SET @CantidadActual := (SELECT Cantidad FROM TrabajosIn WHERE id = V_Id)-V_Cantidad;
	SELECT @CantidadActual;
	
	 UPDATE TrabajosIn SET Cantidad = @CantidadActual WHERE id = V_Id;
	 
END


CALL DespacharTrabajoIn(1,1)

SELECT * FROM TrabajosIn

DELETE FROM TrabajosIn WHERE id = 1
UPDATE trabajosin SET Cantidad = 100 WHERE id = 1



select count(distinct Folio) AS Total  from SalidaTrabajoIn

SELECT * FROM TrabajosIn WHERE Cantidad > 0


 DELIMITER //
CREATE PROCEDURE `InstruccionesTrabajoIn`(IN V_OT varchar(200),IN V_Nota VARCHAR(300))
BEGIN
	IF NOT EXISTS ( SELECT 1 FROM NotaTrabajoIn WHERE OT = V_OT) then
	    INSERT INTO NotaTrabajoIn (OT,Instrucciones)VALUES(V_OT,V_Nota);
	ELSE 
		 UPDATE NotaTrabajoIn SET Instrucciones = V_Nota WHERE OT = V_OT;
	END IF;
END;


 

/****************************************************************************************************************************************************/
 DELIMITER //
CREATE PROCEDURE `CargaCapturasEntregadoTI`()
BEGIN
 SELECT  T.FechaRegistro,T.Usuario, T.OT, T.PN, T.Articulo,T.Cantidad AS inicial, N.Cantidad AS final, N.Aprobado, N.Entregado, N.FechaEntrega,N.idtrabajoIn FROM trabajosin T, SalidaTrabajoIn N WHERE T.Cantidad <= 0 AND T.id = N.idtrabajoIn ORDER BY N.FechaEntrega ASC;
END
 

 DELIMITER //
CREATE PROCEDURE `CargaCapturasPorEntregarTI`()
BEGIN
 SELECT  T.FechaRegistro,T.Usuario, T.OT, T.PN, T.Articulo,T.Cantidad AS inicial, N.Cantidad AS final, N.Aprobado, N.Entregado, N.FechaEntrega,N.idtrabajoIn FROM trabajosin T, SalidaTrabajoIn N WHERE T.Cantidad > 0 AND T.id = N.idtrabajoIn ORDER BY N.FechaEntrega ASC;
END

 
call CargaCapturasEntregadoTI('0000');

call CargaCapturasPorEntregarTI();

SELECT * FROM trabajosin ORDER BY  Entregado ASC,Cantidad DESC

SELECT * FROM trabajosin;
SELECT * FROM salidatrabajoin;

SELECT * FROM notatrabajoin;

TRUNCATE TABLE trabajosin;
TRUNCATE TABLE NotaTrabajoIn;
TRUNCATE TABLE salidatrabajoin;

SET @Condicion := '0000';
SELECT  T.FechaRegistro,T.Usuario, T.OT, T.PN, T.Articulo, N.Cantidad, N.Aprobado, N.Entregado, N.FechaEntrega,N.idtrabajoIn FROM trabajosin T, SalidaTrabajoIn N WHERE T.OT = @Condicion OR T.PN = @Condicion OR T.Articulo = @Condicion AND T.id = N.idtrabajoIn ORDER BY N.FechaEntrega ASC;
 
 
 
 
SELECT  T.FechaRegistro,T.Usuario, T.OT, T.PN, T.Articulo, N.Cantidad, N.Aprobado, N.Entregado, N.FechaEntrega,N.idtrabajoIn FROM trabajosin T, SalidaTrabajoIn N WHERE T.Cantidad <= 0 AND T.id = N.idtrabajoIn ORDER BY N.FechaEntrega ASC;



SELECT  T.FechaRegistro,T.Usuario, T.OT, T.PN, T.Articulo, N.Cantidad, N.Aprobado, N.Entregado, N.FechaEntrega,N.idtrabajoIn FROM trabajosin T, SalidaTrabajoIn N WHERE T.Cantidad > 0 AND T.id = N.idtrabajoIn ORDER BY N.FechaEntrega ASC;

 
  
 
 
 
 
 
 

 
 
sigg