function ModalTrabajoInterno() {

    $("#ModalTrabajoInterno").modal();
}

function RegistrarTrabajoIn() {
    let Linea = {
        Usuario: document.getElementById("N_Usuario").value,
        OT: document.getElementById("N_OT").value,
        PN: document.getElementById("N_PN").value,
        Articulo: document.getElementById("N_Articulo").value,
        Cantidad: document.getElementById("N_Cantidad").value,
        Instrucciones: document.getElementById("N_Instrucciones").value
    }

    console.table(Linea)

    $.post("/RegistrarTrabajoIn", // inicia la lista de ot en el flujo de produccion
        {
            Linea
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
            if (objeto == true) {
                alert("lisro")
            }
        });
    $('#Formulario')[0].reset();
}


function CargaTrabajoIn() {
    document.getElementById("Principal").style.display = "block";
    document.getElementById("Historial").style.display = "none";
    let Busqueda = document.getElementById("Busqueda").value;
    let condicionBusqueda = Busqueda.substr(0, 4);
    let TipoURL = '';

    condicionBusqueda == 'FTI-' ? TipoURL = '/HistorialTrabajosIn/' + Busqueda : TipoURL = '/LeerTrabajosIn/' + Busqueda
    $.ajax({
        url: TipoURL,
        success: function (data) {
            console.log(data[0])

            $("#CuerpoTablaAccesorios tr").remove();
            let TotalRegistros = data.length;
            var Tabla = document.getElementById('TablaTrabajoIn').getElementsByTagName('tbody')[0];
            for (let index = 0; index < TotalRegistros; index++) {
                let id = data[index].id;
                let FechaRegistro = moment(data[index].FechaRegistro).format("DD/MM/YYYY") || '-';
                let Usuario = data[index].Usuario;
                let OT = data[index].OT;
                let PN = data[index].PN;
                let Articulo = data[index].Articulo;
                let Cantidad = data[index].Cantidad;
                let Instrucciones = data[index].Instrucciones;


                let Arreglo = [id, FechaRegistro, Usuario, OT, PN, Articulo, Cantidad, Instrucciones];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                Cantidad <= '0' ? newRow.style.backgroundColor = "#ffd2d2" : newRow.style.backgroundColor = "#e7fed4";

                for (var x = 0; x < Arreglo.length + 1; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + index); //se asigna id al incrementar cada fila +1 para contar el encabezado

                    if (x == 0) { //Ingresar el id
                        newCell.innerHTML = '<input required type="text" id="id' + index + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    } else if (x == 7) {
                        newCell.innerHTML = '<input required type="text" id="Instruccion' + index + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    } else if (x == 8) { //Si termina de registrar datos crear el boton
                        if (Arreglo[6] > 0 && condicionBusqueda != 'FAC-') {
                            var newCell = newRow.insertCell(8); //CREAR CELDA
                            newCell.innerHTML = '<button id="' + index + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (index + 1) + ')> <i class="fas fa-circle"></i> </button>' +
                                '<button id="EliminarTi' + index + '" class="btn btn-danger" name="btn" onclick=EliminarTrabajoIn(' + (index + 1) + ')><i class="fas fa-minus-square"></i></button>';
                        } else {
                            var newCell = newRow.insertCell(8); //CREAR CELDA
                            newCell.innerHTML = '<button id="' + index + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (index + 1) + ') disabled> <i class="fas fa-circle"></i> </button>';
                        }
                    } else {
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                    }
                } //fin de for de columnas
            }
            //document.getElementById("TotalMuerto").value = (data[0].TMUno + data[0].TMDos + data[0].TMTres);
        } //Funcion success
    }); //Ajax 
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Seleccion(variable) {
    Registro = document.getElementById("TablaTrabajoIn");

    let id = document.getElementById("id" + (variable - 1)).value; //Obtiene el valor de Producto
    document.getElementById("idArticulo").value = id;

    var FechaRegistro = Registro.rows[variable].cells[1].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("FechaRegistro").value = FechaRegistro;

    var Usuario = Registro.rows[variable].cells[2].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("Usuario").value = Usuario;

    var OT = Registro.rows[variable].cells[3].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("OT").value = OT;

    var PN = Registro.rows[variable].cells[4].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("PN").value = PN;

    var Producto = Registro.rows[variable].cells[5].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("Producto").value = Producto;

    var Cantidad = Registro.rows[variable].cells[6].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("Cantidad").value = Cantidad;

    let Instruccion = document.getElementById("Instruccion" + (variable - 1)).value; //Obtiene el valor de Producto
    document.getElementById("Instrucciones").value = Instruccion;


    document.getElementById("Cantidad").focus()
}


