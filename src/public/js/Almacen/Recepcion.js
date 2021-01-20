function GuardarRecepcion() { //Ejecutar codigo al dar click en boton
    var i = 0; //Contador para brincar la cabaezera y suar la referencia de indice
    var Arreglo = [];
    $('#wrapper tr').each(function () { //leer una tabla html    
        if (i > 0) { //Iniciar despues de cabezera de tabla y OT sea diferente de Null
            var Producto = $(this).find("td").eq(4).html();
            var Ordenado = 0; //LEER LA TABLA
            var Entregado = $(this).find("td").eq(5).html();
            var Tabla = [Producto, Ordenado, Entregado];

            Arreglo.push(Tabla);
        }
        i++;
    }); //each para recorrer tabla

    $.post("/PostRecepcion", // url
        {
            Arreglo
        }, // data to be submit
        function (Tablas, status) { // success callback
            console.log(Tablas + status);
        })
    alert("Recepción exitosa");
    setTimeout("redireccionar()", 800); //Tiempo para reedireccionar

    /*var elemento = document.getElementById("wrapper");
    document.body.removeChild(elemento);
    alert("Registrado en BD");*/
}

//=========================================== CONSULTAR HERRAMIENTAS -- BOTON BUSCAR =================================================//
function ConsultaRecepcion() {
    // GET PRODUCTS
    $.ajax({
        url: '/ConsultaRecepcion/',
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
            }
            for (var i = 0; i < Herramientas.length; i++) {
                var indice = Herramientas[i].id;
                var Producto = Herramientas[i].Producto;
                var Entregado = Herramientas[i].Entregado;
                var Estatus = Herramientas[i].Estatus;
                //Eliminar variable dentro del For
                Arreglo = [indice, Producto, Entregado, Estatus]
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"+i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);

                    if (x == 3) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(4); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (i + 1) + ')> Selección </button>';
                        var newCell = newRow.insertCell(5); //CREAR CELDA
                        newCell.innerHTML = '<button id="Eliminar' + i + '" class="btn btn-danger" name="btn" onclick= Eliminar(' + Arreglo[0] +","+i+ ')>  </button>';
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
}

//=========================================== EVENTO CLIC SOBRE LA TABLA DE BUSQUEDA PARA SELECCIONAR HERRAMIENTA =================================================//
function Seleccion(variable) {
    Registro = document.getElementById("Herr_Encontradas");

    var id = Registro.rows[variable].cells[0].childNodes[0].nodeValue; //Obtiene el valor de Clave
    var Herramienta = Registro.rows[variable].cells[1].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("Rows"+(variable-1)).style.backgroundColor = " #e2fce9 "; //Verde

    document.RegistroSalida.id.value = id;
    document.RegistroSalida.Herramienta.value = Herramienta;
}

//=========================================== EVENTO CLIC SOBRE BOTON EN FORMULARIO PARA CREAR LA NOTA DE SALIDA =================================================//
function CrearNota() {
    var id = document.getElementById("id").value; //Obtiene el valor de Clave
    var Producto = document.getElementById("Herramienta").value; //Obtiene el valor de Clave
    var Cantidad = document.getElementById("Cantidad").value; //Obtiene el valor de Clave
    var Estatus = document.getElementById("Planta").value; //Obtiene el valor de Clave
    if (Cantidad == null || Cantidad <= 0) {
        alert("Cantidad incorrecta");
    } else {
        var Arreglo = [id, Producto, Cantidad, Estatus];

        var Condicion = true; //para campos vacios
        for (var a in Arreglo) { //recorrer arreglo en busca de campos vacios
            if (Arreglo[a].length == 0) {
                Condicion = false; //si algun campo esta vacio cambia a falso
            }
        }
        if (Condicion == true) { //si todos los campos estan llenos avanza
            var TablaAlmacen = document.getElementById('TablaAsignacion').getElementsByTagName('tbody')[0];
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
                if (x == 3) { //Si termina de registrar datos crear el boton
                    var newCell = newRow.insertCell(4); //CREAR CELDA onclick="CrearNota()"
                    newCell.innerHTML = '<button id="' + x + '" class="btn btn-danger" name="btn" onclick="EliminarFila(' + indice + ')"> Eliminar </button>';
                }
            }

            //document.getElementById("RegistroSalida").reset();
            document.getElementById("Herramienta").value = "";
            document.getElementById("id").value = "";
            document.getElementById("Cantidad").value = "";
        }
    }
}

//=========================================== EVENTO SOLO DATOS NUMERICOS EN CANTIDAD =================================================//
$(function () {
    $(".solo-numero").keydown(function (event) {
        //alert(event.keyCode);
        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105) && event.keyCode !== 190 && event.keyCode !== 110 && event.keyCode !== 8 && event.keyCode !== 9) {
            return false;
        }
    });
}); //Funcion JQuery

