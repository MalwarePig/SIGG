function ModalAccesorios() {
    console.clear();
    $("#ModalAccesorios").modal();
}

function ModalImportarAccesorios() {
    console.clear();
    $("#ModalImportarAccesorios").modal();
}
 
function RegistrarAccesorio() {
    let Linea = {
        Tor_OC: document.getElementById("Tor_OC").value,
        Tor_OT: document.getElementById("Tor_OT").value,
        Tor_Producto: document.getElementById("Tor_Producto").value,
        Tor_PO: document.getElementById("Tor_PO").value,
        Tor_ENS: document.getElementById("Tor_ENS").value,
        Tor_Cantidad: document.getElementById("Tor_Cantidad").value,
        Tor_Ubicacion: document.getElementById("Tor_Ubicacion").value,
    }

    $.post("/RegistrarAccesorio", // inicia la lista de ot en el flujo de produccion
        {
            Linea
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
            if (objeto == true) {}
        });
    $('#FormularioAccesorios')[0].reset();
}

function CargaAccesorios() {

    let Busqueda = document.getElementById("Busqueda").value;
    let condicionBusqueda = Busqueda.substr(0, 4);
    let TipoURL = '';

    condicionBusqueda == 'FAC-' ? TipoURL = '/HistorialAccesorios/' + Busqueda : TipoURL = '/LeerAccesorios/' + Busqueda
    $.ajax({
        url: TipoURL,
        success: function (data) {
            console.log(data[0])

            $("#CuerpoTablaAccesorios tr").remove();
            let TotalRegistros = data.length;
            var Tabla = document.getElementById('TablaAccesorios').getElementsByTagName('tbody')[0];
            for (let index = 0; index < TotalRegistros; index++) {
                let id = data[index].id;
                let OCGemak = data[index].OCGemak;
                let OT = data[index].OT;
                let Producto = data[index].Producto;

                let POCliente = data[index].POCliente;
                let ENS = data[index].ENS;
                let Cantidad = data[index].Cantidad;

                let Ubicacion = data[index].Ubicacion || '-';
                let Entregado = moment(data[index].Entregado).format("DD/MM/YYYY") || '-';
                let Recibe = data[index].Recibe || '-';

                document.getElementById("Notas").value = data[index].Notas;

                let Arreglo = [id, OCGemak, OT, Producto, POCliente, ENS, Cantidad, Ubicacion, Entregado, Recibe];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                Cantidad <= '0' ? newRow.style.backgroundColor = "#ffd2d2" : newRow.style.backgroundColor = "#e7fed4";

                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + index); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);
                    if (x == 0) { //Ingresar el id
                        newCell.innerHTML = '<input required type="text" id="id' + index + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    } else if (x == 7) { //Agregar campo de ubicacion
                        // var newCell = newRow.insertCell(7);
                        newCell.innerHTML = '<input  type="text" id="Tab_Ubicacion' + index + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                    } else if (x == 9) { //Si termina de registrar datos crear el boton
                        if (Arreglo[6] > 0 && condicionBusqueda != 'FAC-') {
                            var newCell = newRow.insertCell(10); //CREAR CELDA
                            newCell.innerHTML = '<button id="' + index + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (index + 1) + ')> <i class="fas fa-circle"></i> </button>' +
                                '<button id="actualizarUbicacion' + index + '" class="btn btn-info" name="btn" onclick=CambiarUbicacion(' + (index + 1) + ')><i class="fas fa-edit"></i></button>' +
                                '<button id="EliminarAccesorio' + index + '" class="btn btn-danger" name="btn" onclick=EliminarAccesorio(' + (index + 1) + ')><i class="fas fa-minus-square"></i></button>';
                        } else {
                            var newCell = newRow.insertCell(10); //CREAR CELDA
                            newCell.innerHTML = '<button id="' + index + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (index + 1) + ') disabled> <i class="fas fa-circle"></i> </button>';
                        }
                    }
                } //fin de for de columnas
            }
            //document.getElementById("TotalMuerto").value = (data[0].TMUno + data[0].TMDos + data[0].TMTres);
        } //Funcion success
    }); //Ajax 
}

