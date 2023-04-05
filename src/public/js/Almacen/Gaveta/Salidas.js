//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
function GETPRODUCTS() {
    var Herramientas = Tranformer(document.getElementById("BHerramienta").value);
    $.ajax({
        url: '/BuscarHerramientas/' + Herramientas,
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
            }
            if (Herramientas.length == 0) {
                $("#Vacio").modal();
            }
            for (var i = 0; i < Herramientas.length; i++) {
                var Clave = Herramientas[i].Clave;
                var Producto = Herramientas[i].Producto;
                var Stock = Herramientas[i].Stock;
                var StockUsado = Herramientas[i].StockUsado;
                var Ubicacion = Herramientas[i].Ubicacion;
                //Eliminar variable dentro del For
                Arreglo = [Clave, Producto, Stock, StockUsado, Ubicacion]
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
} //Evento clic

//=========================================== EVENTO SOLO DATOS NUMERICOS EN CANTIDAD =================================================//
$(function () {
    $(".solo-numero").keydown(function (event) {
        //alert(event.keyCode);
        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105) && event.keyCode !== 190 && event.keyCode !== 110 && event.keyCode !== 8 && event.keyCode !== 9) {
            return false;
        }
    });
}); //Funcion JQuery

//=========================================== EVENTO CLIC SOBRE LA TABLA DE BUSQUEDA PARA SELECCIONAR HERRAMIENTA =================================================//
function Seleccion(variable) {
    Registro = document.getElementById("Herr_Encontradas");

    var Clave = Registro.rows[variable].cells[0].childNodes[0].nodeValue; //Obtiene el valor de Clave
    var Producto = Registro.rows[variable].cells[1].childNodes[0].nodeValue; //Obtiene el valor de Producto
    var Stock = Registro.rows[variable].cells[2].childNodes[0].nodeValue; //Obtiene el valor de Stock
    var StockUsado = Registro.rows[variable].cells[3].childNodes[0].nodeValue; //Obtiene el valor de StockUsado
    var Ubicacion = Registro.rows[variable].cells[4].childNodes[0].nodeValue; //Obtiene el valor de Ubicacion

    document.RegistroSalida.Sal_Herramienta.value = Producto;
    document.RegistroSalida.Sal_Ubicación.value = Ubicacion;
}

//=========================================== EVENTO CLIC SOBRE BOTON EN FORMULARIO PARA CREAR LA NOTA DE SALIDA =================================================//
function CrearNota() {
    let tabla = document.getElementById("Almacen");
    let total = tabla.rows.length //Total de filas
 
    if(total > 1){
        alert("No se permiten más articulos")
    }else{ 
        var Folio = document.getElementById("Folio").value; //Obtiene el valor de Clave
        var Producto = document.getElementById("Producto").value; //Obtiene el valor de Clave
        var Cantidad = document.getElementById("cantidad").value; //Obtiene el valor de Clave
        var Estatus = document.getElementById("Estatus").value; //Obtiene el valor de Clave
        var Estado = document.getElementById("Estado").value; //Obtiene el valor de Clave
        var Ubicacion = document.getElementById("Ubicacion").value; //Obtiene el valor de Clave
        var OT = document.getElementById("OT").value; //Obtiene el valor de Clave
        var Empleado = document.getElementById("Nombre").value; //Obtiene el valor de Clave
        var Maquina = document.getElementById("Maquina").value; //Obtiene el valor de Clave
        var Comentario = document.getElementById("Comentario").value; //Obtiene el valor de Clave
        var Parcial = document.getElementById("Parcial").value; //Obtiene el valor de Clave
        var Arreglo = [Folio, Producto, Cantidad, Estado, OT, Estatus, Maquina, Empleado, Parcial, Comentario];
    
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
                    newCell.innerHTML = '<button id="' + x + '" class="btn btn-danger" name="btn" onclick="EliminarFila(' + indice + ')"> <i class="far fa-minus-square"></i> </button>';
                }
            }
            //document.getElementById("RegistroSalida").reset();
            document.getElementById("Producto").value = "";
            document.getElementById("Ubicacion").value = "";
            document.getElementById("cantidad").value = "";
        }
    }
}

