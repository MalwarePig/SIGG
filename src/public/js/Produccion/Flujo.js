//=========================================== VARIABLES GLABALES =================================================//
var ArrayPendintes = []; //Lista de OT leidas del excel y cargadas en pendientes para que supervisor les de entrada
//=========================================== Consulta lineas por area =================================================//

function Carga() {
    var Planta = document.getElementById("Planta").value;
    var ListArea = document.getElementById("ListArea").value;

    $.ajax({
        url: '/ConsultaFlujo/' + Planta + " " + ListArea,
        success: function (Lineas) {
            var Arreglo = [];
            //Limpiar tabla 
            var Tabla = document.getElementById('Tabla').getElementsByTagName('tbody')[0];
            var limite = Tabla.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#RowsFlujo" + i).remove(); //elimina los elementos con id Rows
            }
            if (Lineas.length == 0) {
                $("#Vacio").modal();
            }
            for (var i = 0; i < Lineas.length; i++) {
                var id = Lineas[i].id;
                var Inicio = Lineas[i].FechaInicio;
                var OT = Lineas[i].OT;
                var Maquina = Lineas[i].Maquina || 'N/A';
                var Cliente = Lineas[i].Cliente || 'N/A';
                var Parte = Lineas[i].Parte;
                var Servicio = Lineas[i].Servicio || 'N/A';
                var Planta = Lineas[i].Planta;
                var Origen = Lineas[i].Origen || 'N/A';
                var CantOt = Lineas[i].CantOt;
                var Recibido = Lineas[i].Recibido;
                var Extra = Lineas[i].Extra || 0;
                var Restante = (parseInt(Lineas[i].Recibido) + parseInt(Extra)) - parseInt(Lineas[i].Enviadas);
                var Enviadas = Lineas[i].Enviadas;
                var Stock = Lineas[i].Stock;
                var Vencimiento = Lineas[i].FechaVenc;
                //Eliminar variable dentro del For
                Arreglo = [id, Inicio, OT, Maquina, Cliente, Parte, Servicio, Planta, Origen, CantOt, Recibido, Extra, Restante, Enviadas, Stock, Vencimiento];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "RowsFlujo" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    newRow.setAttribute("onclick", "Mostrar(" + i + ")"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    if (x != 1 && x != 15) { //Omite el campo de fechas
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                    } else {
                        var newText = document.createTextNode(moment(Arreglo[x]).format('YYYY/MM/DD'));
                        newCell.appendChild(newText);
                    }
                } //fin de for de columnas
            } //fin de for de filas
            Contadores(Lineas);
        } //Funcion success
    }); //Ajax

    //Muestra la tabla inferior de lineas en espera
    $.ajax({
        url: '/ConsultaFlujoEspera/' + Planta + " " + ListArea,
        success: function (Lineas) {
            var Arreglo = [];
            //Limpiar tabla 
            var Tabla = document.getElementById('TablaEspera').getElementsByTagName('tbody')[0];
            var limite = Tabla.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#RowsEspera" + i).remove(); //elimina los elementos con id Rows
            }
            if (Lineas.length == 0) {
                $("#Vacio").modal();
            }
            for (var i = 0; i < Lineas.length; i++) {
                var id = Lineas[i].id;
                var Inicio = Lineas[i].FechaInicio;
                var OT = Lineas[i].OT;
                var Maquina = Lineas[i].Maquina || 'N/A';
                var Cliente = Lineas[i].Cliente || 'N/A';
                var Parte = Lineas[i].Parte;
                var Servicio = Lineas[i].Servicio || 'N/A';
                var Planta = Lineas[i].Planta;
                var Origen = Lineas[i].Origen || 'N/A';
                var CantOt = Lineas[i].CantOt;
                var Recibido = Lineas[i].Recibido;
                var Extra = Lineas[i].Extra || 0;
                var Restante = (parseInt(Lineas[i].Recibido) + parseInt(Extra)) - parseInt(Lineas[i].Enviadas);
                var Enviadas = Lineas[i].Enviadas;
                var Stock = Lineas[i].Stock;
                var Vencimiento = Lineas[i].FechaVenc;
                //Eliminar variable dentro del For
                Arreglo = [id, Inicio, OT, Maquina, Cliente, Parte, Servicio, Planta, Origen, CantOt, Recibido, Extra, Restante, Enviadas, Stock, Vencimiento];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "RowsEspera" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    if (x != 1 && x != 15) { //Omite el campo de fechas
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                    } else {
                        var newText = document.createTextNode(moment(Arreglo[x]).format('YYYY/MM/DD'));
                        newCell.appendChild(newText);
                    }
                } //fin de for de columnas
            } //fin de for de filas
            Contadores(Lineas);
        } //Funcion success
    }); //Ajax
} //Evento clic