function CargarInicial() {
    document.getElementById("FechaRecibo").value = moment().format('DD/MM/YYYY 00:00:00');

    $.ajax({
        url: '/FolioAccesorios/',
        success: function (data) {
            document.getElementById("Folio").value = "FAC-" + ('000000' + (data[0].Total)).slice(-5);
        } //Funcion success
    }); //Ajax 
}

function redireccionar() {
    location.reload();
}


function PDF() {
    var doc = new jsPDF();
    var tabla = document.getElementById("TablaSalidas");
    var total = tabla.rows.length; //Total de filas
    var SaltoLinea = 4;
    var Linea = 0;

    for (let Parte = 1; Parte < 3; Parte++) {

        var columns = ["OC Compra", "OT", "Producto", "PO Cliente", "ENS", "Cantidad", "Ubicación", "Fecha", "Recibe"];
        var data = [];
        var PDFdata = [];
        var Folio = document.getElementById("Folio").value;

        for (var j = 1; j < total; j++) {
            let id = tabla.rows[j].cells[0].childNodes[0].nodeValue;
            let OCCompra = tabla.rows[j].cells[1].childNodes[0].nodeValue;
            let OT = tabla.rows[j].cells[2].childNodes[0].nodeValue;
            let Producto = tabla.rows[j].cells[3].childNodes[0].nodeValue;
            let POCliente = tabla.rows[j].cells[4].childNodes[0].nodeValue;
            let ENS = tabla.rows[j].cells[5].childNodes[0].nodeValue;
            let Cantidad = tabla.rows[j].cells[6].childNodes[0].nodeValue;
            let Ubicación = tabla.rows[j].cells[7].childNodes[0].nodeValue;
            let Fecha = tabla.rows[j].cells[8].childNodes[0].nodeValue;
            let Recibe = tabla.rows[j].cells[9].childNodes[0].nodeValue;
            let Notas = document.getElementById("Notas").value;
            let Folio = document.getElementById("Folio").value;
            var array = [id, OCCompra, OT, Producto, POCliente, ENS, Cantidad, Ubicación, Fecha, Recibe, Notas, Folio];
            data.push(array);
            var arrayPDF = [OCCompra, OT, Producto, POCliente, ENS, Cantidad, Ubicación, Fecha, Recibe, Notas];
            PDFdata.push(arrayPDF);
        }

        doc.setFontSize(8);
        doc.setTextColor(100);
        Parte == 1 ? Linea = 2 : Linea = 39;
        doc.text("REPORTE DE ENTREGAS" + "\t\t\t\t\t\t\t\t\ Folio " + Folio + "\t\t\t\t\t\t  FECHA " + moment().format("D MMM YYYY"), 15, (SaltoLinea * Linea));
        Parte == 1 ? Linea = 3 : Linea = 40;
        doc.text(" ", 10, (SaltoLinea * Linea));

        if (Parte == 2) {
            doc.autoTable(columns, PDFdata, {
                styles: {
                    fillColor: [158, 184, 193], //Columnas
                    fontSize: number = 6
                },
                columnStyles: { //Filas
                    0: {
                        halign: 'center',
                        fillColor: [255, 255, 255],
                        fontSize: number = 6
                    }
                }, // Cells in first column centered and green
                margin: {
                    top: 15
                }
            });
        } else {
            doc.autoTable(columns, PDFdata, {
                styles: {
                    fillColor: [158, 184, 193], //Columnas
                    fontSize: number = 6
                },
                columnStyles: { //Filas
                    0: {
                        halign: 'center',
                        fillColor: [255, 255, 255],
                        fontSize: number = 6
                    }
                }, // Cells in first column centered and green
                margin: {
                    top: 165
                }
            });
        }

        Parte == 1 ? Linea = 35 : Linea = 70;
        doc.line(120, (SaltoLinea * Linea), 195, (SaltoLinea * Linea));
        Parte == 1 ? Linea = 36 : Linea = 71;
        doc.text("Recibe", 155, (SaltoLinea * Linea));
        Parte == 1 ? Linea = 37 : Linea = 72;
        doc.line(2, (SaltoLinea * Linea), 200, (SaltoLinea * Linea)); // Mitad de hoja

    } //If de copias

    doc.save('documento.pdf');

    $.post("/ActualizarAccesorios", // inicia la lista de ot en el flujo de produccion
        {
            data
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
            if (objeto == true) {}
        });

    $("#CuerpoTablaAccesorios tr").remove();
    setTimeout("redireccionar()", 800); //Tiempo para reedireccionar
}





