//=========================================== Consulta lineas por area =================================================//

function Carga() {
    var Planta = document.getElementById("Planta").value;
    var Area = document.getElementById("Area").value;
    /*switch(Area){
        case "Produccion": Area =  "controlplaner";
        break;
        case "Acabados": Area = "areaacabados";
        break;
        case "Tratamientos": Area = "areatratamientos";
        break;
        case "Calidad": Area = "areacalidad";
        break;
        case "Embarques": Area = "areaembarques";
        break;
        default: Area = "";
        break;
    }*/
    $.ajax({
        url: '/ConsultaFlujo/' + Planta + " " + Area,
        success: function (Lineas) {
            var Arreglo = [];
            //Limpiar tabla 
            var Tabla = document.getElementById('Tabla').getElementsByTagName('tbody')[0];
            var limite = Tabla.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows" + i).remove(); //elimina los elementos con id Rows
            }
            if (Lineas.length == 0) {
                $("#Vacio").modal();
            }
            for (var i = 0; i < Lineas.length; i++) {
                var id = Lineas[i].id;
                var Inicio = Lineas[i].FechaInicio;
                var OT = Lineas[i].OT;
                var Cliente = Lineas[i].Cliente || 'N/A';
                var Parte = Lineas[i].Parte;
                var Servicio = Lineas[i].Servicio || 'N/A';
                var Planta = Lineas[i].Planta;
                var Origen = Lineas[i].Origen || 'N/A';
                var CantOt = Lineas[i].CantOt;
                var Terminadas = Lineas[i].Terminadas;
                var Enviadas = Lineas[i].Enviadas;
                var Stock = Lineas[i].Stock;
                var Vencimiento = Lineas[i].FechaVenc;
                //Eliminar variable dentro del For
                Arreglo = [id, Inicio, OT, Cliente, Parte, Servicio, Planta, Origen, CantOt, Terminadas, Enviadas, Stock, Vencimiento];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    newRow.setAttribute("onclick", "Mostrar(" + i + ")"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    if (x != 1 && x != 12) { //Omite el campo de fechas
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
                alert("si entro en dibujo")
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
    document.ready = document.getElementById("R_Planta").value = tabla.rows[(indice + 1)].cells[6].childNodes[0].nodeValue;
    //document.ready = document.getElementById("R_Area").value = tabla.rows[(indice + 1)].cells[5].childNodes[0].nodeValue;
    document.getElementById("R_id").value = tabla.rows[(indice + 1)].cells[0].childNodes[0].nodeValue;
    document.getElementById("R_OT").value = tabla.rows[(indice + 1)].cells[2].childNodes[0].nodeValue;
    document.getElementById("R_Parte").value = tabla.rows[(indice + 1)].cells[4].childNodes[0].nodeValue;
    document.getElementById("R_Cantidad").value = tabla.rows[(indice + 1)].cells[8].childNodes[0].nodeValue;
    //document.getElementById("R_Planta").value = tabla.rows[(indice+1)].cells[4].childNodes[0].nodeValue;
    //document.getElementById("R_Area").value = tabla.rows[(indice+1)].cells[5].childNodes[0].nodeValue;
    var fecha = moment(tabla.rows[(indice + 1)].cells[1].childNodes[0].nodeValue).format('YYYY-MM-DD');
    document.getElementById("R_Inicio").value = fecha;
    var fecha = moment(tabla.rows[(indice + 1)].cells[12].childNodes[0].nodeValue).format('YYYY-MM-DD');
    document.getElementById("R_Fin").value = fecha;

    $("#exampleModalPreview").modal();
    setTimeout(function () {
        var widthModal = document.getElementById("GraficaGant");
        var Ancho = widthModal.clientWidth;
        Grafica(Ancho);
    }, 500);

    /*$.ajax({
        url: '/ConsultaFlujo/'+OT,
        success: function (Lineas) {

        } //Funcion success
    }); //Ajax*/
}

/*Eliminar nodo seleccionado
var parrafo = document.getElementById("provisional");
parrafo.parentNode.removeChild(parrafo);*/

//=========================================== elimina el nodo de la grafica =================================================//

function Eliminar() {
    var puntero = document.getElementById("GraficaGant");
    puntero.removeChild(puntero.childNodes[0]);
}

//=========================================== Contadores de activas y vencidas =================================================//

function Contadores(Lineas) {
    var Total = Lineas.length;
    var Hoy = new Date(moment().format('YYYY/MM/DD'));
    var Activas = 0;
    var Vencidas = 0;

    for (let index = 0; index < Total; index++) {
        var FechaVencimiento = new Date(moment(Lineas[index].FechaVenc).format('YYYY/MM/DD'));
        var diferencia = Math.floor((Hoy - FechaVencimiento) / (1000 * 60 * 60 * 24));

        if (Hoy > FechaVencimiento) {
            Vencidas++;
            document.getElementById("Rows" + index).style.backgroundColor = " #fc9b87 "; //Rojo
        } else if (diferencia == 4) {
            document.getElementById("Rows" + index).style.backgroundColor = " #faff76 "; //Amarillo
        } else {
            document.getElementById("Rows" + index).style.backgroundColor = " #c2fdcb "; //Verde
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

            var Tabla = document.getElementById('TablaRecoleccion').getElementsByTagName('tbody')[0];
            var limite = Tabla.rows.length;

            for (var i = 0; i < Lineas.length; i++) {
                var ID = Lineas[i].id;
                var OT = Lineas[i].OT;
                var Parte = Lineas[i].Parte;
                var CantOt = Lineas[i].CantOt;
                //Eliminar variable dentro del For
                Arreglo = [ID, OT, Parte, CantOt];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);

                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "RowsF" + (i + 1)); //se asigna id al incrementar cada fila +1 para contar el encabezado
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

    console.table(Tabla);
    $.post("/IniciarProdFlujo", // inicia la lista de ot en el flujo de produccion
        {
            Tabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });

    for (var j = 0; j < EliminarFila.length; j++) {
        $("#RowsF" + EliminarFila[j]).remove(); //elimina los elementos con id Rows
    }
    // setTimeout("redireccionar()",10000); //Tiempo para reedireccionar
}


//Cambia el estado de audotria del turno y reedirecciona a modulo de despacho
function redireccionar() {
    var pagina = "/Flujo";
    location.href = pagina;
}


//=========================================== Transferir a otra area =================================================//

function Transferir() {
    var cantidadDestino = document.getElementById("CantidadDestino").value;
    var cantidadActual = document.getElementById("R_Cantidad").value;
    var caso = "";
    if (cantidadDestino > cantidadActual) {
        alert("Cantidad mayor a la actual");
    } else if (cantidadDestino <= 0) {
        alert("Cantidad no valida");
    } else if (cantidadDestino < cantidadActual) {
        caso = "Parcial";
    }else{
        caso = "Cerrado";
    }

    var Linea = {
        id: document.getElementById("R_id").value,
        OT: document.getElementById("R_OT").value,
        Parte: document.getElementById("R_Parte").value,
        cantidadDestino: cantidadDestino,
        cantidadActual: cantidadActual,
        Planta: document.getElementById("R_Planta").value,
        Inicio: document.getElementById("R_Inicio").value,
        Fin: document.getElementById("R_Fin").value,
        AreaDestino: document.getElementById("AreaDestino").value,
        Caso = caso
    }
    $.post("/TransFlujo", // inicia la lista de ot en el flujo de produccion
        {
            Linea
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });
}