//=========================================== Despliega la grafica por areas =================================================//
function Grafica(Ancho) {
    $.ajax({
        url: '/FechasFlujo/' + document.getElementById("R_OT").value,
        success: function (Lineas) {
            console.table(Lineas);
            google.charts.load('current', {
                'packages': ['gantt'],
                'language': 'es'
            });
            google.charts.setOnLoadCallback(drawChart);

            function toMilliseconds(dias) {
                return dias * 24 * 60 * 60 * 1000;
            }

            function drawChart() {
                //alert("si entro en dibujo")
                var otherData = new google.visualization.DataTable();
                otherData.addColumn('string', 'Task ID');
                otherData.addColumn('string', 'Task Name');
                otherData.addColumn('string', 'Resource');
                otherData.addColumn('date', 'Inicio');
                otherData.addColumn('date', 'Fin');
                otherData.addColumn('number', 'Duración');
                otherData.addColumn('number', 'Porcentaje de avance');
                otherData.addColumn('string', 'Dependencias');

                var P_Inicio = new Date(moment(Lineas.Pro_Inicio).format('YYYY/MM/DD'));
                var P_Fin = new Date(moment(Lineas.Pro_Venc).format('YYYY/MM/DD'));
                var C_Inicio = new Date(moment(Lineas.Cal_Inicio).format('YYYY/MM/DD'));
                var C_Fin = new Date(moment(Lineas.Cal_Venc).format('YYYY/MM/DD'));
                var A_Inicio = new Date(moment(Lineas.Aca_Inicio).format('YYYY/MM/DD'));
                var A_Fin = new Date(moment(Lineas.Aca_Venc).format('YYYY/MM/DD'));
                var T_Inicio = new Date(moment(Lineas.Trat_Inicio).format('YYYY/MM/DD'));
                var T_Fin = new Date(moment(Lineas.Tra_Venc).format('YYYY/MM/DD'));
                var E_Inicio = new Date(moment(Lineas.Emb_Inicio).format('YYYY/MM/DD'));
                var E_Fin = new Date(moment(Lineas.Emb_Venc).format('YYYY/MM/DD'));
                console.log("tratamientos " + Lineas.Trat_Inicio + " - " + Lineas.Tra_Venc);
                console.log("tratamientos " + moment(Lineas.Trat_Inicio).format('YYYY/MM/DD') + " - " + moment(Lineas.Tra_Venc).format('YYYY/MM/DD'));
                //[TareaOrigen,TareaDependiente,]
                otherData.addRows([
                    /* ['requerimientos','Requerimientos', '', null, null, toMilliseconds(1), 100, null],
                    ['compras','Compras', '', null, null, toMilliseconds(2), 50, 'requerimientos'],*/
                    ['produccion', 'Producción', '', P_Inicio, P_Fin, null, 90, null],
                    ['acabados', 'Acabados', '', A_Inicio, A_Fin, null, 20, 'produccion'],
                    ['calidad', 'Calidad', '', C_Inicio, C_Fin, null, 10, 'acabados'],
                    ['tratamientos', 'Tratamientos', '', T_Inicio, T_Fin, null, 0, 'calidad'],
                    ['embarques', 'Embarques', 'tratamientos', E_Inicio, E_Fin, null, 0, 'tratamientos'],
                ]);
                //var size = window.innerWidth;
                var options = {
                    height: 335, //valor de alto
                    width: Ancho,
                    gantt: {
                        defaultStartDateMillis: new Date(2015, 3, 28)
                    }
                };
                var chart = new google.visualization.Gantt(document.getElementById('GraficaGant'));
                chart.draw(otherData, options);
            }
        } //Funcion success
    }); //Ajax
}