//=========================================== ELIMINAR FILA DE REGISTRO EN NOTAS =================================================//
function EliminarFila(index) {
    $("#fila" + index).remove();
}
//=========================================== Guardar elementos asignados =================================================//
function GuardarNota() {
    var tabla = document.getElementById("TablaAsignacion");
    var total = tabla.rows.length //Total de filas
    var Arreglo = [];
    for (var j = 1; j <= total - 1; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;

        var id = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Item = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Cantidad = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Planta = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var Tabla = [id, Item, Cantidad, Planta, Tabla];
        Arreglo.push(Tabla);
    } //fin filas

    console.table({
        Arreglo
    });
    $.post("/Asignar", // url
        {
            Arreglo
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });

    //Limpiar tabla 
    var TablaAlmacen = document.getElementById('TablaAsignacion').getElementsByTagName('tbody')[0];
    var limite = TablaAlmacen.rows.length;
    for (var i = 0; i <= limite; i++) {
        $("#fila" + (i + 1)).remove(); //elimina los elementos con id Rows
    }

    document.getElementById("RegistroSalida").reset();
    setTimeout("redireccionar()", 1000); //Tiempo para reedireccionar
}

//Cambia el estado de audotria del turno y reedirecciona a modulo de despacho
function redireccionar() {
    location.reload();
}

//=========================================== CONSULTAR HERRAMIENTAS Flotante =================================================//
function ConsultaFlotante() {
    // GET PRODUCTS
    $.ajax({
        url: '/ConsultaFlotante/',
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var PlantaBravo = document.getElementById('PlantaBravo').getElementsByTagName('tbody')[0];
            var PlantaMorelos = document.getElementById('PlantaMorelos').getElementsByTagName('tbody')[0];
            var limiteMorelos = PlantaMorelos.rows.length;
            var limiteBravo = PlantaBravo.rows.length;
            for (var i = 0; i < limiteMorelos; i++) {
                $("#RowsM" + i).remove(); //elimina los elementos con id Rows
            }
            for (var i = 0; i < limiteBravo; i++) {
                $("#RowsB" + i).remove(); //elimina los elementos con id Rows
            }
            for (var i = 0; i < Herramientas.length; i++) {
                var Id = Herramientas[i].id;
                var Producto = Herramientas[i].Producto;
                var Cantidad = Herramientas[i].Cantidad;
                var Planta = Herramientas[i].Planta;
                //Eliminar variable dentro del For
                Arreglo = [Id,Producto, Cantidad, Planta];
                if (Planta == 'Almacen Bravo') { //Si es planta Bravo
                    // inserta una fila al final de la tabla
                    var newRow = PlantaBravo.insertRow(PlantaBravo.rows.length);
                    for (var x = 0; x < Arreglo.length; x++) {
                        // inserta una celda en el indice 0
                        var newCell = newRow.insertCell(x);
                        newRow.setAttribute("id", "RowsB" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                        if (x == 3) { //Si termina de registrar datos crear el boton
                            var newCell = newRow.insertCell(4); //CREAR CELDA
                            newCell.innerHTML = '<button id="' + i + '" class="btn btn-danger" name="btn" onclick=Cancelar(' + Arreglo[0] +","+"RowsB" + i +')></button>';
                        }
                    } //fin de for de columnas
                } else { //Si es Morelos
                    // inserta una fila al final de la tabla
                    var newRow = PlantaMorelos.insertRow(PlantaMorelos.rows.length);
                    for (var x = 0; x < Arreglo.length; x++) {
                        // inserta una celda en el indice 0
                        var newCell = newRow.insertCell(x);
                        newRow.setAttribute("id", "RowsM" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                        if (x == 3) { //Si termina de registrar datos crear el boton
                            var newCell = newRow.insertCell(4); //CREAR CELDA
                            newCell.innerHTML = '<button id="' + i + '" class="btn btn-danger" name="btn" onclick=Cancelar(' + Arreglo[0] +","+"RowsM" + i+')></button>';
                        }
                    } //fin de for de columnas
                }
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
}

//Cambia el estado de audotria del turno y reedirecciona a modulo de despacho
function redireccionar() {
    location.reload();
}

function FormatoExcel() {
    var Proveedor = "Proveedor";
    var OT = "OT";
    var Orden = "Orden";
    var Lin = "Lin";
    var Producto = "Producto";
    var Cantidad = "Cantidad";
    var Mon = "Mon";
    var Factura = "Factura";
    var Planta = "Planta";
    var sheet_1_data = [{Proveedor:'efipack',OT:'1083463',Orden:'GM44185',Lin:'1',Producto:'Producto_ Prueba',Cantidad:'20',Mon:'M.N',Factura:'8337',Planta:'Morelos'}];

    var opts = [{
        sheetid: 'Hoja1',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("Formato_Carga.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}

//Cancelar asignación
function Cancelar(id,fila){
    $.ajax({
        url: '/CancelarFlotante/'+id,
        success: function (Resultado) {
            console.log(Resultado, fila);
            $(fila).remove();
        } //Funcion success
    }); //Ajax
}

//Eliminar de recepción asignación
function Eliminar(id,fila){
    alert(id);
    $.ajax({
        url: '/EliminarRecepcion/'+id,
        success: function (Resultado) {
            $("#Rows" + fila).remove();
        } //Funcion success
    }); //Ajax
}

 







