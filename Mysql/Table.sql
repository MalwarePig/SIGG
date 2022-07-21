CREATE TABLE `folioalmacenRetorno` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Folio` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) 
/********************************************************************/

CREATE TABLE `almacen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Clave` varchar(180) DEFAULT NULL,
  `Producto` varchar(180) DEFAULT NULL,
  `Almacen` varchar(20) DEFAULT NULL,
  `Stock` SMALLINT DEFAULT NULL,
  `StockMin` SMALLINT DEFAULT NULL,
  `StockMax` SMALLINT DEFAULT NULL,
  `StockUsado` SMALLINT DEFAULT NULL,
  `Ubicacion` varchar(10) DEFAULT NULL,
  `Estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) 

/********************************************************************/

CREATE TABLE `gaveta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Clave` varchar(180) DEFAULT NULL,
  `Producto` varchar(180) DEFAULT NULL,
  `Almacen` varchar(20) DEFAULT NULL,
  `Stock` SMALLINT DEFAULT NULL,
  `StockMin` SMALLINT DEFAULT NULL,
  `StockMax` SMALLINT DEFAULT NULL,
  `StockUsado` SMALLINT DEFAULT NULL,
  `Ubicacion` varchar(10) DEFAULT NULL,
  `Estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) 

SELECT * FROM almacen WHERE almacen = 'Gaveta'

SELECT DISTINCT Producto,Clave FROM almacen

SELECT Producto FROM almacen WHERE DISTINCT Producto

INSERT INTO gaveta (Clave,Producto) SELECT DISTINCT Clave,Producto FROM almacen

UPDATE almacen SET Stock = 0, StockMin = 0, StockMax = 0, StockUsado = 0 WHERE almacen = 'Gaveta'

INSERT INTO almacen (Clave,Producto,Almacen) SELECt  Clave,Producto,Almacen FROM gaveta

SELECT * FROM productoflotante

SELECT Stock FROM almacen WHERE Producto = 'Producto_Prueba' AND Almacen = 'Gaveta'
/********************************************************************/

CREATE TABLE `requisiciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Folio` varchar(15) DEFAULT NULL,
  `Clave` varchar(15) DEFAULT NULL,
  `Producto` varchar(200) DEFAULT NULL,
  `CantidadReq` int(11) DEFAULT (0),
   `OT` varchar(10) DEFAULT NULL,
  `Comentarios` varchar(250) DEFAULT NULL,
  `EmpleadoReq` varchar(50) DEFAULT NULL,
  `Planta` varchar(50) DEFAULT NULL,
  `Estatus` varchar(20) DEFAULT NULL,
    `FechaReq` datetime DEFAULT (CURDATE()),
  PRIMARY KEY (`id`)
)
/********************************************************************/

CREATE TABLE `pronostico` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Clave` varchar(15) DEFAULT NULL,
  `Producto` varchar(200) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT (0),
  `OT` varchar(10) DEFAULT NULL,
  `Comentarios` varchar(250) DEFAULT NULL,
  `Planta` varchar(50) DEFAULT NULL,
  `Estatus` varchar(20) DEFAULT NULL,
  `EmpleadoReq` varchar(50) DEFAULT NULL,
  `FechaReq` datetime DEFAULT (CURDATE()),
  PRIMARY KEY (`id`)
)
/********************************************************************/

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(30) DEFAULT NULL,
  `usuario` varchar(20) DEFAULT NULL,
  `pass` varchar(20) DEFAULT NULL,
  `Planta` varchar(20) DEFAULT NULL,
  `Area` varchar(25) DEFAULT NULL,
  `Nivel` varchar(20) DEFAULT NULL,
  `Turno` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) 
/********************************************************************/

CREATE TABLE `PreAuditoria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Producto` varchar(200) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT (0),
  `Estatus` varchar(20) DEFAULT NULL,
  `Auditor` varchar(20) DEFAULT NULL,
  `FechaReq` datetime DEFAULT (CURDATE()),
  PRIMARY KEY (`id`)
)
/********************************************************************/