function ReporteExcel() {
    var tabla = document.getElementById("TablaAccesorios");
    var total = tabla.rows.length //Total de filas
    var sheet_1_data = [];
    for (var j = 0; j <= total - 1; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;

        var OCCompra = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Producto = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var POCliente = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var ENS = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Cantidad = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Ubicación = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Fecha = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Recibe = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var Fila = [OCCompra, OT, Producto, POCliente, ENS, Cantidad, Ubicación, Fecha, Recibe]
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Hoja1',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("Reporte.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}


function RegistrarImportacion() { //Ejecutar codigo al dar click en boton
    try {
        var i = 0; //Contador para brincar la cabaezera y suar la referencia de indice
        var Arreglo = [];
        $('#wrapper tr').each(function () { //leer una tabla html    
            if (i > 0) { //Iniciar despues de cabezera de tabla y OT sea diferente de Null
                if (($(this).find("td").eq(0).html() != null) && ($(this).find("td").eq(0).html() != '') && ($(this).find("td").eq(0).html() != '<empty string>')) {
                    var ORCompra = $(this).find("td").eq(0).html() || '-';
                    var OT = $(this).find("td").eq(1).html() || '-';
                    var Producto = $(this).find("td").eq(2).html() || '-';
                    var PO = $(this).find("td").eq(3).html() || '-';
                    var ENS = $(this).find("td").eq(4).html() || '-';
                    var Cantidad = $(this).find("td").eq(5).html() || '-';

                    var Ubicacion = $(this).find("td").eq(6).html() || '-';
                    var Entregado = document.getElementById("FechaRecibo").value;
                    var Recibe = document.getElementById("Recibe").value;
                    var Notas = document.getElementById("Recibe").Notas;

                    var Tabla = [ORCompra,OT,Producto,PO,ENS, Cantidad,Notas];
                    Arreglo.push(Tabla);
                }
            }
            i++;
        }); //each para recorrer tabla

        console.table(Arreglo);
        $.post("/ImportarAccesorios", // url
            {
                Arreglo
            }, // data to be submit
            function (Estado, status) { // success callback
                console.log(Estado + status);
                if (Estado == true) {
                    var parrafo = document.getElementById("wrapper");
                    while (parrafo.firstChild) {
                        //The list is LIVE so it will re-index each call
                        parrafo.removeChild(parrafo.firstChild);
                    }
                }
            })

    } catch (err) {
        console.log(err)
    }
}

function CargaCapturasPendientes() {
    $.ajax({
        url: '/CargaCapturasPendientes/',
        success: function (data) {
            console.log(data[0])

            $("#CuerpoTablaAccesorios tr").remove();
            let TotalRegistros = data.length;
            var Tabla = document.getElementById('TablaAccesorios').getElementsByTagName('tbody')[0];
            for (let index = 0; index < TotalRegistros; index++) {
                let OCGemak = data[index].OCGemak;
                let OT = data[index].OT;
                let Producto = data[index].Producto;

                let POCliente = data[index].POCliente;
                let ENS = data[index].ENS;
                let Cantidad = data[index].Cantidad;

                let Ubicacion = data[index].Ubicacion || '-';
                let Entregado = moment(data[index].Entregado).format("DD/MM/YYYY") || '-';
                let Recibe = data[index].Recibe || '-';

                document.getElementById("Notas").value = data[index].Notas;

                let Arreglo = ['', OCGemak, OT, Producto, POCliente, ENS, Cantidad, Ubicacion, Entregado, Recibe];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                Cantidad <= 0 ? newRow.style.backgroundColor = "#ffd2d2" : newRow.style.backgroundColor = "#e7fed4";

                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + index); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);

                    if (x == 9) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(10); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + index + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (index + 1) + ') disabled> <i class="fas fa-circle"></i> </button>';
                    }
                } //fin de for de columnas
            }
            //document.getElementById("TotalMuerto").value = (data[0].TMUno + data[0].TMDos + data[0].TMTres);
        } //Funcion success
    }); //Ajax 
}


