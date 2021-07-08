function ModalNuevaInspeccion() {
    console.clear();
    $("#ModalInspeccion").modal();
}

function CargarInicial() {
    CargarInspeccion();
    CargarInspectores();
    document.getElementById("N_FechaRegistro").value = moment().format('DD/MM/YYYY HH:mm');
}
 
function RegistrarOrden() {
    let Linea = {
        N_FechaRegistro: document.getElementById("N_FechaRegistro").value,
        N_Inspector: document.getElementById("N_Inspector").value,
        N_Tipo: document.getElementById("N_Tipo").value,
        N_OT: document.getElementById("N_OT").value,
        N_CantidadOT: document.getElementById("N_CantidadOT").value,
        N_Notas: document.getElementById("N_Notas").value
    }

    $.post("/NuevaInspeccion", // inicia la lista de ot en el flujo de produccion
        {
            Linea
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
            if (objeto == true) {}
        });
    $('#Formulario')[0].reset();
}

 
function CargarInspeccion() {
    $.ajax({
        url: '/CargarInspeccion',
        success: function (data) {
            console.log(data[0])
            $("#CuerpoRegistros tr").remove();
            let TotalRegistros = data.length;
            var Tabla = document.getElementById('TablaRegistros').getElementsByTagName('tbody')[0];
            for (let index = 0; index < TotalRegistros; index++) {
                let id = data[index].id;
                let Fecha = moment(data[index].FechaEntrada).format("DD/MM/YYYY HH:mm") || '-';
                let Inspector = data[index].Inspector;
                let Tipo = data[index].Tipo;
                let OT = data[index].OT;
                let CantidadOT = data[index].CantidadOT;
                let Notas = data[index].Notas;
                let Arreglo = [id, Fecha, Inspector, Tipo, OT, CantidadOT, Notas];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < (Arreglo.length + 1); x++) {
                  
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + index); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    if (x == 0) { //Ingresar el id
                        newCell.innerHTML = '<input required type="text" id="id' + index + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    } else if (x == 6) {
                        newCell.innerHTML = '<input required type="text" id="Instruccion' + index + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    } else if (x == 7) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(7); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + index + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (index + 1) + ')> <i class="fas fa-circle"></i> </button>' +
                            '<button id="EliminarTi' + index + '" class="btn btn-danger" name="btn" onclick=EliminarTrabajoIn(' + (index + 1) + ')><i class="fas fa-minus-square"></i></button>';
                    } else {
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                    }
                    
                } //fin de for de columnas
            } //document.getElementById("TotalMuerto").value = (data[0].TMUno + data[0].TMDos + data[0].TMTres);
        } //Funcion success
    }); //Ajax 
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Seleccion(variable) {
    Registro = document.getElementById("TablaRegistros");

    let id = document.getElementById("id" + (variable - 1)).value; //Obtiene el valor de Producto
    document.getElementById("idArticulo").value = id;

    var FechaRegistro = Registro.rows[variable].cells[1].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("FechaRegistro").value = FechaRegistro;

    var Inspector = Registro.rows[variable].cells[2].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("Inspector").value = Inspector;

    var Tipo = Registro.rows[variable].cells[3].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("Tipo").value = Tipo;

    var OT = Registro.rows[variable].cells[4].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("OT").value = OT;

    var CantidadOT = Registro.rows[variable].cells[5].childNodes[0].nodeValue; //Obtiene el valor de Producto
    document.getElementById("CantidadOT").value = CantidadOT;

    let Notas = document.getElementById("Instruccion" + (variable - 1)).value; //Obtiene el valor de Producto
    document.getElementById("Notas").value = Notas;

}