CREATE TABLE `EstadoAuditoria` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  `Turno` varchar(30) DEFAULT NULL,
  `Estado` int(11) DEFAULT (0),
  `Almacen` varchar(20) DEFAULT NULL
)
/********************************************************************/

CREATE TABLE `RegistrosFaltantes` (
  `Producto` varchar(200) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT (0),
  `Auditor` varchar(20) DEFAULT NULL,
  `Almacen` varchar(20) DEFAULT NULL,
  `FechaReq` datetime DEFAULT (CURDATE()),
  `Notas` VARCHAR(300) DEFAULT NULL
)

/********************************************************************/

CREATE TABLE `AudiCiclico` (
  `id` int(11)    AUTO_INCREMENT,
  `Producto` varchar(200) DEFAULT NULL,
  `Contado` int(11) DEFAULT (0),
  `Stock` int(11) DEFAULT (0),
  `Auditor` varchar(20) DEFAULT NULL,
  `Almacen` varchar(20) DEFAULT NULL,
  `Fecha` datetime DEFAULT (CURDATE()),
  PRIMARY KEY (`id`)
)

/********************************************************************/

CREATE TABLE `materiales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Folio` varchar(15) DEFAULT NULL,
  `Producto` varchar(200) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT (0),
  `Estado` varchar(50) DEFAULT NULL,
  `OT` varchar(50) DEFAULT NULL,
  `Empleado` varchar(50) DEFAULT NULL,
  `Turno` varchar(3) DEFAULT NULL,
  `Maquina` varchar(30) DEFAULT NULL,
  `Comentarios` varchar(250) DEFAULT NULL,
  `Movimiento` varchar(20) DEFAULT NULL,
  `Usuario` varchar(20) DEFAULT NULL,
  `Almacen` varchar(50) DEFAULT NULL,
  `Salida` datetime DEFAULT (now()),
  PRIMARY KEY (`id`)
)
/********************************************************************/

CREATE TABLE `materiales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Folio` varchar(15) DEFAULT NULL,

  PRIMARY KEY (`id`)
)
/********************************************************************/