//=========================================== EVENTO CLIC SOBRE BOTON EN FORMULARIO PARA CREAR LA NOTA DE SALIDA =================================================//
function CrearNota() {
    let id = document.getElementById("idArticulo").value;
    var FechaRegistro = document.getElementById("FechaRegistro").value;
    var Usuario = document.getElementById("Usuario").value;
    var OT = document.getElementById("OT").value;
    var PN = document.getElementById("PN").value;

    var Aprobado = document.getElementById("Aprobado").value;
    var Entregado = document.getElementById("Entregado").value;
    var FechaEntrega = document.getElementById("FechaEntrega").value;

    var Producto = document.getElementById("Producto").value;
    var Cantidad = document.getElementById("Cantidad").value;

    var Folio = document.getElementById("Folio").value;
    var Instrucciones = document.getElementById("Instrucciones").value;


    var Arreglo = [id, FechaRegistro, Usuario, OT, PN, Producto, Cantidad, Aprobado, Entregado, FechaEntrega];

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
            if (x == 8) { //Si termina de registrar datos crear el boton
                var newCell = newRow.insertCell(9); //CREAR CELDA onclick="CrearNota()"
                newCell.innerHTML = '<button id="' + x + '" class="btn btn-danger" name="btn" onclick="EliminarFila(' + indice + ')"> <i class="far fa-minus-square"></i> </button>';
            }
        }
        //document.getElementById("RegistroSalida").reset();
        document.getElementById("Producto").value = "";
        document.getElementById("Cantidad").value = "";
    }
}

//=========================================== ELIMINAR FILA DE REGISTRO EN NOTAS =================================================//
function EliminarFila(index) {
    $("#fila" + index).remove();
}


