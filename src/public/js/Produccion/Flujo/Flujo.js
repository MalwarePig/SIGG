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
                var Origen = Lineas[i].Origen || 'N/A';
                var CantOt = Lineas[i].CantOt;
                var Recibido = Lineas[i].Recibido + (Lineas[i].Extra || 0);
                var Enviadas = Lineas[i].Enviadas;
                var Stock = Lineas[i].Stock;
                var Vencimiento = Lineas[i].FechaVenc;
                var PNC = Lineas[i].PNC;

                switch (Origen) {
                    case "controlplaner":
                        Origen = "Producción";
                        break;
                    case "areaacabados":
                        Origen = "Acabados";
                        break;
                    case "areatratamientos":
                        Origen = "Tratamientos";
                        break;
                    case "areacalidad":
                        Origen = "Calidad";
                        break;
                    case "areaembarques":
                        Origen = "Embarques";
                        break;
                    default:
                        Origen = "N/A";
                        break;
                }

                Arreglo = [id, Inicio, Vencimiento, OT, Parte, Maquina, Cliente, Servicio, Origen, CantOt, Recibido, Enviadas, Stock, PNC];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 1; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell((x - 1));
                    newRow.setAttribute("id", "RowsFlujo" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    newRow.setAttribute("ondblclick", "Mostrar(" + i + ",'Tabla')"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    newRow.setAttribute("data-Indexdb" + i, Arreglo[0])
                    // adjuntar el texto al nodo
                    if (x != 1 && x != 2) { //Omite el campo de fechas
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                    } else if (x == 1) {
                        var newText = document.createTextNode(moment(Arreglo[x]).format('YYYY/MM/DD HH:mm'));
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
                var Origen = Lineas[i].Origen || 'N/A';
                var CantOt = Lineas[i].CantOt;
                var Recibido = Lineas[i].Recibido + (Lineas[i].Extra || 0);
                var Enviadas = Lineas[i].Enviadas;
                var Stock = Lineas[i].Stock;
                var Vencimiento = Lineas[i].FechaVenc;
                var PNC = Lineas[i].PNC;
                switch (Origen) {
                    case "controlplaner":
                        Origen = "Producción";
                        break;
                    case "areaacabados":
                        Origen = "Acabados";
                        break;
                    case "areatratamientos":
                        Origen = "Tratamientos";
                        break;
                    case "areacalidad":
                        Origen = "Calidad";
                        break;
                    case "areaembarques":
                        Origen = "Embarques";
                        break;
                    default:
                        Origen = "";
                        break;
                }

                Arreglo = [id, Inicio, Vencimiento, OT, Parte, Maquina, Cliente, Servicio, Origen, CantOt, Recibido, Enviadas, Stock, PNC];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 1; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x - 1);
                    newRow.setAttribute("id", "RowsEspera" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    newRow.setAttribute("ondblclick", "Mostrar(" + i + ",'TablaEspera')"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    newRow.setAttribute("data-IndexEsperadb" + i, Arreglo[0])
                    // adjuntar el texto al nodo
                    if (x != 1 && x != 2) { //Omite el campo de fechas
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                    } else if (x == 1) {
                        var newText = document.createTextNode(moment(Arreglo[x]).format('YYYY/MM/DD HH:mm'));
                        newCell.appendChild(newText);
                    } else {
                        var newText = document.createTextNode(moment(Arreglo[x]).format('YYYY/MM/DD'));
                        newCell.appendChild(newText);
                    }
                } //fin de for de columnas
            } //fin de for de filas
          
        } //Funcion success
    }); //Ajax
} //Evento clic

