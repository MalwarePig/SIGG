var Folio = "";
var Producto = "";
var Cantidad = "";
var Estado = "";
var OT = "";
var Maquina = "";
var Empleado = "";
var Funcional = "";
//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
$(function () {
    // GET PRODUCTS
    $('#getProducts').on('click', () => {
        //OBTENER FILTRO DE FAMILIA
        console.log("Maquina: " + document.getElementById("Maquina").value);
        $.ajax({
            url: '/BuscarHerrRetorno/' + document.getElementById("Maquina").value + '',
            success: function (Herramientas) {
                var Arreglo = [];
                //Limpiar tabla 
                var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
                var limite = TablaAlmacen.rows.length;
                for (var i = 0; i < limite; i++) {
                    $("#Rows").remove(); //elimina los elementos con id Rows
                }

                for (var i = 0; i < Herramientas.length; i++) {
                    var Folio = Herramientas[i].Folio;
                    var Producto = Herramientas[i].Producto;
                    var Entregado = Herramientas[i].Entregado;
                    var Devuelto = Herramientas[i].Devuelto;
                    var Estado = Herramientas[i].Estado;
                    var OT = Herramientas[i].OT;
                    var Maquina = Herramientas[i].Maquina;
                    var Empleado = Herramientas[i].Empleado;
                    var Salida = Fecha(Herramientas[i].Salida);
                    //Eliminar variable dentro del For
                    Arreglo = [Folio, Producto, Entregado, Devuelto, Estado, OT, Maquina, Empleado, Salida];
                    var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
                    // inserta una fila al final de la tabla
                    var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                    for (var x = 0; x < Arreglo.length; x++) {
                        // inserta una celda en el indice 0
                        var newCell = newRow.insertCell(x);
                        newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);

                        if (x == 4) { //Si termina de registrar datos crear el boton
                            var newCell = newRow.insertCell(5); //CREAR CELDA
                            newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (i + 1) + ')> Selección </button>';
                        }
                    } //fin de for de columnas
                } //fin de for de filas
            } //Funcion success
        }); //Ajax
    }); //Evento clic
}); //Funcion JQuery

//=========================================== EVENTO SOLO DATOS NUMERICOS EN CANTIDAD =================================================//
$(function () {
    $(".solo-numero").keydown(function (event) {
        //alert(event.keyCode);
        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105) && event.keyCode !== 190 && event.keyCode !== 110 && event.keyCode !== 8 && event.keyCode !== 9) {
            return false;
        }
    });
}); //Funcion JQuery

//=========================================== BUSCAR MAQUINAS POR TIPO DE FAMILIA =================================================//
function Maquinas() {
    let familia = document.getElementById("Familia").value;
    var listMaquina = document.getElementById("Maquina");
    $.ajax({
        url: '/listaMaquinas/' + familia + '',
        success: function (maquinas) {
            for (let i = listMaquina.options.length; i >= 0; i--) { //Borrar elementos option de select
                listMaquina.remove(i);
            }
            for (var i = 0; i < maquinas.length; i++) { //Agregar nuevos options del select

                var option = document.createElement("option");
                option.text = maquinas[i].Nombre;
                listMaquina.add(option);
            }
        } //Funcion success
    }); //Ajax
}

//=========================================== EVENTO CLIC SOBRE LA TABLA DE BUSQUEDA PARA SELECCIONAR HERRAMIENTA =================================================//
function Seleccion(variable) {
    Registro = document.getElementById("Herr_Encontradas");

    Folio = Registro.rows[variable].cells[0].childNodes[0].nodeValue; //Obtiene el valor de Clave
    Producto = Registro.rows[variable].cells[1].childNodes[0].nodeValue; //Obtiene el valor de Producto
    Cantidad = Registro.rows[variable].cells[2].childNodes[0].nodeValue; //Obtiene el valor de Stock
    Estado = Registro.rows[variable].cells[4].childNodes[0].nodeValue; //Obtiene el valor de StockUsado
    OT = Registro.rows[variable].cells[5].childNodes[0].nodeValue; //Obtiene el valor de Ubicacion
    Maquina = Registro.rows[variable].cells[6].childNodes[0].nodeValue; //Obtiene el valor de Producto
    Empleado = Registro.rows[variable].cells[7].childNodes[0].nodeValue; //Obtiene el valor de Stock

    document.RegistroRetorno.Ret_FolioAnterior.value = Folio;
    document.RegistroRetorno.Ret_Herramienta.value = Producto;
    document.RegistroRetorno.Ret_OT.value = OT;
    document.RegistroRetorno.Ret_Nombre.value = Empleado;
}

//=========================================== ELIMINAR FILA DE REGISTRO EN NOTAS =================================================//
function EliminarFila(index) {
    $("#fila" + index).remove();
}

//=========================================== BUSCAR TRABAJADORES POR NUMERO DE NOMINA =================================================//
function Nombres(e) {
    if (e.keyCode == 13) {
        $.ajax({
            url: '/Num_Nomina',
            success: function (empleados) {
                let Nomina = document.getElementById("Empleado").value;
                for (var i = 0; i < empleados.length; i++) {
                    if (Nomina == empleados[i].Nomina) {
                        document.getElementById("Nombre").value = empleados[i].Nombre;
                    }
                }
            } //Funcion success
        }); //Ajax 
        return false;
    }
}