CREATE TABLE `itemretorno` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Folio` varchar(15) DEFAULT NULL,
  `Producto` varchar(200) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT (0),
  `Estado` varchar(50) DEFAULT NULL,
  `OT` varchar(50) DEFAULT NULL,
  `Empleado` varchar(50) DEFAULT NULL,
  `Turno` varchar(3) DEFAULT NULL,
  `Maquina` varchar(30) DEFAULT NULL,
  `Comentarios` varchar(250) DEFAULT NULL,
  `Movimiento` varchar(20) DEFAULT NULL,
  `Usuario` varchar(20) DEFAULT NULL,
  `Almacen` varchar(50) DEFAULT NULL,
  `Salida` datetime DEFAULT (now()),
  PRIMARY KEY (`id`)
)

/********************************************************************/

CREATE TABLE `Recepcion` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `Producto` varchar(200) DEFAULT NULL,
  `Ordenado` SMALLINT DEFAULT (0),
  `Entregado` SMALLINT DEFAULT (0),
  `Usuario` varchar(20) DEFAULT NULL,
  `Estatus` varchar(20) DEFAULT NULL,
  `Entrada` datetime DEFAULT (CURDATE())
)

/********************************************************************/

CREATE TABLE `ProductoFlotante`(
	`id`  int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`Producto` varchar(200)DEFAULT NULL,
	`Cantidad` SMALLINT DEFAULT NULL,
	`Estatus` varchar(25) DEFAULT NULL,
	`Planta` varchar(25) DEFAULT NULL
) 
SELECT * FROM ProductoFlotante
/********************************************************************/

CREATE TABLE `HisRecoleccion`(
	`id`  int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`Producto` varchar(200)DEFAULT NULL,
	`Cantidad` SMALLINT DEFAULT NULL,
	`Usuario` varchar(25) DEFAULT NULL,
	`Planta` varchar(25) DEFAULT NULL,
	`Entrada` datetime DEFAULT (CURDATE())
) 

/********************************************************************/

CREATE TABLE `IntercambioActivo`(
	`id`  int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`Producto` varchar(200)DEFAULT NULL,
	`Cantidad` SMALLINT DEFAULT NULL,
	`Estado` varchar(25) DEFAULT NULL,
	`Empleado` VARCHAR(50) DEFAULT NULL,
	`Planta` varchar(25) DEFAULT NULL,
	`Comentario` VARCHAR(350) DEFAULT NULL,
	`Estatus` varchar(25) DEFAULT NULL,
	`Fecha` datetime DEFAULT (CURDATE())
)  

SELECT * FROM intercambioactivo

 /********************************************************************/

CREATE TABLE `StockMateriales` (
`id`  int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `OT` VARCHAR(25) DEFAULT NULL,
  `NoParte` VARCHAR(25) DEFAULT (0),
  `Proveedor` VARCHAR(50) DEFAULT NULL,
  `Colada` VARCHAR(20) DEFAULT NULL,
  `OD` VARCHAR(10) DEFAULT NULL,
  `InD` VARCHAR(10) DEFAULT NULL,
  `LG` VARCHAR(10) DEFAULT NULL,
  `QTY` VARCHAR(5) DEFAULT NULL,
  `SPEC` VARCHAR(200) DEFAULT NULL,
  `Ubicacion` VARCHAR(10) DEFAULT NULL,
  `PESO` varchar(30) DEFAULT NULL,
  `Entrada` varchar(20) DEFAULT NULL,
  `Salida` varchar(20) DEFAULT NULL,
  `Entregado` VARCHAR(10) DEFAULT NULL,
  `Status` varchar(30) DEFAULT NULL,
  `Sobran` varchar(20) DEFAULT NULL,
  `Usado` varchar(20) DEFAULT NULL,
  `Notas` VARCHAR(300) DEFAULT NULL  
)

 /********************************************************************/

CREATE TABLE `Importaciones` (
  `id`  int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `Pedimento` VARCHAR(30) DEFAULT NULL,
  `Origen` VARCHAR(20) DEFAULT NULL,
  `Proveedor` VARCHAR(150) DEFAULT (0),
  `Factura` VARCHAR(50) DEFAULT NULL,
  `Monto` VARCHAR(20) DEFAULT NULL,
  `Cantidad` VARCHAR(10) DEFAULT NULL,
  `OT` VARCHAR(15) DEFAULT NULL,
  `OC` VARCHAR(30) DEFAULT NULL,
  `Descripcion` VARCHAR(250) DEFAULT NULL,
  `Diametro` VARCHAR(150) DEFAULT NULL,
  `DiametroIn` VARCHAR(150) DEFAULT NULL,
  `Largo` VARCHAR(15) DEFAULT NULL,
  `LBS` VARCHAR(15) DEFAULT NULL,
  `KG` VARCHAR(20) DEFAULT NULL,
  `Colada` VARCHAR(30) DEFAULT NULL,
  `Tarima` VARCHAR(20) DEFAULT NULL,
  `FecheRegsitro` datetime DEFAULT (CURDATE())
)


 /********************************************************************/

CREATE TABLE `kits` (
  `id`  int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `OT` VARCHAR(15) DEFAULT NULL,
  `Cliente` VARCHAR(100) DEFAULT NULL,
  `Rev` VARCHAR(50) DEFAULT (0),
  `PO` VARCHAR(50) DEFAULT NULL,
  `Ens` VARCHAR(5) DEFAULT NULL,
  `Parte` VARCHAR(70) DEFAULT NULL,
  `Cantidad` VARCHAR(10) DEFAULT NULL,
  `Pendientes` VARCHAR(10) DEFAULT NULL,
  `Descripcion` VARCHAR(200) DEFAULT NULL
)

 /********************************************************************/

CREATE TABLE `Componentes` (
  `id`  int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `OT` VARCHAR(15) DEFAULT NULL,
  `Cliente` VARCHAR(100) DEFAULT NULL,
  `Rev` VARCHAR(50) DEFAULT (0),
  `PO` VARCHAR(50) DEFAULT NULL,
  `Ens` VARCHAR(5) DEFAULT NULL,
  `Parte` VARCHAR(70) DEFAULT NULL,
  `Cantidad` VARCHAR(10) DEFAULT NULL,
  `Pendientes` VARCHAR(10) DEFAULT NULL,
  `Descripcion` VARCHAR(200) DEFAULT NULL
)

/********************************************************************/

CREATE TABLE `SubComponentes` (
  `id`  int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `Reqs` VARCHAR(200) DEFAULT NULL,
  `OT` VARCHAR(15) DEFAULT NULL,
  `PO` VARCHAR(50) DEFAULT NULL,
  `Parte` VARCHAR(50) DEFAULT NULL,
  `Cantidad` SMALLINT DEFAULT NULL,
  `Estatus` VARCHAR(20) DEFAULT NULL
)
 				
/*********************************************************************/

CREATE TABLE `controlplaner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Maquina` varchar(60) DEFAULT NULL,
  `Estatus` varchar(25) DEFAULT NULL,
  `OT` varchar(10) DEFAULT NULL,
  `Parte` varchar(60) DEFAULT NULL,
  `CantOt` varchar(25) DEFAULT NULL,
  `FechaRegistro` datetime DEFAULT (now()),
  `FechaInicio` datetime DEFAULT NULL,
  `FechaVenc` datetime DEFAULT NULL,
  `FechaProd` datetime DEFAULT NULL,
  `Horas` varchar(5) DEFAULT NULL,
  `Programa` varchar(20) DEFAULT NULL,
  `Herramienta` varchar(25) DEFAULT NULL,
  `Comentarios` varchar(60) DEFAULT NULL,
  `Fisico` varchar(35) DEFAULT NULL,
  `Planta` varchar(10) DEFAULT NULL,
  `Cliente` VARCHAR(60) DEFAULT NULL,
  `Origen` VARCHAR(20) DEFAULT NULL,
  `Servicio` VARCHAR(30) DEFAULT NULL,
  `Terminadas` SMALLINT DEFAULT 0,
  `Enviadas` SMALLINT DEFAULT 0,
  `Stock` SMALLINT DEFAULT 0,
  `Recibido` SMALLINT DEFAULT 0,
  `Extra` SMALLINT DEFAULT 0,
  `Materialista` VARCHAR(50),
  `Recibe` VARCHAR(50)
  PRIMARY KEY (`id`)
)

SELECT * FROM controlplaner
 ALTER TABLE `AreaCalidad`MODIFY `Estatus` VARCHAR (75) DEFAULT NULL;

/*********************************************************************/
CREATE TABLE `AreaCalidad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Estatus` VARCHAR(75) DEFAULT NULL,
  `OT` varchar(10) DEFAULT NULL,
  `Parte` varchar(60) DEFAULT NULL,
  `CantOt` varchar(25) DEFAULT NULL,
  `FechaRegistro` datetime DEFAULT (now()),
  `FechaInicio` datetime DEFAULT NULL,
  `FechaVenc` datetime DEFAULT NULL,
  `FechaProd` datetime DEFAULT NULL,
  `Horas` varchar(5) DEFAULT NULL,
  `Comentarios` VARCHAR(200) DEFAULT NULL,
  `Planta` varchar(10) DEFAULT NULL,
   `Cliente` VARCHAR(60) DEFAULT NULL,
     `Origen` VARCHAR(20) DEFAULT NULL,
  `Servicio` VARCHAR(30) DEFAULT NULL,
  `Terminadas` SMALLINT DEFAULT 0,
  `Enviadas` SMALLINT DEFAULT 0,
  `Stock` SMALLINT DEFAULT 0,
 `Recibido` SMALLINT DEFAULT 0,
  `Extra` SMALLINT DEFAULT 0,
  PRIMARY KEY (`id`)
) 
 				
/*********************************************************************/			
CREATE TABLE `AreaAcabados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Estatus` VARCHAR(75) DEFAULT NULL,
  `OT` varchar(10) DEFAULT NULL,
  `Parte` varchar(60) DEFAULT NULL,
  `CantOt` varchar(25) DEFAULT NULL,
  `FechaRegistro` datetime DEFAULT (now()),
  `FechaInicio` datetime DEFAULT NULL,
  `FechaVenc` datetime DEFAULT NULL,
  `FechaProd` datetime DEFAULT NULL,
  `Horas` varchar(5) DEFAULT NULL,
  `Comentarios` VARCHAR(200) DEFAULT NULL,
  `Planta` varchar(10) DEFAULT NULL,
   `Cliente` VARCHAR(60) DEFAULT NULL,
  `Origen` VARCHAR(20) DEFAULT NULL,
  `Servicio` VARCHAR(30) DEFAULT NULL,
  `Terminadas` SMALLINT DEFAULT 0,
  `Enviadas` SMALLINT DEFAULT 0,
  `Stock` SMALLINT DEFAULT 0,
  `Recibido` SMALLINT DEFAULT 0,
  `Extra` SMALLINT DEFAULT 0,
  PRIMARY KEY (`id`)
) 
 				
/*********************************************************************/			
CREATE TABLE `AreaTratamientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Estatus` VARCHAR(75) DEFAULT NULL,
  `OT` varchar(10) DEFAULT NULL,
  `Parte` varchar(60) DEFAULT NULL,
  `CantOt` varchar(25) DEFAULT NULL,
  `FechaRegistro` datetime DEFAULT (now()),
  `FechaInicio` datetime DEFAULT NULL,
   `FechaProd` datetime DEFAULT NULL,
  `FechaRetornoServicio` datetime DEFAULT NULL,
  `FechaVenc` datetime DEFAULT NULL,
  `Horas` varchar(5) DEFAULT NULL,
  `Comentarios` VARCHAR(200) DEFAULT NULL,
  `Planta` varchar(10) DEFAULT NULL,
  `Cliente` VARCHAR(60) DEFAULT NULL,
  `Origen` VARCHAR(20) DEFAULT NULL,
  `Servicio` VARCHAR(30) DEFAULT NULL,
  `Terminadas` SMALLINT DEFAULT 0,
  `Enviadas` SMALLINT DEFAULT 0,
  `Stock` SMALLINT DEFAULT 0,
  `Retrabajo` varchar(10) DEFAULT NULL,
`Recibido` SMALLINT DEFAULT 0,
  `Extra` SMALLINT DEFAULT 0,
  PRIMARY KEY (`id`)
) 

SELECT * FROM AreaTratamientos

/**************************** Material en servicio externo *****************************************/			
CREATE TABLE `TratamientosExterno` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Estatus` VARCHAR(75) DEFAULT NULL,
  `OT` varchar(10) DEFAULT NULL,
  `Parte` varchar(60) DEFAULT NULL,
  `CantOt` varchar(25) DEFAULT NULL,
  `FechaRegistro` datetime DEFAULT (now()),
  `Servicio` VARCHAR(30) DEFAULT NULL,
  `Proveedor` VARCHAR(30) DEFAULT NULL,
  `Terminadas` SMALLINT DEFAULT 0,
  `Recibidas` SMALLINT DEFAULT 0,
  `Retrabajo` varchar(10) DEFAULT NULL,
  `Recibido` SMALLINT DEFAULT 0,
  `Extra` SMALLINT DEFAULT 0,
  PRIMARY KEY (`id`)
) 
 				
