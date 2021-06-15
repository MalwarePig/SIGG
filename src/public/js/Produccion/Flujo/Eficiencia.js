//=========================================== BUSCAR TRABAJADORES POR NUMERO DE NOMINA =================================================//
function Nombres(e) {
    if (e.keyCode == 13) {
        $.ajax({
            url: '/Num_Nomina',
            success: function (empleados) {
                console.log(empleados)

                let TipoPlanta = localStorage.getItem('R_Planta');
                let InicialPlanta = '';
                (TipoPlanta == 'Morelos') ? InicialPlanta = 'M': InicialPlanta = 'B';
                let Nomina = InicialPlanta + document.getElementById("Ef_Nomina").value;
                for (var i = 0; i < empleados.length; i++) {
                    console.log(Nomina);
                    if (Nomina == empleados[i].Nomina) {
                        console.log("Nomina : " + Nomina);
                        document.getElementById("Ef_Nombre").value = empleados[i].Nombre;
                    }
                }
            } //Funcion success
        }); //Ajax 
        return false;
    }
}


function RegistrarEficiencia() {
    let Linea = {
        Ef_OT: document.getElementById("Ef_OT").value,
        Ef_CantOT: document.getElementById("Ef_CantOT").value,
        Ef_Maquina: document.getElementById("Ef_Maquina").value,
        Ef_Inicio: document.getElementById("Ef_Inicio").value,

        Ef_Nomina: document.getElementById("Ef_Nomina").value,
        Ef_Nombre: document.getElementById("Ef_Nombre").value,
        Ef_Turno: document.getElementById("Ef_Turno").value,

        Ef_OperacionT: document.getElementById("Ef_Operacion").value,
        Ef_CantidadXTurno: document.getElementById("Ef_CantidadXTurno").value,
        Ef_Estimado: document.getElementById("Ef_Estimado").value,

        Ef_TotalTMuerto: document.getElementById("Ef_TotalMuerto").value,
        Ef_Eficiencia: document.getElementById("Ef_totalEficiencia").value,

        T_Muerto1: document.getElementById("T_Muerto1").value,
        Ef_Muertos1: document.getElementById("Ef_Muertos1").value,
        T_Muerto2: document.getElementById("T_Muerto2").value,
        Ef_Muertos2: document.getElementById("Ef_Muertos2").value,
        T_Muerto3: document.getElementById("T_Muerto3").value,
        Ef_Muertos3: document.getElementById("Ef_Muertos3").value
        
    }

    console.table(Linea)
    $.post("/RegistrarEficiencia", // inicia la lista de ot en el flujo de produccion
        {
            Linea
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
            if (objeto == true) {
                Pendientes();
            }
        });

    $('#FormularioEficicencia')[0].reset();
}

function CalCantEstimada() {
let Turno = document.getElementById("Ef_Turno").value;
let TOperacion = document.getElementById("Ef_Operacion").value;
let CantidadOT = document.getElementById("Ef_CantOT").value;
let CantProducida = document.getElementById("Ef_CantidadXTurno").value;
var MinTurno = 0;
let Estimado = 0;
let MinMuertos = 0;
let Eficiencia = 0;
switch(Turno){
    case 'Dia': MinTurno = 480;
    break;
    case 'Tarde': MinTurno = 450;
    break;
    case 'Dia12': MinTurno = 690;
    break;
    case 'Noche12': MinTurno = 720;
    break;
    default: MinTurno = 0;
    break;
}

Estimado = MinTurno/TOperacion;
document.getElementById("Ef_Estimado").value = Estimado;

MinMuertos = ((Estimado - CantProducida) * TOperacion);
document.getElementById("Ef_TotalMuerto").value = MinMuertos;

Eficiencia = CantProducida/Estimado;
document.getElementById("Ef_totalEficiencia").value = Eficiencia.toFixed(2); ;
}




function TipoReporte() {
    if (document.getElementById("radioOT").checked == true) {
        document.getElementById('Busqueda').placeholder = 'Tipo reporte OT';
        document.getElementById("ReporteOT").style.display = "block";
        //document.getElementById("ReporteCalculoOT").style.display = "block";
        document.getElementById("ButtCargaEficiencias").disabled = false;
        console.log("OT")
    } else {
        document.getElementById('Busqueda').placeholder = 'Tipo reporte nomina';
        document.getElementById("ReporteOT").style.display = "none";
        document.getElementById("ButtCargaEficiencias").disabled = false;
    }
}


function CargaEficiencias() {
    $.ajax({
        url: '/LeerEficiencias/'+ document.getElementById("Busqueda").value,
        success: function (data) {
            console.log(data[0])

            $("#CuerpoTablaOT tr").remove();

            let TotalRegistros = data.length;
            var Tabla = document.getElementById('TablaOT').getElementsByTagName('tbody')[0];
            for (let index = 0; index < TotalRegistros; index++) {

                let OT = data[index].OT;
                let CantOT = data[index].CantOT;
                let Maquina = data[index].Maquina;
                let FechaInicio = data[index].FechaInicio;

                let Nomina = data[index].Nomina;
                let Nombre = data[index].Nombre;
                let Turno = data[index].Turno;

                let TiempoOperacion = data[index].TiempoOperacion;
                let CantTurno = data[index].CantTurno;
                let Estimado = data[index].Estimado;

                let TMuertoUno = data[index].TMuertoUno;
                let TMUno = data[index].TMUno;
                let TMuertoDos = data[index].TMuertoDos;
                let TMDos = data[index].TMDos;
                let TMuertoTres = data[index].TMuertoTres;
                let TMTres = data[index].TMTres;

                let Arreglo = [OT,Maquina,FechaInicio,CantOT,Nombre,Turno,TiempoOperacion,CantTurno,Estimado,TMuertoUno,TMUno,TMuertoDos,TMDos,TMuertoTres,TMTres];

                 // inserta una fila al final de la tabla
                 var newRow = Tabla.insertRow(Tabla.rows.length);
                 for (var x = 0; x < Arreglo.length; x++) {
                      // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"+index); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);

                    if (x == 14) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(15); //CREAR CELDA
                        newCell.innerHTML = '<button id="Boton' + index + '" class="btn btn-dark" name="btn" onclick=EditarEficiencia(' + index + ')> <i class="fas fa-edit"></i> </button>';
                    }
                 } //fin de for de columnas
            }

            //document.getElementById("TotalMuerto").value = (data[0].TMUno + data[0].TMDos + data[0].TMTres);

        } //Funcion success
    }); //Ajax 
}



function EditarEficiencia(fila) {
    $("#ModalEditEficiencia").modal();
}