//=========================================== Evento clic para desplegar modal =================================================//
function Mostrar(indice, TipoTabla) {
    let AreaConectada = localStorage.getItem("Area");
    var combo = document.getElementById("ListArea");
    var selected = combo.options[combo.selectedIndex].text;

    //Solo Calidad puede enviar a Embarques
    if(selected != 'Calidad'){
        let ListaBloqueada = document.getElementById("ListEmbarque");
        ListaBloqueada.disabled = true;
    }
    
    if ((selected == AreaConectada) || (AreaConectada == 'Tratamientos' && selected == 'Trat. Externos')) { //Solo editar El area correspondiente a su cargo y area
        if (localStorage.getItem("Area") != 'Embarques') { //Solo mostrar el boton finalizar flujo a embarques
            document.getElementById("ButFinalizarFlujo").style.display = "none";
        }
        var tabla = document.getElementById(TipoTabla);
        //document.ready = document.getElementById("R_Planta").value = tabla.rows[(indice + 1)].cells[6].childNodes[0].nodeValue;
        //document.ready = document.getElementById("R_Area").value = tabla.rows[(indice + 1)].cells[5].childNodes[0].nodeValue;
        if (TipoTabla == 'Tabla') {
            localStorage.removeItem('R_id'); // Elimina el elemento de memoria 
            localStorage.setItem('R_id', tabla.rows[(indice + 1)].getAttribute("data-indexdb" + indice));
        } else {
            localStorage.removeItem('R_id'); // Elimina el elemento de memoria 
            localStorage.setItem('R_id', tabla.rows[(indice + 1)].getAttribute("data-indexesperadb" + indice));
        }

        localStorage.removeItem('R_Planta'); // Elimina el elemento de memoria 
        localStorage.setItem('R_Planta', document.getElementById("Planta").value);

        document.getElementById("R_OT").value = tabla.rows[(indice + 1)].cells[2].childNodes[0].nodeValue;
        document.getElementById("R_Parte").value = tabla.rows[(indice + 1)].cells[3].childNodes[0].nodeValue;
        document.getElementById("R_Cantidad").value = tabla.rows[(indice + 1)].cells[8].childNodes[0].nodeValue;
        let TotalRecibido = tabla.rows[(indice + 1)].cells[9].childNodes[0].nodeValue
        let Enviados = tabla.rows[(indice + 1)].cells[10].childNodes[0].nodeValue;
        document.getElementById("R_CantidadTotal").value = parseInt(TotalRecibido) - parseInt(Enviados);
        document.getElementById("R_Maquina").value = tabla.rows[(indice + 1)].cells[4].childNodes[0].nodeValue;
        //document.getElementById("R_Area").value = tabla.rows[(indice+1)].cells[5].childNodes[0].nodeValue;
        var fecha = moment(tabla.rows[(indice + 1)].cells[0].childNodes[0].nodeValue).format('YYYY-MM-DD');
        document.getElementById("R_Inicio").value = fecha;
        var fecha = moment(tabla.rows[(indice + 1)].cells[1].childNodes[0].nodeValue).format('YYYY-MM-DD');
        document.getElementById("R_Fin").value = fecha;
        document.getElementById("R_Recibido").value = tabla.rows[(indice + 1)].cells[9].childNodes[0].nodeValue

        $("#ModalEditarFlujo").modal();
        /*setTimeout(function () {
            var widthModal = document.getElementById("GraficaGant");
            var Ancho = widthModal.clientWidth;
            Grafica(Ancho);
        }, 500);*/
        let Area = localStorage.getItem('Area');
        //Agrear solo lectura cuando no es area de produccion
        if (Area != 'Producción') {
            $("#R_Recibido").attr("readonly", "readonly");
            $("#R_Extra").attr("readonly", "readonly");
        }

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
            if(parseInt(Lineas[index].PNC) > 0){
                document.getElementById("RowsFlujo" + index).style.backgroundColor = "#de724b"; //Amarillo
            } else if (Hoy > FechaVencimiento) {
                Vencidas++;
                document.getElementById("RowsFlujo" + index).style.backgroundColor = "#ffd2d2"; //Rojo
            } else if (diferencia == 4) {
                document.getElementById("RowsFlujo" + index).style.backgroundColor = "#feffd5"; //Amarillo
            } else {
                document.getElementById("RowsFlujo" + index).style.backgroundColor = "#e2fce9"; //Verde
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
/*
function Alimentar() {
    modalesspiner();
    $.ajax({
        url: '/AlimentarFlujo',
        success: function (Lineas) {

        } //Funcion success
    }); //Ajax
}
*/

function VistaPlanta() {
    $("#ModalExportVistaPlanta").modal();

    $.ajax({
        url: '/AlimentarVistaPlanta',
        success: function (Lineas) {
            if (Lineas.Estatus == 'Terminado') {
                $('#ModalExportVistaPlanta').modal('toggle');
            } else {
                alert("Error indeterminado");
            }

        } //Funcion success
    }); //Ajax
}
//=========================================== Consulta OT Pendientes de inicar =================================================//

function Pendientes() {
    if (localStorage.getItem("Area") != 'Producción') {
        document.getElementById("ButVistaPlanta").style.display = "none";
    }

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
            } else { //Produccion
                for (var i = 0; i < Lineas.length; i++) {
                    var ID = Lineas[i].id;
                    var OT = Lineas[i].OT;
                    var Parte = Lineas[i].Parte;
                    var CantOt = Lineas[i].CantOt;
                    //Eliminar variable dentro del For
                    Arreglo = [ID, OT, Parte, CantOt];
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
                var Maquina = document.getElementById("ListMaquina").value;
                var Fila = [id, Producto, Inicial, Extra, Maquina];
                Tabla.push(Fila);
                EliminarFila.push(i);

                $.post("/IniciarProdFlujo", // inicia la lista de ot en el flujo de produccion
                    {
                        Tabla
                    }, // data to be submit
                    function (objeto, estatus) { // success callback
                        //console.log("objeto: " + objeto + "Estatus: " + estatus);
                    });
            } else {
                alert("Confirmar OT a iniciar");
            }
        }

        console.table(Tabla);

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
    } else { //Area diferente a propia
        if (cantidadDestino < CantidadTotal) {
            $("#ModalPosiblePNC").modal();
        }else{
            ConfirmarTransferencia();
        }
    }

}


function ConfirmarTransferencia() {
    var cantidadDestino = parseInt(document.getElementById("CantidadDestino").value); //Cantidad a transferir a otra area
    var CantidadTotal = parseInt(document.getElementById("R_CantidadTotal").value); //Cantidad Total de OT + Extras
    var cantidadOT = parseInt(document.getElementById("R_Cantidad").value); //Cantidad de orden de Trabajo
    var AreaDestino = document.getElementById("AreaDestino").value;
    let Area = localStorage.getItem('Area');
    let NewPNC = document.getElementById("NewPNC").value || 0;

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
        Caso: caso,
        Recibido: document.getElementById("R_Recibido").value,
        Planta: localStorage.getItem('R_Planta'),
        PNC: NewPNC
    }

    document.getElementById("CantidadDestino").value = "0";
    document.getElementById("NewPNC").value = "0";
    $("#ModalTransferenciaLista").modal();
    setTimeout(function () {
        $('#ModalTransferenciaLista').modal('toggle');
        $('#ModalEditarFlujo').modal('toggle');
    }, 2000);

    console.table(Linea)
    $.post("/TransFlujo", // inicia la lista de ot en el flujo de produccion
        {
            Linea
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });
    setTimeout(function () {
        Carga();
    }, 1000);
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
    $("#ModalTransferenciaLista").modal();
    setTimeout(function () {
        $('#ModalTransferenciaLista').modal('toggle');
    }, 2000);

    $.post("/MandarTrat", // inicia la lista de ot en el flujo de produccion
        {
            Linea
        }, // data to be submit
        function (objeto, estatus) { // success callback

            console.log("s kj" + objeto + estatus)
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
                if (x == 3) {
                    var newCell = newRow.insertCell(4); //CREAR CELDA onclick="CrearNota()"
                    newCell.innerHTML = '<input required type="text" id="Inicial" class="form-control" value="' + ArrayPendintes[index][3] + '" ></input>';
                }
                if (x == 3) {
                    var newCell = newRow.insertCell(5); //CREAR CELDA onclick="CrearNota()"
                    newCell.innerHTML = '<input required type="text" id="Extra" class="form-control" value="' + 0 + '" ></input>';
                }
                if (x == 3) { //Si termina de registrar datos crear el boton
                    var newCell = newRow.insertCell(6); //CREAR CELDA onclick="CrearNota()"
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
                        var newCell = newRow.insertCell(10); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=ModalFinalizarTrat(' + i + ')> - </button>';
                    } else if (x == 2) {
                        if (Arreglo[x].toString().length >= 12) { //Si el texto es mayor a 12 caracteres se debe recortar
                            // adjuntar el texto al nodo
                            var newText = document.createTextNode(Arreglo[x].slice(0, 13) + "..");
                            newCell.appendChild(newText);
                            //Agregar elementos tooltip
                            newCell.setAttribute('data-toggle', 'tooltip');
                            newCell.setAttribute('data-placement', 'top');
                            newCell.setAttribute('title', Arreglo[x]);
                            newCell.setAttribute('data-parte', Arreglo[x]); //Guardar el numero de parte completo, porque solo se mostrara una parte de el en pantalla
                            newCell.setAttribute('id', "Celda" + i);
                        } else {
                            // adjuntar el texto al nodo
                            var newText = document.createTextNode(Arreglo[x]);
                            newCell.appendChild(newText);
                            //Agregar elementos tooltip
                            newCell.setAttribute('data-toggle', 'tooltip');
                            newCell.setAttribute('data-placement', 'top');
                            newCell.setAttribute('title', Arreglo[x]);
                            newCell.setAttribute('data-parte', Arreglo[x]); //Guardar el numero de parte completo, porque solo se mostrara una parte de el en pantalla
                            newCell.setAttribute('id', "Celda" + i);
                        }
                    } else {
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
}

function ModalFinalizarTrat(indice) {
    $("#CantidadTerminada").modal();
    localStorage.removeItem('idRetorno'); // Elimina el elemento de memoria 
    localStorage.setItem('idRetorno', indice);
}

function FinalizarTrat() {
    let id_Retorno = parseInt(localStorage.getItem('idRetorno'));

    var tabla = document.getElementById("TablaTratamientos");
    let OTRetorno = tabla.rows[(id_Retorno + 1)].cells[1].childNodes[0].nodeValue;
    let Recibidas = tabla.rows[(id_Retorno + 1)].cells[6].childNodes[0].nodeValue;
    let TerminadasT = tabla.rows[(id_Retorno + 1)].cells[7].childNodes[0].nodeValue;
    let idBDRegistro = tabla.rows[(id_Retorno + 1)].cells[0].childNodes[0].nodeValue;
    var ParteRetorno = document.getElementById('Celda' + id_Retorno).dataset.parte; //Se obtienen de los metadatos de la celda Parte
    let CantidadRetornoT = document.getElementById("T_Cantidad").value;

    let AreaDestino = document.getElementById("T_AreaDestino").value;

    let Tabla = {
        OTRetorno: OTRetorno,
        ParteRetorno: ParteRetorno,
        CantidadRetornoT: CantidadRetornoT,
        AreaDestino: AreaDestino,
        id_Retorno: idBDRegistro,
        TerminadasT: TerminadasT,
        Recibidas: Recibidas
    }

    //$("#ModalCambiosAplicados").modal();
    console.log(Tabla);
    $.post("/FinalizarTrat", // Guarda los cambios en las cantidades del flujo
        {
            Tabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });

    $("#ModalTratExternos").modal('hide');
    document.getElementById("T_Cantidad").value = '0';
    $("#ModalTransferenciaLista").modal();
    setTimeout(function () {
        $('#ModalTransferenciaLista').modal('toggle');
    }, 1500);
}


function ModalFinalizar() {
    $("#CerrarLineas").modal();
}

function FinalizarLineas() {
    let Ot = document.getElementById("R_OT").value;
    let Parte = document.getElementById("R_Parte").value
    let Cantidad = document.getElementById("Cantidad_Cerrando").value;
    let id = localStorage.getItem('R_id');

    let Tabla = {
        Ot: Ot,
        Parte: Parte,
        Cantidad: Cantidad,
        id: id
    }

    console.table(Tabla);
    $.post("/CerrarLineas", // Guarda los cambios en las cantidades del flujo
        {
            Tabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });

    $("#ModalTransferenciaLista").modal();
    setTimeout(function () {
        $('#ModalTransferenciaLista').modal('toggle');
    }, 2000);
}

//=========================================== BUSCAR MAQUINAS POR TIPO DE FAMILIA =================================================//
function Maquinas() {
    let familia = document.getElementById("Familia").value;
    var listMaquina = document.getElementById("ListMaquina");
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

function ModalEliminarOT() {
    $("#ModalEliminarOT").modal();
    document.getElementById("OTAEliminar").innerText = document.getElementById("R_OT").value;
}

function EliminarOTFlujo() {
    $("#ModalEliminarOT").modal("toggle");
    $("#ModalEditarFlujo").modal("toggle");
    let AreaElegida = document.getElementById("ListArea").value;
    let id = localStorage.getItem("R_id");
    let Tabla = [AreaElegida, id]
    $.post("/EliminarOTFlujo", // Guarda los cambios en las cantidades del flujo
        {
            Tabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });

    setTimeout(function () {
        Carga();
    }, 1000);
}

//=========================================== BUSCAR MAQUINAS POR TIPO DE FAMILIA =================================================//
var TotalProduccion = 0;//Total de tiempo en produccion
var TotalCola = 0;//Total de tiempo en cola
function LeerHistorial() {
    document.getElementById("TotalProd").value = "";
    document.getElementById("TotalCola").value = "";
    var ArregloGrafica = [];
    let OTHistorial = document.getElementById("OTHistorial").value;
    var Arreglo = []
    $.ajax({
        url: '/LeerHistorial/' + OTHistorial + '',
        success: function (DATA) {

            //Limpiar tabla 
            var Tabla = document.getElementById('TablaHistorial').getElementsByTagName('tbody')[0];
            var limite = Tabla.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#RowHistorial" + i).remove(); //elimina los elementos con id Rows
            }

            for (var i = 0; i < DATA.length; i++) {
                let id = DATA[i].id;
                let OT = DATA[i].OT;
                let Parte = DATA[i].Parte;
                let CantOt = DATA[i].CantOt;
                let Recibidas = DATA[i].Recibido;
                let Enviadas = DATA[i].Enviadas;
                let Maquina = DATA[i].Maquina || '';
                let Planta = DATA[i].Planta;
                let Servicio = DATA[i].Servicio || 'N/A';
                let Area = DATA[i].Area || 'N/A';
                let Origen = ConversorArea(DATA[i].Origen) || 'N/A';
                let FechaRegistro = moment(DATA[i].FechaRegistro) || 'N/A';
                let FechaProduccion = moment(DATA[i].FechaProd) || 'N/A';
                let FechaAceptado = moment(DATA[i].FechaInicio) || 'N/A';
                let FechaVencimiento = moment(DATA[i].FechaVenc).format('YYYY/MM/DD HH:mm') || 'N/A';
                let TiempoProd = CalcularTiempo(FechaAceptado, FechaProduccion);
                let TiempoCola = CalcularTiempo(FechaRegistro, FechaAceptado);
                    TotalProduccion = TotalProduccion + CalcularTotalProd(FechaAceptado, FechaProduccion);
                    TotalCola = TotalCola + CalcularTotalCola(FechaRegistro, FechaAceptado);
                // Grafica();
                //var Estatus = DATA[i].Estatus || 'N/A';
                //Eliminar variable dentro del For
                var Arreglo = [id, OT, Parte, CantOt, Recibidas, Enviadas, Maquina, Planta, Servicio, Area, Origen, moment(DATA[i].FechaRegistro).format('YYYY/MM/DD HH:mm'), moment(DATA[i].FechaInicio).format('YYYY/MM/DD HH:mm'), moment(DATA[i].FechaProd).format('YYYY/MM/DD HH:mm'), moment(DATA[i].FechaVenc).format('YYYY/MM/DD'), TiempoProd,TiempoCola];
                ArregloGrafica.push(Arreglo);

                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "RowHistorial" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);
                } //fin de for de columnas
            } //fin de for de filas
            document.getElementById("TotalProd").value = FormatoTiempo(TotalProduccion);
            document.getElementById("TotalCola").value = FormatoTiempo(TotalCola);
        } //Funcion success
    }); //Ajax
    Grafica(ArregloGrafica);
}
 

function Grafica(ArregloGrafica) {
    google.charts.load("current", {
        packages: ["timeline"]
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var container = document.getElementById('Grafica');
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();

        dataTable.addColumn({
            type: 'string',
            id: 'Area Actual'
        });
        dataTable.addColumn({
            type: 'string',
            id: 'OT'
        });
        dataTable.addColumn({
            type: 'date',
            id: 'Inicio'
        });
        dataTable.addColumn({
            type: 'date',
            id: 'Fin'
        });

        for (let index = 0; index < ArregloGrafica.length; index++) {
            var OT = ArregloGrafica[index][1];
            var Area = ArregloGrafica[index][9];
            var Inicio = new Date(ArregloGrafica[index][12]);
            var Fin = new Date(ArregloGrafica[index][13]);
            console.log(Area, OT, typeof (Inicio), Fin)
            dataTable.addRows([
                [Area, OT, Inicio, Fin]
            ]);
        }

        //dataTable.addRows([  ["Area3Actual",'OT2', new Date(2015, 0, 1), new Date(2015, 0, 5)]   ]);
        var options = {
            timeline: {
                groupByRowLabel: false
            },
            height: 300
        };

        chart.draw(dataTable, options);
    }
}

function ConversorArea(Origen) {
    switch (Origen) {
        case "controlplaner":
            Origen = "Producción";
            break;
        case "areaacabados":
            Origen = "Acabados";
            break;
        case "areatratamientos":
            Origen = "Tratamientos";
            break;
        case "areacalidad":
            Origen = "Calidad";
            break;
        case "areaembarques":
            Origen = "Embarques";
            break;
        default:
            Origen = "N/A";
            break;
    }
    return Origen;
}


function CalcularTiempo(FechaRegistro, FechaAceptado) {
    // FechaAceptado.diff(FechaRegistro, 'hours') + " H " + FechaAceptado.diff(FechaRegistro, 'minutes') + " M";
    let MinutosTotal = FechaAceptado.diff(FechaRegistro, 'minutes');
    let fin = false;
    let Horas = 0;
    let Dias = 0;

    while (fin == false) {
        if (MinutosTotal >= 1440) {
            Dias++;
            MinutosTotal -= 1440;
        } else if (MinutosTotal >= 60) {
            Horas++;
            MinutosTotal -= 60;
        } else {
            fin = true;
        }
    }
    return Dias + "D-" + Horas + "H-" + MinutosTotal + "M";
}
 

function CalcularTotalProd(FechaaUno, FechaDos) {
    // FechaAceptado.diff(FechaRegistro, 'hours') + " H " + FechaAceptado.diff(FechaRegistro, 'minutes') + " M";
    TotalProduccion = FechaDos.diff(FechaaUno, 'minutes');
    return TotalProduccion;
}

function CalcularTotalCola(FechaaUno, FechaDos) {
    // FechaAceptado.diff(FechaRegistro, 'hours') + " H " + FechaAceptado.diff(FechaRegistro, 'minutes') + " M";
    TotalCola = FechaDos.diff(FechaaUno, 'minutes');
    return TotalCola;
}

function FormatoTiempo(MinutosTotales){
    
    let fin = false;
    let Horas = 0;
    let Dias = 0;

    while (fin == false) {
        if (MinutosTotales >= 1440) {
            Dias++;
            MinutosTotales -= 1440;
        } else if (MinutosTotales >= 60) {
            Horas++;
            MinutosTotales -= 60;
        } else {
            fin = true;
        }
    }
    return Dias + "D:" + Horas + "H:" + MinutosTotales + "M";
}




function ConfirmarFlujo() {
    $("#ModaVistaPlanta").modal();
}


function ActivarNEWPNC(Estado) {
    let Cantidad_PNC = document.getElementById("NewPNC");
    if (Estado == false) {
        Cantidad_PNC.disabled = true;
    } else {
        Cantidad_PNC.disabled = false;
    }
}

function ModalNuevoProceso(){
    $("#ModalNuevoProceso").modal();
    document.getElementById("N_Cantidad").value = document.getElementById("R_CantidadTotal").value;
}

//=========================================== Transferir a otra area =================================================//
function NuevoProceso() {
    var cantidadDestino = parseInt(document.getElementById("N_Cantidad").value); //Cantidad a transferir a otra area
    var CantidadTotal = parseInt(document.getElementById("R_CantidadTotal").value); //Cantidad Total de OT + Extras
    var cantidadOT = parseInt(document.getElementById("R_Cantidad").value); //Cantidad de orden de Trabajo
    var AreaDestino = document.getElementById("N_AreaDestino").value;
    let Area = localStorage.getItem('Area');
    let NewPNC = document.getElementById("NewPNC").value || 0;

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
        Caso: caso,
        Recibido: document.getElementById("R_Recibido").value,
        Planta: localStorage.getItem('R_Planta'),
        PNC: NewPNC
    }

    document.getElementById("CantidadDestino").value = "0";
    document.getElementById("NewPNC").value = "0";
    $("#ModalTransferenciaLista").modal();
    setTimeout(function () {
        $('#ModalTransferenciaLista').modal('toggle');
        $('#ModalEditarFlujo').modal('toggle');
    }, 2000);

    console.table(Linea)
    $.post("/TransFlujo", // inicia la lista de ot en el flujo de produccion
        {
            Linea
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });
    setTimeout(function () {
        Carga();
    }, 1000);
}




//=========================================== BUSCAR MAQUINAS POR TIPO DE FAMILIA =================================================//
function ModalResetFlujo(){
$("#ModalResetFlujo").modal();
}

function Reset() {
    $.ajax({
        url: '/ResetFlujo/',
        success: function (data) {
             console.log(data.Estado)
        } //Funcion success
    }); //Ajax
}