/*********************************************************************/							
CREATE TABLE `AreaEmbarques` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Estatus` VARCHAR(75) DEFAULT NULL,
  `OT` varchar(10) DEFAULT NULL,
  `Parte` varchar(60) DEFAULT NULL,
  `CantOt` varchar(25) DEFAULT NULL,
  `FechaRegistro` datetime DEFAULT (now()),
  `FechaInicio` datetime DEFAULT NULL,
  `FechaVenc` datetime DEFAULT NULL,
  `FechaProd` datetime DEFAULT NULL,
  `Horas` varchar(5) DEFAULT NULL,
  `Comentarios` VARCHAR(200) DEFAULT NULL,
  `Planta` varchar(10) DEFAULT NULL,
  `Cliente` VARCHAR(60) DEFAULT NULL,
  `Origen` VARCHAR(20) DEFAULT NULL,
  `Servicio` VARCHAR(30) DEFAULT NULL,
  `Terminadas` SMALLINT DEFAULT 0,
  `Enviadas` SMALLINT DEFAULT 0,
  `Stock` SMALLINT DEFAULT 0,
  `Recibido` SMALLINT DEFAULT 0,
  `Extra` SMALLINT DEFAULT 0,
  PRIMARY KEY (`id`)
)

SELECT * FROM AreaEmbarques

/*********************************************************************/
CREATE TABLE `eficiencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `OT` VARCHAR(15) DEFAULT NULL,
  `Maquina` VARCHAR(50) DEFAULT NULL,
  `FechaInicio` datetime DEFAULT NULL,
  `FechaFin` datetime DEFAULT NULL,
  `CantOT` MediumInt DEFAULT 0,
  
   `Nomina` VARCHAR(7) DEFAULT NULL,
   `Nombre` VARCHAR(100) DEFAULT NULL,
   `Turno` VARCHAR(20) DEFAULT NULL,
   `Planta` VARCHAR(20) DEFAULT NULL,
   
  `TiempoOperacion` MediumInt DEFAULT NULL,
  `CantTurno` MediumInt DEFAULT NULL,
  `Estimado` MediumInt DEFAULT NULL,
  
  `TotalTMuerto` MediumInt DEFAULT NULL,
  `Eficiencia` DECIMAL(19,4) DEFAULT NULL,


   `Aditamentos` MediumInt DEFAULT 0,
   `Herramienta` MediumInt DEFAULT 0,
   `Liberacion` MediumInt DEFAULT 0,
   `Luz` MediumInt DEFAULT 0,
   `Mantenimiento` MediumInt DEFAULT 0,
   `Material` MediumInt DEFAULT 0,
   `Planeacion` MediumInt DEFAULT 0,
   `Programas` MediumInt DEFAULT 0,
   `Setup` MediumInt DEFAULT 0,
   `Otros` MediumInt DEFAULT 0,
   `Insertos` MediumInt DEFAULT 0,
  
   PRIMARY KEY (`id`)
)
 


