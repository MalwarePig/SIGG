function autocompletar(){
    $.ajax({
        url: "/BuscarHerramientas/"+document.getElementById("BHerramienta").value,
        success: function (Herramientas) {
            console.log(Herramientas);
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove();//elimina los elementos con id Rows
            }
    
            for (var i = 0; i < Herramientas.length; i++) {
                var Clave = Herramientas[i].Clave;
                var Producto = Herramientas[i].Producto;
                //Eliminar variable dentro del For
                Arreglo = [Clave, Producto]
                var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows");//se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);
    
                    if (x == 1) {//Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(2); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (i + 1) + ')> Selección </button>';
                    }
                }//fin de for de columnas
            }//fin de for de filas
        }//Funcion success
    });//Ajax
}

//=========================================== EVENTO CLIC SOBRE LA TABLA DE BUSQUEDA PARA SELECCIONAR HERRAMIENTA =================================================//
function Seleccion(variable) {
    Registro = document.getElementById("Herr_Encontradas");

    //var Clave = Registro.rows[variable].cells[0].childNodes[0].nodeValue; //Obtiene el valor de Clave
    var Producto = Registro.rows[variable].cells[1].childNodes[0].nodeValue; //Obtiene el valor de Producto

    document.RegistroSalida.Sal_Herramienta.value = Producto;
}

//=========================================== EVENTO CLIC SOBRE BOTON EN FORMULARIO PARA CREAR LA NOTA DE SALIDA =================================================//
function CrearNota() {
    var Producto = document.getElementById("Producto").value; //Obtiene el valor de Clave
    var Cantidad = document.getElementById("cantidad").value; //Obtiene el valor de Clave
    var Comentario = document.getElementById("Comentario").value; //Obtiene el valor de Clave
    var Arreglo = [Producto, Cantidad, Comentario];
    var Condicion = true;//para campos vacios
    for (var a in Arreglo) {//recorrer arreglo en busca de campos vacios
        if (Arreglo[a].length == 0) {
            Condicion = false;//si algun campo esta vacio cambia a falso
        }
    }
    if (Condicion == true) {//si todos los campos estan llenos avanza
        var TablaAlmacen = document.getElementById('Almacen').getElementsByTagName('tbody')[0];
        // inserta una fila al final de la tabla
        var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
        let indice = (TablaAlmacen.rows.length + 1);
        newRow.setAttribute("id", "fila" + indice);//se asigna id al incrementar cada fila +1 para contar el encabezado
        for (var x = 0; x < Arreglo.length; x++) {

            // inserta una celda en el indice 0
            var newCell = newRow.insertCell(x);
            // adjuntar el texto al nodo
            var newText = document.createTextNode(Arreglo[x]);
            newCell.appendChild(newText);
            if (x == 8) {//Si termina de registrar datos crear el boton
                var newCell = newRow.insertCell(9); //CREAR CELDA onclick="CrearNota()"
                newCell.innerHTML = '<button id="' + x + '" class="btn btn-danger" name="btn" onclick="EliminarFila(' + indice + ')"> Eliminar </button>';
            }
        }
        //document.getElementById("RegistroSalida").reset();
        document.getElementById("Producto").value = "";
        document.getElementById("Ubicacion").value = "";
        document.getElementById("cantidad").value = "";
    }
}