//=========================================== EVENTO CLIC SOBRE BOTON EN FORMULARIO PARA CREAR LA NOTA DE SALIDA =================================================//
function CrearNota() {
    try {
        var FolioSalida = document.getElementById("FolioAnterior").value; //Obtiene el valor de Folio anterior que fue de salida
        var Folio = document.getElementById("Folio").value; //Obtiene el valor de Folio de retorno
        var Producto = document.getElementById("Producto").value; //Obtiene el valor de Producto
        var Cantidad = document.getElementById("cantidad").value; //Obtiene el valor de cantidad
        var Estado = document.getElementById("Estado").value; //Obtiene el valor de Estado
        var Empleado = document.getElementById("Nombre").value; //Obtiene el valor de Nombre
        var Comentario = document.getElementById("Comentario").value; //Obtiene el valor de Comentario
        var Arreglo = [Folio, Producto, Cantidad, Estado, Empleado, Maquina, Comentario,FolioSalida];
        var Condicion = true; //para campos vacios
        for (var a in Arreglo) { //recorrer arreglo en busca de campos vacios
            if (Arreglo[a].length == 0) {
                Condicion = false; //si algun campo esta vacio cambia a falso
            }
        }
        if (Condicion == true) { //si todos los campos estan llenos avanza
            var TablaAlmacen = document.getElementById('Almacen').getElementsByTagName('tbody')[0];
            // inserta una fila al final de la tabla
            var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
            let indice = (TablaAlmacen.rows.length + 1);
            newRow.setAttribute("id", "fila" + indice); //se asigna id al incrementar cada fila +1 para contar el encabezado
            for (var x = 0; x < Arreglo.length; x++) {
                // inserta una celda en el indice 0
                var newCell = newRow.insertCell(x);
                // adjuntar el texto al nodo
                var newText = document.createTextNode(Arreglo[x]);
                newCell.appendChild(newText);
                if (x == 7) { //Si termina de registrar datos crear el boton
                    var newCell = newRow.insertCell(8); //CREAR CELDA onclick="CrearNota()"
                    newCell.innerHTML = '<button id="' + x + '" class="btn btn-danger" name="btn" onclick="EliminarFila(' + indice + ')"> Eliminar </button>';
                }
            }
            //document.getElementById("RegistroSalida").reset();
            document.getElementById("Producto").value = "";
            document.getElementById("cantidad").value = "";
        }
    } catch (err) {
        console.log(err);
    }
}

//=========================================== FUNCIÓN PARA GENERAR FOLIO =================================================//
function Folios() {
    $.ajax({
        url: '/FolioRetorno',
        success: function (Folio) {
            var id = Folio[0].Total;
            var zerofilled = ('000000' + (id + 1)).slice(-5); //incrementa la cantidad de folio +1 y se ajusto con ceros a la izquierda
            document.getElementById("Folio").value = "GemR-" + zerofilled;
        } //Funcion success
    }); //Ajax 
}
//=========================================== ELIMINAR FILA DE REGISTRO EN NOTAS =================================================//
function EliminarFila(index) {
    $("#fila" + index).remove();
}

//=========================================== Guardar elementos de la nota =================================================//
function GuardarNota() {
    var tabla = document.getElementById("Almacen");
    var total = tabla.rows.length //Total de filas

    var Arreglo = [];

    for (var j = 1; j <= total - 1; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;

    
            var Folio = tabla.rows[j].cells[0].childNodes[0].nodeValue;
            var Producto = tabla.rows[j].cells[1].childNodes[0].nodeValue;
            var Cantidad = tabla.rows[j].cells[2].childNodes[0].nodeValue;
            var Estado = tabla.rows[j].cells[3].childNodes[0].nodeValue;
            var Empleado = tabla.rows[j].cells[4].childNodes[0].nodeValue;
            var Maquina = tabla.rows[j].cells[5].childNodes[0].nodeValue;
            var Comentario = tabla.rows[j].cells[6].childNodes[0].nodeValue;
            var FolioSalida = tabla.rows[j].cells[7].childNodes[0].nodeValue;
            var Tabla = [Folio,Producto,Cantidad,Estado,Empleado,Maquina,Comentario,FolioSalida]
    
            Arreglo.push(Tabla);
        
    } //fin filas

    $.post("/GuardarNotaRetorno", // url
            {
                Arreglo
            }, // data to be submit
            function (objeto, estatus) { // success callback
                //console.log("objeto: " + objeto + "Estatus: " + estatus);
            });

    //Limpiar tabla 
    var TablaAlmacen = document.getElementById('Almacen').getElementsByTagName('tbody')[0];
    var limite = TablaAlmacen.rows.length;
    for (var i = 0; i <= limite; i++) {
        $("#fila" + (i + 1)).remove(); //elimina los elementos con id Rows
    }

    document.getElementById("RegistroRetorno").reset();
}

//=========================================== Guardar producto a recolectar =================================================//

function Fecha(parametro) {
        var Fecha = new Date(parametro);
        var dd = Fecha.getDate();
        var mm = Fecha.getMonth() + 1;
        var yyyy = Fecha.getFullYear();
        var HH = Fecha.getHours();
        var mi = Fecha.getMinutes();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '/' + mm + '/' + yyyy;
        return today;
}
