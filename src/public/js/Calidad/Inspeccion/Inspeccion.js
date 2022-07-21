function ModalNuevaInspeccion() {
    console.clear();
    Familias(); //carga las familias al iniciar el modal

    document.getElementById("N_FechaRegistro").value = moment().format('DD/MM/YYYY HH:mm');
    $("#ModalRegistroInspeccion").modal();
}

function CargarInicial() {
    CargarInspeccion();
    CargarInspectores();
}

function RegistrarOrden() {
    let Linea = {
        N_FechaRegistro: document.getElementById("N_FechaRegistro").value,
        N_Tipo: document.getElementById("N_Tipo").value,
        N_OT: document.getElementById("N_OT").value,
        N_CantidadOT: document.getElementById("N_CantidadOT").value,
        N_Notas: document.getElementById("N_Notas").value,
        N_Operador: document.getElementById("N_Empleado").value,
        N_Serie: document.getElementById("N_Serie").value,
        N_Parte: document.getElementById("N_Parte").value,
        N_Familia: document.getElementById("Familia").value,
        N_Maquina: document.getElementById("Maquina").value,
    }

    $.post("/NuevaInspeccion", // inicia la lista de ot en el flujo de produccion
        {
            Linea
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
            if (objeto == true) {
                alert("Registro correcto");
                setInterval(function () {
                    window.location.href = "http://192.168.2.8:3000/";
                }, 500);
            } else {
                alert("Error al registrar!");
                $('#Formulario')[0].reset();
            }
        });
    $('#Formulario')[0].reset();
}


//=========================================== BUSCAR TRABAJADORES POR NUMERO DE NOMINA =================================================//
function EventoNombres(e) {
    if (e.keyCode == 13) {
        Nombres();
    }
}