function CargaCapturasEntregado() {
    $.ajax({
        url: '/CargaCapturasEntregado/',
        success: function (data) {
            console.log(data[0])

            $("#CuerpoTablaAccesorios tr").remove();
            let TotalRegistros = data.length;
            var Tabla = document.getElementById('TablaAccesorios').getElementsByTagName('tbody')[0];
            for (let index = 0; index < TotalRegistros; index++) {
                let OCGemak = data[index].OCGemak;
                let OT = data[index].OT;
                let Producto = data[index].Producto;

                let POCliente = data[index].POCliente;
                let ENS = data[index].ENS;
                let Cantidad = data[index].Cantidad;

                let Ubicacion = data[index].Ubicacion || '-';
                let Entregado = moment(data[index].Entregado).format("DD/MM/YYYY") || '-';
                let Recibe = data[index].Recibe || '-';

                document.getElementById("Notas").value = data[index].Notas;

                let Arreglo = ['', OCGemak, OT, Producto, POCliente, ENS, Cantidad, Ubicacion, Entregado, Recibe];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                Cantidad <= 0 ? newRow.style.backgroundColor = "#ffd2d2" : newRow.style.backgroundColor = "#e7fed4";

                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + index); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);

                    if (x == 9) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(10); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + index + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (index + 1) + ') disabled> <i class="fas fa-circle"></i> </button>';
                    }
                } //fin de for de columnas
            }
            //document.getElementById("TotalMuerto").value = (data[0].TMUno + data[0].TMDos + data[0].TMTres);
        } //Funcion success
    }); //Ajax 
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Seleccion(variable) {
    Registro = document.getElementById("TablaAccesorios");

    let id = document.getElementById("id" + (variable - 1)).value; //Obtiene el valor de Producto
    document.getElementById("idArticulo").value = id;

    var OCCOmpras = Registro.rows[variable].cells[1].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("OCCOmpras").value = OCCOmpras;

    var OT = Registro.rows[variable].cells[2].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("OT").value = OT;

    var POCliente = Registro.rows[variable].cells[4].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("POCliente").value = POCliente;

    var ENS = Registro.rows[variable].cells[5].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("ENS").value = ENS;

    var Producto = Registro.rows[variable].cells[3].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("ProductoSalida").value = Producto;

    var Cantidad = Registro.rows[variable].cells[6].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("Cantidad").value = Cantidad;

    document.getElementById("Cantidad").focus()
}