function PDF() {
    var doc = new jsPDF();
    var tabla = document.getElementById("TablaSalidas");
    var total = tabla.rows.length; //Total de filas
    var SaltoLinea = 4;
    var Linea = 0;

    for (let Parte = 1; Parte < 3; Parte++) {

        var columns = ["Fecha registro", "Usuario", "OT", "PN", "Articulo", "Cantidad", "Aprobado", "Entregado", "Fecha entrega"];
        var data = [];
        var PDFdata = [];
        var Folio = document.getElementById("Folio").value;

        for (var j = 1; j < total; j++) {
            let id = tabla.rows[j].cells[0].childNodes[0].nodeValue;
            let FechaRegistro = tabla.rows[j].cells[1].childNodes[0].nodeValue;
            let Usuario = tabla.rows[j].cells[2].childNodes[0].nodeValue;
            let OT = tabla.rows[j].cells[3].childNodes[0].nodeValue;
            let PN = tabla.rows[j].cells[4].childNodes[0].nodeValue;
            let Articulo = tabla.rows[j].cells[5].childNodes[0].nodeValue;
            let Cantidad = tabla.rows[j].cells[6].childNodes[0].nodeValue;
            let Aprobado = tabla.rows[j].cells[7].childNodes[0].nodeValue;
            let Entregado = tabla.rows[j].cells[8].childNodes[0].nodeValue;
            let FechaEntrega = tabla.rows[j].cells[9].childNodes[0].nodeValue;
            let Instrucciones = document.getElementById("Instrucciones").value;
            let Folio = document.getElementById("Folio").value;
            var array = [id, FechaRegistro, Usuario, OT, PN, Articulo, Cantidad, Aprobado, Entregado, FechaEntrega, Instrucciones, Folio];
            data.push(array);

            var arrayPDF = [FechaRegistro, Usuario, OT, PN, Articulo, Cantidad, Aprobado, Entregado, FechaEntrega];
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

    $.post("/ActualizarTrabajoIn", // inicia la lista de ot en el flujo de produccion
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

//Cambia el estado de audotria del turno y reedirecciona a modulo de despacho
function redireccionar() {
    location.reload();
}



function CargarInicial() {
    document.getElementById("FechaEntrega").value = moment().format('DD/MM/YYYY 00:00:00');

    $.ajax({
        url: '/FolioTrabajoIn/',
        success: function (data) {
            document.getElementById("Folio").value = "FTI-" + ('000000' + (data[0].Total)).slice(-5);
        } //Funcion success
    }); //Ajax 
}



function EliminarTrabajoIn(fila) {
    Registro = document.getElementById("TablaTrabajoIn");
    let Producto = Registro.rows[fila].cells[5].childNodes[0].nodeValue

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
    $.post("/EliminarTrabajoIn", // url
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





function CargaCapturasEntregado() {
    document.getElementById("Principal").style.display = "none";
    document.getElementById("Historial").style.display = "block";
    $.ajax({
        url: '/CargaCapturasEntregadoTI/',
        success: function (data) {
            console.log(data[0])

            $("#CuerpoTablaHistorial tr").remove();
            let TotalRegistros = data.length;
            var Tabla = document.getElementById('TablaHistorial').getElementsByTagName('tbody')[0];
            for (let index = 0; index < TotalRegistros; index++) {
                let id = data[index].id;
                let FechaRegistro = moment(data[index].FechaRegistro).format("DD/MM/YYYY") || '-';
                let Usuario = data[index].Usuario;
                let OT = data[index].OT;
                let PN = data[index].PN;
                let Articulo = data[index].Articulo;
                let CantidadInicial = data[index].inicial;
                let CantidadFinal = data[index].final;
                let Instrucciones = data[index].Instrucciones;
                let Aprobado = data[index].Aprobado;
                let Entregado = data[index].Entregado;
                let entrega =  moment(data[index].FechaEntrega).format("DD/MM/YYYY") || '-';

                let Arreglo = [id, FechaRegistro, Usuario, OT, PN, Articulo, CantidadInicial,CantidadFinal, Aprobado, Entregado, entrega, Instrucciones];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
               
                Cantidad <= 0 ? newRow.style.backgroundColor = "#ffd2d2" : newRow.style.backgroundColor = "#ffd2d2";

                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + index); //se asigna id al incrementar cada fila +1 para contar el encabezado

                    if (x == 0) { //Ingresar el id
                        newCell.innerHTML = '<input required type="text" id="id' + index + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    } else if (x == 11) {
                        newCell.innerHTML = '<input required type="text" id="Instruccion' + index + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    } else {
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                    }
                } //fin de for de columnas
            }
            //document.getElementById("TotalMuerto").value = (data[0].TMUno + data[0].TMDos + data[0].TMTres);
        } //Funcion success
    }); //Ajax 
}

 
function CargaCapturasPendientesTI() {
    document.getElementById("Principal").style.display = "none";
    document.getElementById("Historial").style.display = "block";
    $.ajax({
        url: '/CargaCapturasPendientesTI/',
        success: function (data) {
            console.log(data[0])

            $("#CuerpoTablaHistorial tr").remove();
            let TotalRegistros = data.length;
            var Tabla = document.getElementById('TablaHistorial').getElementsByTagName('tbody')[0];
            for (let index = 0; index < TotalRegistros; index++) {
                let id = data[index].id;
                let FechaRegistro = moment(data[index].FechaRegistro).format("DD/MM/YYYY") || '-';
                let Usuario = data[index].Usuario;
                let OT = data[index].OT;
                let PN = data[index].PN;
                let Articulo = data[index].Articulo;
                let CantidadInicial = data[index].inicial;
                let CantidadFinal = data[index].final;
                let Instrucciones = data[index].Instrucciones;
                let Aprobado = data[index].Aprobado;
                let Entregado = data[index].Entregado;
                let entrega =  moment(data[index].FechaEntrega).format("DD/MM/YYYY") || '-';

                let Arreglo = [id, FechaRegistro, Usuario, OT, PN, Articulo, CantidadInicial, CantidadFinal, Aprobado, Entregado, entrega, Instrucciones];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                Cantidad <= '0' ? newRow.style.backgroundColor = "#ffd2d2" : newRow.style.backgroundColor = "#e7fed4";

                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + index); //se asigna id al incrementar cada fila +1 para contar el encabezado

                    if (x == 0) { //Ingresar el id
                        newCell.innerHTML = '<input required type="text" id="id' + index + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    } else if (x == 11) {
                        newCell.innerHTML = '<input required type="text" id="Instruccion' + index + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    } else {
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                    }
                } //fin de for de columnas
            }
            //document.getElementById("TotalMuerto").value = (data[0].TMUno + data[0].TMDos + data[0].TMTres);
        } //Funcion success
    }); //Ajax 
}