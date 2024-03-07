Insertar una nueva columna al final de la tabla:  
ALTER TABLE nombre_tabla ADD fecha_nacimiento date;

Añadir una nueva columna después de otra: 
ALTER TABLE nombre_tabla ADD nombre_columna VARCHAR(5) AFTER nombre_columna_anterior;

Añadir una nueva columna en la primera posición de la tabla:  
ALTER TABLE nombre_tabla ADD nombre_columna VARCHAR(5) INT FIRST; 

Añadir un indice a una columna y eliminar un íncide: 
ALTER TABLE nombre_tabla ADD INDEX (nombre_columna);
ALTER TABLE nombre_tabla DROP INDEX nombre_indice; 

Cambiar el nombre y tipo de dato de una columna:
ALTER TABLE nombre_tabla CHANGE nombre_viejo_columna nombre_nuevo_columna VARCHAR(20);

Solamente cambiar el tipo de dato de una columna:
ALTER TABLE nombre_tabla MODIFY nombre_columna DATE NOT NULL;

Cambiar el juego de caracteres de la tabla: 
ALTER TABLE nombre_tabla CHARACTER SET latin1; 
 
Eliminar una columna de la tabla: 
ALTER TABLE nombre_tabla DROP COLUMN nombre_columna;
  	 
Eliminar varias columnas de la tabla:  
ALTER TABLE nombre_tabla DROP COLUMN nombre_columna, DROP COLUMN nombre_columna2;

Eliminar una clave primaria y clave externa (FOREING KEY y PRIMARY KEY): 
#Eliminar clave primaria
ALTER TABLE nombre_tabla DROP PRIMARY KEY;
#Eliminar clave externa
ALTER TABLE nombre_tabla DROP FOREIGN KEY nombre_columna; 


/**/