function Nombres() {
    $.ajax({
        url: '/Num_Nomina',
        success: function (empleados) {
            if (empleados.length > 0) {
                console.log(empleados)
                let TipoPlanta = localStorage.getItem('PlantaGeneral');
                let InicialPlanta = '';
                (TipoPlanta == 'Morelos') ? InicialPlanta = 'M' : InicialPlanta = 'B';
                let Nomina = InicialPlanta + document.getElementById("N_Nomina").value;
                for (var i = 0; i < empleados.length; i++) {
                    console.log(Nomina);
                    if (Nomina == empleados[i].Nomina) {
                        console.log("Nomina : " + Nomina);
                        document.getElementById("N_Empleado").value = empleados[i].Nombre;
                    }
                }
            }

        } //Funcion success
    }); //Ajax 
    return false;
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
                let Inspector = data[index].Inspector || '-';
                let Tipo = data[index].Tipo;
                let OT = data[index].OT;
                let Parte = data[index].Parte;
                let CantidadOT = data[index].CantidadOT;
                let Serie = data[index].Serie;
                let Maquina = data[index].Maquina;
                let Notas = data[index].Notas;
                let Arreglo = [id, Fecha, Inspector, Tipo, OT, Parte, CantidadOT, Serie, Maquina, Notas];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < (Arreglo.length + 1); x++) {

                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + index); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    if (x == 0) { //Ingresar el id
                        newCell.innerHTML = '<input required type="text" id="id' + index + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    } else if (x == 9) {
                        newCell.innerHTML = '<input required type="text" id="Instruccion' + index + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    } else if (x == 10) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(10); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + index + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (index + 1) + ')> <i class="fas fa-circle"></i> </button>';
                        /*+
                                                    '<button id="EliminarTi' + index + '" class="btn btn-danger" name="btn" onclick=EliminarTrabajoIn(' + (index + 1) + ')><i class="fas fa-minus-square"></i></button>';*/
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
    let N_Inspector = document.getElementById("N_Inspector").value;
    var CantidadConforme = document.getElementById("CantidadConforme").value;
    var CantidadNoConforme = document.getElementById("CantidadNoConforme").value;
    var CantidadRetrabajo = document.getElementById("Retrabajo").value;
    var CantidadAjuste = document.getElementById("Ajuste").value;
    var Notas = document.getElementById("Notas").value;
    let Arreglo = [id, N_Inspector, CantidadConforme, CantidadNoConforme, CantidadRetrabajo, CantidadAjuste, Notas]
    let data = {
        id: id,
        N_Inspector: N_Inspector,
        CantidadConforme: CantidadConforme,
        CantidadNoConforme: CantidadNoConforme,
        CantidadRetrabajo: CantidadRetrabajo,
        CantidadAjuste: CantidadAjuste,

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
            if (objeto == true) { }
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
                //let FormatoFechaInicio = moment(data[index].FechaEntrada).format("DD/MM/YYYY HH:mm");
                let FormatoFechaInicio = data[index].FechaEntrada;
                let FechaInicial = moment(FormatoFechaInicio)

                let Inspector = data[index].Inspector;
                let Operador = data[index].Operador;
                let Tipo = data[index].Tipo;
                let OT = data[index].OT;
                let CantidadOT = data[index].CantidadOT;
                let Serie = data[index].Serie;
                let Maquina = data[index].Maquina;
                //let FormatoFechaFin = moment(data[index].FechaFin).format("DD/MM/YYYY HH:mm");
                let FormatoFechaFin = data[index].FechaFin;
                let FechaFin = moment(FormatoFechaFin)

                let CantidadConforme = data[index].CantidadConforme;
                let CantidadNoConforme = data[index].CantidadNoConforme;
                let CantidadRetrabajo = data[index].CantidadRetrabajo;
                let CantidadAjuste = data[index].CantidadAjuste;
                let Notas = data[index].Notas;
                let Parte = data[index].Parte;

                let Minutos = FechaFin.diff(FechaInicial, 'minutes');
                // console.log(moment(FormatoFechaInicio).format("DD/MM/YYYY HH:mm") + " - " + FormatoFechaFin + " : ")
                //console.log(FechaInicial + " - " + FechaFin + " : " + Minutos)

                let Arreglo = [id, moment(FormatoFechaInicio).format("YYYY-MM-DD HH:mm"), Inspector, Operador, Tipo, OT, CantidadOT, Serie, Maquina, moment(FormatoFechaFin).format("YYYY-MM-DD HH:mm"), CantidadConforme, CantidadNoConforme, CantidadRetrabajo, CantidadAjuste, Notas, Minutos,Parte];
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

    let encabezado = ["Fecha registro", "Hora", "Inspector", "Operador", "Tipo", "OT","Parte", "Cantidad OT", "Serie", "Maquina", "Fecha fin", "Hora", "Conforme", "No Conforme", "Retrabajo", "Ajuste", "Notas", "Minutos"];
    sheet_1_data.push(encabezado)

    for (var j = 1; j <= total - 1; j++) { //filas
        //var Folio = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var FechaReg = Date.parse( tabla.rows[j].cells[1].childNodes[0].nodeValue);
        let FechaRegParse = new Date(FechaReg);
        var FechaRegistro = moment(FechaReg).format("DD/MM/YYYY");
 
        var Inspector = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Operador = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var Tipo = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var CantidadOT = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Serie = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Maquina = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var FechFin = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var FechaFin = moment(FechFin).format("DD/MM/YYYY");
        var Conforme = tabla.rows[j].cells[10].childNodes[0].nodeValue;
        var NoConforme = tabla.rows[j].cells[11].childNodes[0].nodeValue;
        var Retrabajo = tabla.rows[j].cells[12].childNodes[0].nodeValue;
        var Ajuste = tabla.rows[j].cells[13].childNodes[0].nodeValue;
        var Notas = tabla.rows[j].cells[14].childNodes[0].nodeValue;
        var Minutos = tabla.rows[j].cells[15].childNodes[0].nodeValue;
        var Parte = tabla.rows[j].cells[16].childNodes[0].nodeValue;
        var horaInicio = "";
        var horaFin = "";

        if (j > 0) {
            horaInicio = moment(FechaReg).format("HH:mm");
            horaFin = moment(FechFin).format("HH:mm");
        }
        console.log("FechaReg: " + FechaReg + " FechaRegistro: " + FechaRegistro + " horaInicio: " + horaInicio)
        var Fila = [FechaRegistro, horaInicio, Inspector, Operador, Tipo, OT,Parte, CantidadOT, Serie, Maquina, FechaFin, horaFin, Conforme, NoConforme, Retrabajo, Ajuste, Notas, Minutos]
        sheet_1_data.push(Fila);

        console.log(sheet_1_data)
    } //fin filas

    var opts = [{
        sheetid: 'Sheet One',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("ReporteArticulo.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}

//=========================================== BUSCAR MAQUINAS POR TIPO DE FAMILIA =================================================//
function Familias() {
    console.log("hi")
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

function ExtraerNoParte() {
    let N_OT = document.getElementById("N_OT").value;
    $.ajax({
        url: '/InfoOT/' + N_OT,
        success: function (data) {
            if (data.length > 0) {
                console.log(data)
                console.table(data[0].Parte)
                document.getElementById("N_Parte").value = data[0].Parte;
                document.getElementById("N_CantidadOT").value = data[0].CantOt;
            }

        } //Funcion success
    }); //Ajax
}

function eventoOT() {
    ExtraerNoParte();
}


/*
setInterval(function () {
   $.ajax({
       url: '/LogueoActivo/',
       success: function (data) {
           console.log(data)
           data = data.toUpperCase();
          
           if(data != 'CALIDAD' && data != 'ADMIN'){
               //location.reload();
               console.log(data)
               alert("La sesion actual expiro")
               window.location.href="http://192.168.2.8:3000/";
               console.log("Reiniciando")
           }
       } //Funcion success
   }); //Ajax
}, 50000); 
*/