//=========================================== Evento clic para desplegar modal =================================================//
function Mostrar(indice) {
    var tabla = document.getElementById("Tabla");
    //document.ready = document.getElementById("R_Planta").value = tabla.rows[(indice + 1)].cells[6].childNodes[0].nodeValue;
    //document.ready = document.getElementById("R_Area").value = tabla.rows[(indice + 1)].cells[5].childNodes[0].nodeValue;
    localStorage.removeItem('R_id'); // Elimina el elemento de memoria 
    localStorage.setItem('R_id', tabla.rows[(indice + 1)].cells[0].childNodes[0].nodeValue);

    document.getElementById("R_OT").value = tabla.rows[(indice + 1)].cells[2].childNodes[0].nodeValue;
    document.getElementById("R_Parte").value = tabla.rows[(indice + 1)].cells[5].childNodes[0].nodeValue;
    document.getElementById("R_Cantidad").value = tabla.rows[(indice + 1)].cells[9].childNodes[0].nodeValue;
    document.getElementById("R_CantidadTotal").value = tabla.rows[(indice + 1)].cells[12].childNodes[0].nodeValue;
    document.getElementById("R_Maquina").value = tabla.rows[(indice + 1)].cells[3].childNodes[0].nodeValue;
    //document.getElementById("R_Area").value = tabla.rows[(indice+1)].cells[5].childNodes[0].nodeValue;
    var fecha = moment(tabla.rows[(indice + 1)].cells[1].childNodes[0].nodeValue).format('YYYY-MM-DD');
    document.getElementById("R_Inicio").value = fecha;
    var fecha = moment(tabla.rows[(indice + 1)].cells[15].childNodes[0].nodeValue).format('YYYY-MM-DD');
    document.getElementById("R_Fin").value = fecha;
    document.getElementById("R_Recibido").value = tabla.rows[(indice + 1)].cells[10].childNodes[0].nodeValue
    document.getElementById("R_Extra").value = tabla.rows[(indice + 1)].cells[11].childNodes[0].nodeValue

    $("#exampleModalPreview").modal();
    setTimeout(function () {
        var widthModal = document.getElementById("GraficaGant");
        var Ancho = widthModal.clientWidth;
        Grafica(Ancho);
    }, 500);
    let Area = localStorage.getItem('Area');
    //Agrear solo lectura cuando no es area de produccion
    if (Area != 'Producción') {
        $("#R_Recibido").attr("readonly", "readonly");
        $("#R_Extra").attr("readonly", "readonly");
    }


}

/*Eliminar nodo seleccionado
var parrafo = document.getElementById("provisional");
parrafo.parentNode.removeChild(parrafo);*/

//=========================================== elimina el nodo de la grafica =================================================//
function Eliminar() {
    var puntero = document.getElementById("GraficaGant");
    //puntero.removeChild(puntero.childNodes[0]);
}

//=========================================== Contadores de activas y vencidas =================================================//
function Contadores(Lineas) {
    var Total = Lineas.length;
    var Hoy = new Date(moment().format('YYYY/MM/DD'));
    var Activas = 0;
    var Vencidas = 0;

    if (Total > 0) {
        for (let index = 0; index < Total; index++) {
            var FechaVencimiento = new Date(moment(Lineas[index].FechaVenc).format('YYYY/MM/DD'));
            var diferencia = Math.floor((Hoy - FechaVencimiento) / (1000 * 60 * 60 * 24));

            if (Hoy > FechaVencimiento) {
                Vencidas++;
                document.getElementById("RowsFlujo" + index).style.backgroundColor = " #ffd2d2 "; //Rojo
            } else if (diferencia == 4) {
                document.getElementById("RowsFlujo" + index).style.backgroundColor = " #feffd5 "; //Amarillo
            } else {
                document.getElementById("RowsFlujo" + index).style.backgroundColor = " #e2fce9 "; //Verde
            }
        }
    }

    Activas = Total - Vencidas;
    document.getElementById("Activas").value = "Activas: " + Activas;
    document.getElementById("Vencidas").value = "Vencidas: " + Vencidas;
}