SELECT * FROM maquinas WHERE Planta = 'Bravo'

/*********************************************************************/
CREATE TABLE `Accesorios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `OCGemak` VARCHAR(30) DEFAULT NULL,
  `OT` VARCHAR(15) DEFAULT NULL,
  `Producto` VARCHAR(200) DEFAULT NULL,
  `POCliente` VARCHAR(30) DEFAULT NULL,
  `ENS` VARCHAR(5) DEFAULT NULL,
  
  `Cantidad` MediumInt DEFAULT 0,
  `Ubicacion`VARCHAR(15) DEFAULT NULL,
  `Entregado` datetime DEFAULT null,
  `Recibe`VARCHAR(50) DEFAULT NULL,
   PRIMARY KEY (`id`)
)

/*********************************************************************/
CREATE TABLE `NotaAccesorios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `POCliente` VARCHAR(80) DEFAULT NULL,
  `Notas`VARCHAR(350) DEFAULT NULL,
  
   PRIMARY KEY (`id`)
)

/*********************************************************************/
CREATE TABLE `SalidaAccesorios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idAccesorio` MediumInt DEFAULT 0,
  `Ubicacion`VARCHAR(15) DEFAULT NULL,
  `Entregado` datetime DEFAULT NOW(),
  `Recibe`VARCHAR(50) DEFAULT NULL,
  `Folio` VARCHAR(20) DEFAULT NULL,
  `Cantidad` MediumInt DEFAULT 0,
   PRIMARY KEY (`id`)
)