//=========================================== FUNCIÓN PARA GENERAR FOLIO =================================================//
function Folios() {
    $.ajax({
        url: '/Folio',
        success: function (Folio) {
            var id = Folio[0].Total;
            var zerofilled = ('000000' + (id + 1)).slice(-5); //incrementa la cantidad de folio +1 y se ajusto con ceros a la izquierda
            document.getElementById("Folio").value = "GemS-" + zerofilled;
        } //Funcion success
    }); //Ajax 
    //TablaRecoleccion();
    Familias();
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
                console.log(empleados)
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

//=========================================== BUSCAR MAQUINAS POR TIPO DE FAMILIA =================================================//
function Familias() {
    var listMaquina = document.getElementById("Familia");
    $.ajax({
        url: '/ListaFamilias/',
        success: function (maquinas) {
            console.log(maquinas)
            for (let i = listMaquina.options.length; i >= 1; i--) { //Borrar elementos option de select
                listMaquina.remove(i);
            }
            for (var i = 0; i < maquinas.length; i++) { //Agregar nuevos options del select

                var option = document.createElement("option");
                option.text = maquinas[i].Familia;
                listMaquina.add(option);
            }
        } //Funcion success
    }); //Ajax
}


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

//=========================================== Guardar elementos de la nota =================================================//
function GuardarNota() {
    var tabla = document.getElementById("Almacen");
    var total = tabla.rows.length //Total de filas

    var Arreglo = [];

    for (var j = 1; j <= total - 1; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
        var Folio = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Producto = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Entregado = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Estado = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Estatus = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Maquina = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Empleado = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Parcial = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Comentario = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var Tabla = [Folio, Producto, Entregado, Estado, OT, Estatus, Maquina, Empleado, Parcial, Comentario];
        Arreglo.push(Tabla);
    } //fin filas

    console.table(Arreglo);
    $.post("/GuardarNota", // url
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
    document.getElementById("RegistroSalida").reset();
}

//=========================================== PreAuditoria =================================================//
function PreAuditoria() {
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

//=========================================== Contador =================================================//

function animateValue(id, start, end, duration) {
    if (start === end) return;
    var range = end - start;
    var current = start;
    var increment = end > start ? 1 : +1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function () {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}


//=========================================== Mostrar Recolección =================================================//
function TablaRecoleccion() {
    $.ajax({
        url: '/MostrarRecoleccion/',
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var Tabla = document.getElementById('TablaRecoleccion').getElementsByTagName('tbody')[0];
            var limite = Tabla.rows.length;
            if (Herramientas.length > 0) { //Si existen elementos llamar a contador para incremento.
                animateValue("value", 0, Herramientas.length, 3000);
            }

            for (var i = 0; i < Herramientas.length; i++) {
                var ID = Herramientas[i].id;
                var Producto = Herramientas[i].Producto;
                var Cantidad = Herramientas[i].Cantidad;
                var Planta = Herramientas[i].Planta;
                //Eliminar variable dentro del For
                Arreglo = [ID, Producto, Cantidad, Planta];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + (i + 1)); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);

                    if (x == 3) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(4); //CREAR CELDA onclick="CrearNota()"
                        newCell.innerHTML = '<input  type="checkbox"  id="Check' + (i + 1) + '">';
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
}


//=========================================== Guardar producto a recolectar =================================================//
function Recolectar() {
    var tabla = document.getElementById("TablaRecoleccion");
    var total = tabla.rows.length //Total de filas
    var EliminarFila = [];
    var Tabla = [];
    for (var i = 1; i < total; i++) {
        var FilaCheck = document.getElementById("Check" + i);

        if (FilaCheck.checked == true) {

            var id = tabla.rows[i].cells[0].childNodes[0].nodeValue;
            var Producto = tabla.rows[i].cells[1].childNodes[0].nodeValue;
            var Cantidad = tabla.rows[i].cells[2].childNodes[0].nodeValue;
            var Fila = [id, Producto, Cantidad];
            Tabla.push(Fila);
            EliminarFila.push(i);
        }
    }

    $.post("/GuardarRecoleccion", // url
        {
            Tabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });

    for (var j = 0; j < EliminarFila.length; j++) {
        $("#Rows" + EliminarFila[j]).remove(); //elimina los elementos con id Rows
    }
    setTimeout("redireccionar()", 2000); //Tiempo para reedireccionar
}

function runScript(e) {
    if (e.keyCode == 13) {
        GETPRODUCTS();
    }
}

//=========================================== Fromato Fechas =================================================//

function Fecha() {
    var tabla = document.getElementById('Registros').getElementsByTagName('tbody')[0];
    var total = tabla.rows.length //Total de filasa
    for (var j = 0; j < total; j++) { //filas
        let Fecha = new Date(tabla.rows[j].cells[5].childNodes[0].nodeValue);
        console.log('Fecha tabla ' + Fecha);
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
        document.getElementById("Fecha" + j).innerHTML = today;
    } //fin filas    
}

//Intercambiar el diagonal por otro simbolo para no tener problemas con el url
function Tranformer(variable) {
    var Herramienta = "";
    for (var q = 0; q < variable.length; q++) {
        if (variable.charAt(q) == '/') {
            Herramienta += '|';
        } else {
            Herramienta += variable.charAt(q);
        }
    }
    return Herramienta;
}

//Cambia el estado de audotria del turno y reedirecciona a modulo de despacho
function redireccionar() {
    var pagina = "/wh_Salidas";
    location.href = pagina;
}