//=========================================== EVENTO CLIC SOBRE BOTON EN FORMULARIO PARA CREAR LA NOTA DE SALIDA =================================================//
function CrearNota() {
    var id = document.getElementById("idArticulo").value; //Obtiene el valor de Clave
    var FechaRecibo = document.getElementById("FechaRecibo").value; //Obtiene el valor de Clave
    var Recibe = document.getElementById("Recibe").value; //Obtiene el valor de Clave
    var ProductoSalida = document.getElementById("ProductoSalida").value; //Obtiene el valor de Clave
    var Cantidad = document.getElementById("Cantidad").value; //Obtiene el valor de Clave
    var Ubicacion = document.getElementById("Ubicacion").value; //Obtiene el valor de Clave

    var OCCOmpras = document.getElementById("OCCOmpras").value; //Obtiene el valor de Clave
    var OT = document.getElementById("OT").value; //Obtiene el valor de Clave
    var POCliente = document.getElementById("POCliente").value; //Obtiene el valor de Clave
    var ENS = document.getElementById("ENS").value; //Obtiene el valor de Clave

    var Arreglo = [id, OCCOmpras, OT, ProductoSalida, POCliente, ENS, Cantidad, Ubicacion, FechaRecibo, Recibe];

    var Condicion = true; //para campos vacios
    for (var a in Arreglo) { //recorrer arreglo en busca de campos vacios
        if (Arreglo[a].length == 0) {
            Condicion = false; //si algun campo esta vacio cambia a falso
            alert("Faltan campos por llenar")
        }
    }

    if (Condicion == true) { //si todos los campos estan llenos avanza
        var TablaAlmacen = document.getElementById('TablaSalidas').getElementsByTagName('tbody')[0];
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
        document.getElementById("ProductoSalida").value = "";
        document.getElementById("Cantidad").value = "";
    }
}

//=========================================== ELIMINAR FILA DE REGISTRO EN NOTAS =================================================//
function EliminarFila(index) {
    $("#fila" + index).remove();
}

$(function () {
    $(".solo-numero").keydown(function (event) {
        //alert(event.keyCode);
        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105) && event.keyCode !== 190 && event.keyCode !== 110 && event.keyCode !== 8 && event.keyCode !== 9) {
            return false;
        }
    });
}); //Funcion JQuery

function CambiarUbicacion(fila) {
    Registro = document.getElementById("TablaAccesorios");

    let idRegistro = document.getElementById("id" + (fila - 1)).value;
    let NuevaUbicacion = document.getElementById("Tab_Ubicacion" + (fila - 1)).value;

    
    data = {
        id: idRegistro,
        Ubicacion: NuevaUbicacion
    }
    $.post("/ActuaUbicacionAcces", // url
        {
            data
        }, // data to be submit
        function (Estado, status) { // success callback
            console.log(Estado + status);
            if (Estado == true) {
                var parrafo = document.getElementById("wrapper");
                while (parrafo.firstChild) {
                    //The list is LIVE so it will re-index each call
                    parrafo.removeChild(parrafo.firstChild);
                }
            }
        })
}


function EliminarAccesorio(fila) {
    Registro = document.getElementById("TablaAccesorios");
    let Producto = Registro.rows[fila].cells[3].childNodes[0].nodeValue

    localStorage.setItem('fila', fila);
    localStorage.setItem('idEliminar', (fila - 1));

    //Se obtiene el nodo
    var Nodo = document.getElementById("ProductoSpan");
    //se crea texto para el nodo
    var newText = document.createTextNode(Producto);
    //se inserta el valor al nodo

    Nodo.appendChild(newText);
    $("#ConfirmarEliminar").modal();
}



function ConfirmarEliminacion() {

    let idEliminar = localStorage.getItem('idEliminar');
    let idRegistro = document.getElementById("id" + idEliminar).value;
    var data = {
        id: idRegistro
    }
    
    console.table(data);
    $.post("/EliminarAccesorio", // url
        {
            data
        }, // data to be submit
        function (Estado, status) { // success callback
            console.log(Estado + status);
            if (Estado == true) {
                var parrafo = document.getElementById("wrapper");
                while (parrafo.firstChild) {
                    //The list is LIVE so it will re-index each call
                    parrafo.removeChild(parrafo.firstChild);
                }
            }
        })

    setTimeout("redireccionar()", 800); //Tiempo para reedireccionar

    var Nodo = document.getElementById("ProductoSpan");
    Nodo.removeChild(Nodo.firstChild)
    localStorage.clear();
}

//Cambia el estado de audotria del turno y reedirecciona a modulo de despacho
function redireccionar() {
    location.reload();
}