//=========================================== EVENTO CLIC SOBRE BOTON EN FORMULARIO PARA CREAR LA NOTA DE SALIDA =================================================//
function ActualizarOrden() {
    let id = document.getElementById("idArticulo").value;
    var Estado = document.getElementById("Estado").value;
    var CantidadEstado = document.getElementById("CantidadEstado").value;
    var Notas = document.getElementById("Notas").value;
    let Arreglo = [id, Estado, CantidadEstado,Notas]
    let data = {
        id: id,
        Estado: Estado,
        CantidadEstado: CantidadEstado,
        Notas: Notas
    }

    var Condicion = true; //para campos vacios
    for (var a in Arreglo) { //recorrer arreglo en busca de campos vacios
        if (Arreglo[a].length == 0) {
            Condicion = false; //si algun campo esta vacio cambia a falso
            alert("Faltan campos por llenar")
        }
    }

    $.post("/ActualizarOrden", // inicia la lista de ot en el flujo de produccion
        {
            data
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
            if (objeto == true) {}
        });
    document.getElementById("Notas").value = '';
    setTimeout("redireccionar()", 800); //Tiempo para reedireccionar
}


//Cambia el estado de audotria del turno y reedirecciona a modulo de despacho
function redireccionar() {
    location.reload();
}



function EliminarTrabajoIn(fila) {
    Registro = document.getElementById("TablaRegistros");
    let Producto = Registro.rows[fila].cells[4].childNodes[0].nodeValue

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
    $.post("/EliminarOrdenInsp", // url
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

 

function CargarInspectores() {
    var N_Inspector = document.getElementById("N_Inspector");
    $.ajax({
        url: '/CargarInspectores',
        success: function (data) {
            console.log(data[0])
            for (let i = N_Inspector.options.length; i >= 0; i--) { //Borrar elementos option de select
                N_Inspector.remove(i);
            }

            for (var i = 0; i < data.length; i++) { //Agregar nuevos options del select

                var option = document.createElement("option");
                option.text = data[i].Nombre;
                option.value = data[i].Nombre;
                N_Inspector.add(option);
            }
        } //Funcion success
    }); //Ajax 
}


function MostrarReporte() {
    var fechaInicio = document.getElementById("inicio").value;
    var fechafin = document.getElementById("fin").value;
    $.ajax({
        url: '/ListaInspecciones/' + fechaInicio + '|' + fechafin,
        success: function (data) {
            $("#CuerpoRegistros tr").remove();
            let TotalRegistros = data.length;
            var Tabla = document.getElementById('TablaRegistros').getElementsByTagName('tbody')[0];
            for (let index = 0; index < TotalRegistros; index++) {
                let id = data[index].id;
                let Fecha = moment(data[index].FechaEntrada).format("DD/MM/YYYY HH:mm") || '-';
                let Inspector = data[index].Inspector;
                let Tipo = data[index].Tipo;
                let OT = data[index].OT;
                let CantidadOT = data[index].CantidadOT;
               
                let FechaFin = moment(data[index].FechaFin).format("DD/MM/YYYY HH:mm") || '-'; 
                let CantidadEstado = data[index].CantidadEstado;
                let Estado = data[index].Estado;
                let Notas = data[index].Notas;
  
                let Arreglo = [id, Fecha, Inspector, Tipo, OT, CantidadOT,FechaFin,CantidadEstado,Estado, Notas];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < (Arreglo.length); x++) {
                  
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + index); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    if (x == 0) { //Ingresar el id
                        newCell.innerHTML = '<input required type="text" id="id' + index + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    } else {
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                    }
                    
                } //fin de for de columnas
            }
        } //Funcion success
    }); //Ajax
}



function ExcelReporte() {
    var tabla = document.getElementById("TablaRegistros");
    var total = tabla.rows.length //Total de filas
 
    var sheet_1_data = [];
    for (var j = 0; j <= total - 1; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
 
        //var Folio = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var FechaRegistro = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Inspector = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Tipo = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var CantidadOT = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var FechaFin = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var CantidadEstado = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Estado = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Notas = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var Fila = [FechaRegistro,Inspector,Tipo,OT,CantidadOT,FechaFin,CantidadEstado,Estado,Notas]
        sheet_1_data.push(Fila);
    } //fin filas
 
    var opts = [{
        sheetid: 'Sheet One',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("ReporteArticulo.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}