/************************ Falta Servidor*********************************************/
CREATE TABLE `TrabajosIn` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Usuario` VARCHAR(50) DEFAULT NULL,
  `OT` VARCHAR(15) DEFAULT NULL,
  `PN` VARCHAR(50) DEFAULT NULL,
  `Articulo` VARCHAR(200) DEFAULT NULL,
  `Cantidad` MediumInt DEFAULT 0,
  `Instrucciones` VARCHAR(300) DEFAULT NULL,
  `FechaRegistro` datetime DEFAULT NOW(),
   PRIMARY KEY (`id`)
)

/*********************************************************************/
CREATE TABLE `NotaTrabajoIn` (
  `id` int NOT NULL AUTO_INCREMENT,
  `OT` VARCHAR(80) DEFAULT NULL,
  `Instrucciones`VARCHAR(350) DEFAULT NULL,
  
   PRIMARY KEY (`id`)
)

CREATE TABLE `SalidaTrabajoIn` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idTrabajoIn` MediumInt DEFAULT 0,
  `Aprobado`VARCHAR(50) DEFAULT NULL,
  `Entregado`VARCHAR(50) DEFAULT NULL,
  `Folio` VARCHAR(20) DEFAULT NULL,
  `Cantidad` MediumInt DEFAULT 0,
  `FechaEntrega` datetime DEFAULT NOW(),
   PRIMARY KEY (`id`)
) 