//=========================================== Formato tabla con filtros =================================================//

function FormatoTabla() {
    $('#Tabla').DataTable({
        language: {
            processing: "Tratamiento en curso...",
            search: "Buscar&nbsp;:",
            lengthMenu: "Agrupar de _MENU_ items",
            info: "Mostrando del item _START_ al _END_ de un total de _TOTAL_ items",
            infoEmpty: "No existen datos.",
            infoFiltered: "(filtrado de _MAX_ elementos en total)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron datos con tu busqueda",
            emptyTable: "No hay datos disponibles en la tabla.",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Ultimo"
            },
            aria: {
                sortAscending: ": active para ordenar la columna en orden ascendente",
                sortDescending: ": active para ordenar la columna en orden descendente"
            }
        },
        scrollY: 500,
        lengthMenu: [
            [10, 25, -1],
            [10, 25, "All"]
        ],
    });
}

//=========================================== Alimenta el excel al sistema =================================================//

function Alimentar() {
    modalesspiner();
    $.ajax({
        url: '/AlimentarFlujo',
        success: function (Lineas) {

        } //Funcion success
    }); //Ajax
}
//=========================================== Consulta OT Pendientes de inicar =================================================//

function Pendientes() {
    $.ajax({
        url: '/Pen_FlujoProd',
        success: function (Lineas) {
            if (Lineas.length > 0) { //Si existen elementos llamar a contador para incremento.
                animateValue("value", 0, Lineas.length, 4000);
            }

            var Tabla = document.getElementById('TablaRecoleccionAreas').getElementsByTagName('tbody')[0];
            var limite = Tabla.rows.length;
            for (let index = 0; index < limite; index++) {
                const element = array[index];
                $("#RowsF" + index).remove(); //elimina los elementos con id Rows
            }
            var LocalArea = localStorage.getItem('Area');
            if (LocalArea != 'Producción') { //Si el area es diferente de produccion alimentar tabla de pendientes
                for (var i = 0; i < Lineas.length; i++) {
                    var ID = Lineas[i].id;
                    var OT = Lineas[i].OT;
                    var Parte = Lineas[i].Parte;
                    var CantOt = Lineas[i].CantOt;
                    var Recibido = Lineas[i].Recibido;
                    //Eliminar variable dentro del For
                    Arreglo = [ID, OT, Parte, CantOt, Recibido];
                    ArrayPendintes.push(Arreglo);

                    // inserta una fila al final de la tabla
                    var newRow = Tabla.insertRow(Tabla.rows.length);
                    for (var x = 0; x < Arreglo.length; x++) {
                        // inserta una celda en el indice 0
                        var newCell = newRow.insertCell(x);
                        newRow.setAttribute("id", "RowsF" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                        if (x == 3) { //Si termina de registrar datos crear el boton
                            var newCell = newRow.insertCell(4); //CREAR CELDA onclick="CrearNota()"
                            newCell.innerHTML = '<input  type="checkbox"  id="CheckPendienteAreas' + i + '">';
                        }
                    } //fin de for de columnas
                } //fin de for de filas
            } else {
                for (var i = 0; i < Lineas.length; i++) {
                    101094
                    var ID = Lineas[i].id;
                    var OT = Lineas[i].OT;
                    var Maquina = Lineas[i].Maquina;
                    var Parte = Lineas[i].Parte;
                    var CantOt = Lineas[i].CantOt;

                    //Eliminar variable dentro del For
                    Arreglo = [ID, OT, Maquina, Parte, CantOt];
                    ArrayPendintes.push(Arreglo);
                }
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

//=========================================== Asignar fecha de inicio de operaciones =================================================//
function Recolectar() {
    var LocalArea = localStorage.getItem('Area');
    if (LocalArea != 'Producción') { //Si el area es diferente de produccion alimentar tabla de pendientes{
        var tabla = document.getElementById("TablaRecoleccionAreas").getElementsByTagName('tbody')[0];
        var total = tabla.rows.length //Total de filas
        var EliminarFila = [];
        var Tabla = [];
        for (var i = 0; i < total; i++) {
            var FilaCheck = document.getElementById("CheckPendienteAreas" + i);

            if (FilaCheck.checked == true) {
                var id = tabla.rows[i].cells[0].childNodes[0].nodeValue;
                var Producto = tabla.rows[i].cells[1].childNodes[0].nodeValue;
                var Cantidad = tabla.rows[i].cells[2].childNodes[0].nodeValue;
                var Fila = [id, Producto, Cantidad];
                Tabla.push(Fila);
                EliminarFila.push(i);
            }
        }
        console.table(Tabla);
        $.post("/IniciarProdFlujo", // inicia la lista de ot en el flujo de produccion
            {
                Tabla
            }, // data to be submit
            function (objeto, estatus) { // success callback
                //console.log("objeto: " + objeto + "Estatus: " + estatus);
            });

        document.getElementById("OTBuscar").value = "";

        for (var j = 0; j < EliminarFila.length; j++) {
            $("#RowsF" + EliminarFila[j]).remove(); //elimina los elementos con id Rows
        }
    } else { //Recoleccion para el area de Produccion solamente
        var tabla = document.getElementById("TablaRecoleccion");
        var total = tabla.rows.length //Total de filas
        var EliminarFila = [];
        var Tabla = [];
        for (var i = 1; i < total; i++) {
            var FilaCheck = document.getElementById("CheckPendiente");

            if (FilaCheck.checked == true) {
                var id = tabla.rows[i].cells[0].childNodes[0].nodeValue;
                var Producto = tabla.rows[i].cells[1].childNodes[0].nodeValue;
                var Cantidad = tabla.rows[i].cells[2].childNodes[0].nodeValue;
                var Inicial = document.getElementById("Inicial").value;
                var Extra = document.getElementById("Extra").value;
                var Fila = [id, Producto, Inicial, Extra];
                Tabla.push(Fila);
                EliminarFila.push(i);
            }
        }

        console.table(Tabla);
        $.post("/IniciarProdFlujo", // inicia la lista de ot en el flujo de produccion
            {
                Tabla
            }, // data to be submit
            function (objeto, estatus) { // success callback
                //console.log("objeto: " + objeto + "Estatus: " + estatus);
            });
        document.getElementById("OTBuscar").value = "";
        $("#RowsF").remove(); //elimina los elementos con id Rows
        // setTimeout("redireccionar()",10000); //Tiempo para reedireccionar
    } //Fin de else
}


//=========================================== Recarga la pagina =================================================//
function redireccionar() {
    var pagina = "/Flujo";
    location.href = pagina;
}

//=========================================== Transferir a otra area =================================================//
function Transferir() {
    var cantidadDestino = parseInt(document.getElementById("CantidadDestino").value); //Cantidad a transferir a otra area
    var CantidadTotal = parseInt(document.getElementById("R_CantidadTotal").value); //Cantidad Total de OT + Extras
    var cantidadOT = parseInt(document.getElementById("R_Cantidad").value); //Cantidad de orden de Trabajo
    var AreaDestino = document.getElementById("AreaDestino").value;

    let Area = localStorage.getItem('Area');
    switch (Area) {
        case "Producción":
            Area = "controlplaner";
            break;
        case "Acabados":
            Area = "areaacabados";
            break;
        case "Tratamientos":
            Area = "areatratamientos";
            break;
        case "Calidad":
            Area = "areacalidad";
            break;
        case "Embarques":
            Area = "areaembarques";
            break;
        default:
            Area = "";
            break;
    }

    if (Area == AreaDestino) { //Evita transferir en su propia Area
        alert("Error, elige un area diferente");
    } else {
        var caso = "";
        if (cantidadDestino > cantidadOT) {
            caso = "Extra";
        } else if (cantidadDestino <= 0) {
            alert("Cantidad no valida, cantidadDestino: " + cantidadDestino + " cantidadActual: " + cantidadActual);
        } else if (cantidadDestino < cantidadOT) {
            caso = "Parcial";
        } else {
            caso = "Cerrado";
        }

        var Linea = {
            id: localStorage.getItem('R_id'),
            OT: document.getElementById("R_OT").value,
            Parte: document.getElementById("R_Parte").value,
            CantidadOT: cantidadOT,
            cantidadDestino: cantidadDestino,
            CantidadTotal: CantidadTotal,
            Inicio: document.getElementById("R_Inicio").value,
            Fin: document.getElementById("R_Fin").value,
            AreaDestino: document.getElementById("AreaDestino").value,
            Caso: caso
        }

        document.getElementById("CantidadDestino").value = "0";
        $("#ModalTransferenciaLista").modal();
        setTimeout(function () {
            $('#ModalTransferenciaLista').modal('toggle');
        }, 2000);

        $.post("/TransFlujo", // inicia la lista de ot en el flujo de produccion
            {
                Linea
            }, // data to be submit
            function (objeto, estatus) { // success callback
                //console.log("objeto: " + objeto + "Estatus: " + estatus);
            });
    }
}

//=========================================== Modal con spíner =================================================//

function modalesspiner() {
    $("#ModalPantallaCarga").modal();

    setTimeout(function () {
        $('#ModalPantallaCarga').modal('toggle');
        setTimeout(function () {
            Pendientes();
        }, 7000);
    }, 15000);
}

function ServicioExterno() {
    var cantidadDestino = parseInt(document.getElementById("CantidadTrat").value); //Cantidad a transferir a otra area
    var CantidadTotal = parseInt(document.getElementById("R_CantidadTotal").value); //Cantidad Total de OT + Extras
    var cantidadOT = parseInt(document.getElementById("R_Cantidad").value); //Cantidad de orden de Trabajo

    var Proceso = document.getElementById("Servicios").value;
    var Proveedor = document.getElementById("Proveedores").value;
    let Retrabajo = $('input[name="Retrabajo"]:checked').val();

    if (Retrabajo != 'true') {
        Retrabajo = "false";
    }

    //id - OT - Parte - cantidadDestino - cantidadActual - Inicio - Fin - Proceso - Proveedor - Retrabajo                           
    //Pendiente...hacer la transferencia a post al area de tratamientos BD lista
    var Linea = {
        id: localStorage.getItem('R_id'),
        OT: document.getElementById("R_OT").value,
        Parte: document.getElementById("R_Parte").value,
        cantidadDestino: cantidadDestino,
        cantidadActual: CantidadTotal,
        cantidadOT: cantidadOT,
        Servicio: Proceso,
        Proveedor: Proveedor,
        Retrabajo: Retrabajo
    }
    console.table(Linea);

    $.post("/MandarTrat", // inicia la lista de ot en el flujo de produccion
        {
            Linea
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });
}

function CargaOTPendiente() {
    var OTBuscar = document.getElementById("OTBuscar").value;
    var LimiteFilas = ArrayPendintes.length;
    var LimiteColumnas = ArrayPendintes[0].length;

    $("#RowsF").remove(); //elimina los elementos con id Rows
    for (let index = 0; index < LimiteFilas; index++) {
        if (OTBuscar == ArrayPendintes[index][1]) {
            var Tabla = document.getElementById('TablaRecoleccion').getElementsByTagName('tbody')[0];
            // inserta una fila al final de la tabla
            var newRow = Tabla.insertRow(Tabla.rows.length);
            for (var x = 0; x < LimiteColumnas; x++) {
                // inserta una celda en el indice 0
                var newCell = newRow.insertCell(x);
                newRow.setAttribute("id", "RowsF"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                // adjuntar el texto al nodo
                var newText = document.createTextNode(ArrayPendintes[index][x]);
                newCell.appendChild(newText);
                if (x == 4) {
                    var newCell = newRow.insertCell(5); //CREAR CELDA onclick="CrearNota()"
                    newCell.innerHTML = '<input required type="text" id="Inicial" class="form-control" value="' + 0 + '" ></input>';
                }
                if (x == 4) {
                    var newCell = newRow.insertCell(6); //CREAR CELDA onclick="CrearNota()"
                    newCell.innerHTML = '<input required type="text" id="Extra" class="form-control" value="' + 0 + '" ></input>';
                }
                if (x == 4) { //Si termina de registrar datos crear el boton
                    var newCell = newRow.insertCell(7); //CREAR CELDA onclick="CrearNota()"
                    newCell.innerHTML = '<input  type="checkbox"  id="CheckPendiente">';
                }
            } //fin de for de columnas
        } //if
    } //for
}

function ModalesPendiente() {
    var LocalArea = localStorage.getItem('Area');
    if (LocalArea == 'Producción') {
        $("#ModalRecoleccion").modal();
    } else {
        $("#ModalRecoleccionAreas").modal();
    }
}


function GuardarCambios() {
    var CantRecibida = document.getElementById("R_Recibido").value;
    var CantExtra = document.getElementById("R_Extra").value;

    var Tabla = {
        id: localStorage.getItem('R_id'),
        CantRecibida: CantRecibida,
        CantExtra: CantExtra
    }

    $("#ModalCambiosAplicados").modal();
    console.log(Tabla);
    $.post("/SaveCantFlujo", // Guarda los cambios en las cantidades del flujo
        {
            Tabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });
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

//=========================================== Ventana Tratamientos Externos =================================================//
function TrataExternos() {
    $("#ModalTratExternos").modal();
    $.ajax({
        url: '/EnTratamientos/',
        success: function (Lineas) {
            var Arreglo = [];
            //Limpiar tabla 
            var Tabla = document.getElementById('TablaTratamientos').getElementsByTagName('tbody')[0];
            var limite = Tabla.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#RowsTratamiento" + i).remove(); //elimina los elementos con id Rows
            }

            for (var i = 0; i < Lineas.length; i++) {
                var id = Lineas[i].id;
                var OT = Lineas[i].OT;
                var Parte = Lineas[i].Parte;
                var CantOt = Lineas[i].CantOt;
                var Servicio = Lineas[i].Servicio || 'N/A';
                var Proveedor = Lineas[i].Proveedor;
                var Recibidas = Lineas[i].Recibidas;
                var Terminadas = Lineas[i].Terminadas;
                var Reetrabajo = Lineas[i].Reetrabajo || 'N/A';
                var FechaRegistro = Lineas[i].FechaRegistro;
                //Eliminar variable dentro del For
                Arreglo = [id, OT, Parte, CantOt, Servicio, Proveedor, Recibidas, Terminadas, Reetrabajo, FechaRegistro];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "RowsTratamiento" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado

                    if (x == 9) {
                        var newText = document.createTextNode(moment(Arreglo[x]).format('YYYY/MM/DD'));
                        newCell.appendChild(newText);

                    }
                    if (x == 9) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(10); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=ModalFinalizarTrat(' + (i + 1) + ')> - </button>';
                    } else {
                        if (Arreglo[x].toString().length >= 12) {
                            alert("Texto: " + Arreglo[x] + " Tamaño: " + Arreglo[x].toString().length)
                            // adjuntar el texto al nodo
                            var newText = document.createTextNode(Arreglo[x].slice(0,13)+"..");
                            newCell.appendChild(newText);
                            //Agregar elementos tooltip
                            newCell.setAttribute('data-toggle', 'tooltip');
                            newCell.setAttribute('data-placement', 'top');
                            newCell.setAttribute('title', Arreglo[x]);
                        } else {
                            // adjuntar el texto al nodo
                            var newText = document.createTextNode(Arreglo[x]);
                            newCell.appendChild(newText);
                        }
                    }
                } //fin de for de columnas
            } //fin de for de filas0
        } //Funcion success
    }); //Ajax
}

function ModalFinalizarTrat(indice) {
    $("#CantidadTerminada").modal();
    localStorage.setItem('idRetorno', indice);
}

function FinalizarTrat() {
    let idRetorno = localStorage.getItem('idRetorno');
    localStorage.removeItem('idRetorno'); // Elimina el elemento de memoria 
    let CantRetorno = document.getElementById("T_Cantidad").value;

    let Tabla = {
        id: idRetorno,
        CantRetorno: CantRetorno
    }

    $("#ModalCambiosAplicados").modal();
    console.log(Tabla);
    $.post("/FinalizarTrat", // Guarda los cambios en las cantidades del flujo
        {
            Tabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });
}