/*********************************************************************/
CREATE TABLE `SoliCompra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Folio` VARCHAR(15) DEFAULT NULL,
  `OT` VARCHAR(15) DEFAULT NULL,
  `PN` VARCHAR(50) DEFAULT NULL,
  `FechaSoli` datetime DEFAULT NOW(),
  `Nombre` VARCHAR(50) DEFAULT NULL,
  `Correo` VARCHAR(30) DEFAULT NULL,
  `Producto` VARCHAR(100) DEFAULT NULL,
  `Cantidad` MediumInt DEFAULT 0,
  `Link`VARCHAR(200) DEFAULT NULL,
  `Notas`VARCHAR(500) DEFAULT NULL,
  `Estado`VARCHAR(20) DEFAULT 'Enviado',
  
   PRIMARY KEY (`id`)
)

/*********************************************************************/
CREATE TABLE `Inspeccion` (
   id INT  PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `FechaEntrada` datetime DEFAULT NOW(),
  `Inspector` VARCHAR(50) DEFAULT NULL,
  `Tipo` VARCHAR(30) DEFAULT NULL,
  `OT` VARCHAR(15) DEFAULT NULL,
  `CantidadOT` MediumInt DEFAULT 0,
  `Notas` VARCHAR(200) DEFAULT NULL,
	`FechaFin` DATETIME DEFAULT NULL,
	`CantidadConforme` MediumInt DEFAULT 0,
   `CantidadNoConforme` MediumInt DEFAULT 0,
   `CantidadRetrabajo` MediumInt DEFAULT 0,
   `CantidadAjuste` MediumInt DEFAULT 0,
	`Operador` VARCHAR(50) DEFAULT NULL,
	`Serie` VARCHAR(10) DEFAULT NULL,
	`Parte` VARCHAR(50) DEFAULT NULL,
	`Familia` VARCHAR(30) DEFAULT NULL,
	`Maquina` VARCHAR(30) DEFAULT NULL
   `Planta` VARCHAR(20) DEFAULT NULL
)


/*********************************************************************/
CREATE TABLE CategoriaAlmacen (
  id INT  PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Nombre VARCHAR(50) DEFAULT NULL,
  Planta VARCHAR(30) DEFAULT NULL
)


SELECT * FROM CategoriaAlmacen WHERE Planta = 'General'

SELECT * FROM Inspeccion


SELECT * FROM almacen

SELECT * FROM CategoriaAlmacen WHERE Planta != 'General' order by Planta,Nombre

DELETE FROM categoriaalmacen WHERE Nombre = 'ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¹Ãƒâ€¦Ã¢â‚¬Å“'

 