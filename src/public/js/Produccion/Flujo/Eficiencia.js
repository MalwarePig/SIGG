var ReporteActivo = ''; //Contiene el nombre de la tabla de reporte consultado para ejecutar el excel
//=========================================== BUSCAR TRABAJADORES POR NUMERO DE NOMINA =================================================//
function Nombres(e) {
    if (e.keyCode == 13) {
        $.ajax({
            url: '/Num_Nomina',
            success: function (empleados) {
                console.log(empleados)

                let TipoPlanta = localStorage.getItem('R_Planta');
                let InicialPlanta = '';
                (TipoPlanta == 'Morelos') ? InicialPlanta = 'M' : InicialPlanta = 'B';
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
    let Total = document.getElementById("Ef_TotalMuerto").value;
 
        let TMUno = parseInt(document.getElementById("Ef_Muertos1").value);
        let TMDos = parseInt(document.getElementById("Ef_Muertos2").value);
        let TMTres = parseInt(document.getElementById("Ef_Muertos3").value);

        let Suma = TMUno + TMDos + TMTres;
        console.log(Suma)

        if (Suma > Total) {
            alert("El valor sobrepasa el total de tiempo muerto")
        } else {
            let FInicio = document.getElementById("Ef_FechaInicio").value;
            let HInicio = document.getElementById("Ef_HoraInicio").value;
            let FFin = document.getElementById("Ef_FechaFin").value;
            let HFin = document.getElementById("Ef_HoraFin").value;

            let RazonMuerto1 = document.getElementById("T_Muerto1").value;
            let RazonMuerto2 = document.getElementById("T_Muerto2").value;
            let RazonMuerto3 = document.getElementById("T_Muerto3").value;

            let Lista = [RazonMuerto1, RazonMuerto2, RazonMuerto3]; //lista de razones del select
            let ListaTiempos = ['Ef_Muertos1', 'Ef_Muertos2', 'Ef_Muertos3']; //lista de valores de los tiempos muertos

            let Setup = 0;
            let Programas = 0;
            let Herramienta = 0;
            let Material = 0;
            let Mantenimiento = 0;
            let Planeacion = 0;
            let Liberacion = 0;
            let Luz = 0;
            let Aditamentos = 0;
            let Otros = 0;

            for (let index = 0; index < Lista.length; index++) {
                switch (Lista[index]) {
                    case 'Aditamentos':
                        Aditamentos = document.getElementById(ListaTiempos[index]).value;
                        break;
                    case 'Setup':
                        Setup = document.getElementById(ListaTiempos[index]).value;
                        break;
                    case 'Programas':
                        Programas = document.getElementById(ListaTiempos[index]).value;
                        break;
                    case 'Herramienta':
                        Herramienta = document.getElementById(ListaTiempos[index]).value;
                        break;
                    case 'Material':
                        Material = document.getElementById(ListaTiempos[index]).value;
                        break;
                    case 'Liberación':
                        Liberacion = document.getElementById(ListaTiempos[index]).value;
                        break;
                    case 'Luz':
                        Luz = document.getElementById(ListaTiempos[index]).value;
                        break;
                    case 'Mantenimiento':
                        Mantenimiento = document.getElementById(ListaTiempos[index]).value;
                        break;
                    case 'Planeación':
                        Planeacion = document.getElementById(ListaTiempos[index]).value;
                        break;
                    case 'Otros':
                        Otros = document.getElementById(ListaTiempos[index]).value;
                        break;
                }
            }

            let Linea = {
                Ef_OT: document.getElementById("Ef_OT").value,
                Ef_Operacion: document.getElementById("Ef_Operacion").value,
                Ef_CantOT: document.getElementById("Ef_CantOT").value,
                Ef_Maquina: document.getElementById("Ef_Maquina").value,

                Ef_Nomina: document.getElementById("Ef_Nomina").value,
                Ef_Nombre: document.getElementById("Ef_Nombre").value,
                Ef_Turno: document.getElementById("Ef_Turno").value,

                Ef_OperacionT: document.getElementById("Ef_Operacion").value,
                Ef_CantidadXTurno: document.getElementById("Ef_CantidadXTurno").value,
                Ef_Estimado: document.getElementById("Ef_Estimado").value,

                Ef_TotalTMuerto: document.getElementById("Ef_TotalMuerto").value,
                Ef_Eficiencia: document.getElementById("Ef_totalEficiencia").value,

                Setup: Setup,
                Programas: Programas,
                Liberacion: Liberacion,
                Herramienta: Herramienta,
                Material: Material,
                Luz: Luz,
                Mantenimiento: Mantenimiento,
                Planeacion: Planeacion,
                Otros: Otros,
                Aditamentos: Aditamentos,
                Ef_FechaInicio: FInicio + " " + HInicio,
                Ef_FechaFin: FFin + " " + HFin
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
            $('#ModalEficiencia').modal('toggle');
        } 
}

function CalCantEstimada() {

    let FInicio = document.getElementById("Ef_FechaInicio").value;
    let HInicio = document.getElementById("Ef_HoraInicio").value;
    let FFin = document.getElementById("Ef_FechaFin").value;
    let HFin = document.getElementById("Ef_HoraFin").value;

    let ComidaCheck = $('input[name="Comida"]:checked').val();
    let Comida = ComidaCheck == 'true' ? -30 : 0;//si esta check comida se resta 30 minutos al turno
    var FechaInicio = moment(FInicio + " " + HInicio); //Formato Fecha + hora
    var FechaFinal = moment(FFin + " " + HFin); //Formato Fecha + hora
    let TRealTrabajo = moment(FechaFinal.diff(FechaInicio, 'minutes')) + Comida;




    //alert("Tiempo laboral = " + TRealTrabajo + " Comida: " + Comida + " Total trabajado: " + (TRealTrabajo + Comida) + "---" + ComidaCheck);
    let Turno = document.getElementById("Ef_Turno").value;
    let TOperacion = document.getElementById("Ef_Operacion").value;
    let CantidadOT = document.getElementById("Ef_CantOT").value;
    let CantProducida = document.getElementById("Ef_CantidadXTurno").value;
    var MinTurno = 0;
    let Estimado = 0;
    let MinMuertos = 0;
    let Eficiencia = 0;

    switch (Turno) {
        case 'Dia':
            MinTurno = 480;
            break;
        case 'Tarde':
            MinTurno = 450;
            break;
        case 'Dia12':
            MinTurno = 690;
            break;
        case 'Noche12':
            MinTurno = 720;
            break;
        default:
            MinTurno = 0;
            break;
    }

    Estimado = (TRealTrabajo / TOperacion).toFixed(2);
    document.getElementById("Ef_Estimado").value = Estimado;

    MinMuertos = ((Estimado - CantProducida) * TOperacion).toFixed(2);
    document.getElementById("Ef_TotalMuerto").value = MinMuertos;

    Eficiencia = CantProducida / Estimado;
    document.getElementById("Ef_totalEficiencia").value = (Eficiencia.toFixed(2) * 100);
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


function EditarEficiencia(fila) {
    $("#ModalEditEficiencia").modal();
}

function CalcularTotalesOT() {
    var table = document.getElementById('TablaHistorial').getElementsByTagName('tbody')[0];
    var LimiteFilas = table.rows.length;
    let Arreglo = [];

    let TotalTiempoOperacion = 0;
    let CantTurno = 0;
    let Estimado = 0;
    let Eficiencia = 0;
    let TotalTMuerto = 0;

    let Aditamentos = 0;
    let Herramienta = 0;
    let Liberacion = 0;
    let Luz = 0;
    let Mantenimiento = 0;
    let Material = 0;
    let Planeacion = 0;
    let Programas = 0;
    let Setup = 0;
    let Otros = 0;

    for (let index = 0; index < LimiteFilas; index++) {
        var tabla = document.getElementById("TablaHistorial");
        TotalTiempoOperacion = TotalTiempoOperacion + parseInt(tabla.rows[(index + 1)].cells[7].childNodes[0].nodeValue); //TOperacion
        CantTurno = CantTurno + Math.round(parseInt(tabla.rows[(index + 1)].cells[8].childNodes[0].nodeValue)); //CantTurno
        Estimado = Estimado + Math.round(parseInt(tabla.rows[(index + 1)].cells[9].childNodes[0].nodeValue)); //Estimado
        Eficiencia = Eficiencia + parseInt(tabla.rows[(index + 1)].cells[10].childNodes[0].nodeValue); //Eficiencia
        TotalTMuerto = TotalTMuerto + parseInt(tabla.rows[(index + 1)].cells[11].childNodes[0].nodeValue); //TotalTMuerto

        Aditamentos = Aditamentos + parseInt(tabla.rows[(index + 1)].cells[12].childNodes[0].nodeValue); //Aditamentos
        Herramienta = Herramienta + parseInt(tabla.rows[(index + 1)].cells[13].childNodes[0].nodeValue); //Herramienta
        Liberacion = Liberacion + parseInt(tabla.rows[(index + 1)].cells[14].childNodes[0].nodeValue); //Liberacion
        Luz = Luz + parseInt(tabla.rows[(index + 1)].cells[15].childNodes[0].nodeValue); //Luz
        Mantenimiento = Mantenimiento + parseInt(tabla.rows[(index + 1)].cells[16].childNodes[0].nodeValue); //Mantenimiento
        Material = Material + parseInt(tabla.rows[(index + 1)].cells[17].childNodes[0].nodeValue); //Material
        Planeacion = Planeacion + parseInt(tabla.rows[(index + 1)].cells[18].childNodes[0].nodeValue); //Planeacion
        Programas = Programas + parseInt(tabla.rows[(index + 1)].cells[19].childNodes[0].nodeValue); //Programas
        Setup = Setup + parseInt(tabla.rows[(index + 1)].cells[20].childNodes[0].nodeValue); //Setup
        Otros = Otros + parseInt(tabla.rows[(index + 1)].cells[21].childNodes[0].nodeValue); //Otros
        if (index == (LimiteFilas - 1)) {
            Arreglo = [" ", " ", " ", " ", " ", " ", " ", TotalTiempoOperacion, " ", " ", Math.round((Eficiencia / LimiteFilas)).toFixed(2) + "%", TotalTMuerto, Aditamentos, Herramienta, Liberacion, Luz, Mantenimiento, Material, Planeacion, Programas, Setup, Otros];
        } //Calculo de efieciencia Math.round(((CantTurno / Estimado) * 100)).toFixed(2) + "%"
    }

    var Tabla = document.getElementById('TablaHistorial').getElementsByTagName('tbody')[0];
    // inserta una fila al final de la tabla
    var newRow = Tabla.insertRow(Tabla.rows.length);
    for (var x = 0; x < Arreglo.length; x++) {
        // inserta una celda en el indice 0
        var newCell = newRow.insertCell(x);
        newRow.setAttribute("id", "Rows" + "Totales"); //se asigna id al incrementar cada fila +1 para contar el encabezado
        // adjuntar el texto al nodo
        var newText = document.createTextNode(Arreglo[x]);
        newCell.appendChild(newText);
    } //fin de for de columnas
}

function ExcelOT() {
    var tabla = document.getElementById("TablaHistorial");
    var total = tabla.rows.length //Total de filas

    var sheet_1_data = [];
    for (var j = 0; j <= total - 1; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Maquina = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Inicio = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Fin = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var CantOT = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Nombre = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Turno = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var TiempoOperacion = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var CantTurno = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Estimado = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var Eficiencia = tabla.rows[j].cells[10].childNodes[0].nodeValue;
        var TotalTMuerto = tabla.rows[j].cells[11].childNodes[0].nodeValue;

        var Aditamentos = tabla.rows[j].cells[12].childNodes[0].nodeValue;
        var Herramienta = tabla.rows[j].cells[13].childNodes[0].nodeValue;
        var Liberacion = tabla.rows[j].cells[14].childNodes[0].nodeValue;
        var Luz = tabla.rows[j].cells[15].childNodes[0].nodeValue;
        var Mantenimiento = tabla.rows[j].cells[16].childNodes[0].nodeValue;
        var Material = tabla.rows[j].cells[17].childNodes[0].nodeValue;
        var Planeacion = tabla.rows[j].cells[18].childNodes[0].nodeValue;
        var ProgramaError = tabla.rows[j].cells[19].childNodes[0].nodeValue;
        var Setup = tabla.rows[j].cells[20].childNodes[0].nodeValue;
        var Otros = tabla.rows[j].cells[21].childNodes[0].nodeValue;

        var Fila = [OT, Maquina, Inicio, Fin, CantOT, Nombre, Turno, TiempoOperacion, CantTurno, Estimado, Eficiencia, TotalTMuerto, Aditamentos, Herramienta, Liberacion, Luz, Mantenimiento, Material, Planeacion, ProgramaError, Setup, Otros];
        sheet_1_data.push(Fila);
    } //fin filas

    console.table(sheet_1_data)
    var opts = [{
        sheetid: 'Sheet One',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("ReporteArticulo.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}


function CargaEficienciasOT() {
    ReporteActivo = "ReporteOT";


    document.getElementById("HistorialOT").style.display = "block";
    document.getElementById("HistorialMensual").style.display = "none";
    $.ajax({
        url: '/LeerEficiencias/' + document.getElementById("Busqueda").value,
        success: function (data) {
            console.log(data[0])
            for (let index = 0; index < 11; index++) {
                document.getElementById("FilaTiempoMuerto" + index).style.backgroundColor = "#efe663"; //Amarillo
            }

            $("#CuerpoTablaOT tr").remove();

            let TotalRegistros = data.length;
            var Tabla = document.getElementById('TablaHistorial').getElementsByTagName('tbody')[0];
            for (let index = 0; index < TotalRegistros; index++) {

                let OT = data[index].OT;
                let CantOT = data[index].CantOT;
                let Maquina = data[index].Maquina;
                let FechaInicio = moment(data[index].FechaInicio).format('YYYY-MM-DD HH:mm');
                let FechaFin = moment(data[index].FechaFin).format('YYYY-MM-DD HH:mm');

                let Nomina = data[index].Nomina;
                let Nombre = data[index].Nombre;
                let Turno = data[index].Turno;

                let TiempoOperacion = data[index].TiempoOperacion;
                let CantTurno = data[index].CantTurno;
                let Estimado = data[index].Estimado;

                let TotalTMuerto = data[index].TotalTMuerto;
                let Eficiencia = (data[index].Eficiencia * 100).toFixed(2)

                let Aditamentos = data[index].Aditamentos;
                let Herramienta = data[index].Herramienta;
                let Liberacion = data[index].Liberacion;
                let Luz = data[index].Luz;
                let Mantenimiento = data[index].Mantenimiento;
                let Material = data[index].Material;
                let Planeacion = data[index].Planeacion;
                let Programas = data[index].Programas;
                let Setup = data[index].Setup;
                let Otros = data[index].Otros;

                let Arreglo = [OT, Maquina, FechaInicio, FechaFin, CantOT, Nombre, Turno, TiempoOperacion, CantTurno, Estimado, Eficiencia, TotalTMuerto, Aditamentos, Herramienta, Liberacion, Luz, Mantenimiento, Material, Planeacion, Programas, Setup, Otros];

                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + index); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);
                } //fin de for de columnas
            }
            CalcularTotalesOT();
            //document.getElementById("TotalMuerto").value = (data[0].TMUno + data[0].TMDos + data[0].TMTres);
        } //Funcion success
    }); //Ajax 
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////     REPORTE MENSUAL     /////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function CargaEficienciasMensual() {
    ReporteActivo = 'ReporteMensual';

    var Planta = document.getElementById("Planta").value;
    var InicioMes = document.getElementById("InicioMes").value;
    var FinMes = document.getElementById("FinMes").value;

    document.getElementById("HistorialMensual").style.display = "block";
    document.getElementById("HistorialOT").style.display = "none";


    $.ajax({
        url: '/LeerEficienciaMensual/' + InicioMes + '|' + FinMes + '|' + Planta,
        success: function (data) {

            for (let index = 0; index < 11; index++) {
                document.getElementById("FilaTiempoMuertoMensual" + index).style.backgroundColor = "#efe663"; //Amarillo
            }

            $("#CuerpoTablaMensual tr").remove();
            console.log(data)
            console.log(data.length)
            let ArrayCalculo = [];

            var OTPivote = data[0].OT;
            var CantTurno = 0;
            var Estimado = 0;
            var TotalTMuerto = 0;
            var Eficiencia = 0;
            var Aditamentos = 0;
            var Herramienta = 0;
            var Liberacion = 0;
            var Luz = 0;
            var Mantenimiento = 0;
            var Material = 0;
            var Planeacion = 0;
            var Programas = 0;
            var Setup = 0;
            var Otros = 0;

            for (let index = 0; index < data.length; index++) {
                console.log("entra a for " + data[index].OT)
                if (OTPivote != data[index].OT) { //Si la OT cambia
                    console.log(data[index].OT);
                    let Datos = {
                        OT: data[(index - 1)].OT, //TOperacion
                        TotalTMuerto: TotalTMuerto, //TOperacion
                        Eficiencia: ((CantTurno / Estimado).toFixed(2) * 100), //Eficiencia
                        Aditamentos: Aditamentos,
                        Herramienta: Herramienta,
                        Liberacion: Liberacion,
                        Luz: Luz,
                        Mantenimiento: Mantenimiento,
                        Material: Material,
                        Planeacion: Planeacion,
                        Programas: Programas,
                        Setup: Setup,
                        Otros: Otros
                    }

                    ArrayCalculo.push(Datos);

                    console.log("Datos del if");
                    console.log(ArrayCalculo);

                    TotalTMuerto = 0;
                    Eficiencia = 0;

                    CantTurno = 0;
                    Estimado = 0;

                    Aditamentos = 0;
                    Herramienta = 0;
                    Liberacion = 0;
                    Luz = 0;
                    Mantenimiento = 0;
                    Material = 0;
                    Planeacion = 0;
                    Programas = 0;
                    Setup = 0;

                    Otros = 0;

                    CantTurno = CantTurno + parseInt(data[index].CantTurno); //CantidadProducida
                    Estimado = Estimado + parseInt(data[index].Estimado); //Estimado
                    TotalTMuerto = TotalTMuerto + parseInt(data[index].TotalTMuerto); //TOperacion
                    Eficiencia = Eficiencia + data[index].Eficiencia; //Eficiencia

                    Aditamentos = data[index].Aditamentos;
                    Herramienta = data[index].Herramienta;
                    Liberacion = data[index].Liberacion;
                    Luz = data[index].Luz;
                    Mantenimiento = data[index].Mantenimiento;
                    Material = data[index].Material;
                    Planeacion = data[index].Planeacion;
                    Programas = data[index].Programas;
                    Setup = data[index].Setup;
                    Otros = data[index].Otros;
                    OTPivote = data[index].OT;

                    if (index == (data.length - 1)) {
                        let Datos = {
                            OT: data[index].OT, //TOperacion
                            TotalTMuerto: TotalTMuerto, //TOperacion
                            Eficiencia: ((CantTurno / Estimado).toFixed(2) * 100), //Eficiencia

                            Aditamentos: Aditamentos,
                            Herramienta: Herramienta,
                            Liberacion: Liberacion,
                            Luz: Luz,
                            Mantenimiento: Mantenimiento,
                            Material: Material,
                            Planeacion: Planeacion,
                            Programas: Programas,
                            Setup: Setup,
                            Otros: Otros
                        }
                        ArrayCalculo.push(Datos);
                    }
                } else { //Si la OT es la misma 
                    TotalTMuerto = TotalTMuerto + parseInt(data[index].TotalTMuerto); //TOperacion
                    Eficiencia = Eficiencia + data[index].Eficiencia; //Eficiencia

                    CantTurno = CantTurno + parseInt(data[index].CantTurno); //CantidadProducida
                    Estimado = Estimado + parseInt(data[index].Estimado); //Estimado

                    Aditamentos = Aditamentos + parseInt(data[index].Aditamentos);
                    Herramienta = Herramienta + parseInt(data[index].Herramienta);
                    Liberacion = Liberacion + parseInt(data[index].Liberacion);
                    Luz = Luz + parseInt(data[index].Luz);
                    Mantenimiento = Mantenimiento + parseInt(data[index].Mantenimiento);
                    Material = Material + parseInt(data[index].Material);
                    Planeacion = Planeacion + parseInt(data[index].Planeacion);
                    Programas = Programas + parseInt(data[index].Programas);
                    Setup = Setup + parseInt(data[index].Setup);
                    Otros = Otros + parseInt(data[index].Otros);

                    OTPivote = data[index].OT;

                    if (index == (data.length - 1)) {
                        let Datos = {
                            OT: data[index].OT, //TOperacion
                            TotalTMuerto: TotalTMuerto, //TOperacion
                            Eficiencia: ((CantTurno / Estimado).toFixed(2) * 100), //Eficiencia

                            Aditamentos: Aditamentos,
                            Herramienta: Herramienta,
                            Liberacion: Liberacion,
                            Luz: Luz,
                            Mantenimiento: Mantenimiento,
                            Material: Material,
                            Planeacion: Planeacion,
                            Programas: Programas,
                            Setup: Setup,
                            Otros: Otros
                        }
                        ArrayCalculo.push(Datos);
                    }
                } //else
            } //For

            console.table(ArrayCalculo)

            var Tabla = document.getElementById('TablaHistorialMensual').getElementsByTagName('tbody')[0];
            for (let index = 0; index < ArrayCalculo.length; index++) {
                console.table(ArrayCalculo)
                OT = ArrayCalculo[index].OT;
                TotalTMuerto = ArrayCalculo[index].TotalTMuerto;
                Eficiencia = ArrayCalculo[index].Eficiencia;

                Aditamentos = ArrayCalculo[index].Aditamentos;
                Herramienta = ArrayCalculo[index].Herramienta;
                Liberacion = ArrayCalculo[index].Liberacion;
                Luz = ArrayCalculo[index].Luz;
                Mantenimiento = ArrayCalculo[index].Mantenimiento;
                Material = ArrayCalculo[index].Material;
                Planeacion = ArrayCalculo[index].Planeacion;
                Programas = ArrayCalculo[index].Programas;
                Setup = ArrayCalculo[index].Setup;
                Otros = ArrayCalculo[index].Otros;

                let Fila = [OT, Eficiencia, TotalTMuerto, Aditamentos, Herramienta, Liberacion, Luz, Mantenimiento, Material, Planeacion, Programas, Setup, Otros];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < Fila.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + index); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Fila[x]);
                    newCell.appendChild(newText);
                } //fin de for de columnas
            }
            CalcularTotalesMensual();
        } //Funcion success
    }); //Ajax 
}


function CalcularTotalesMensual() {

    var table = document.getElementById('TablaHistorialMensual').getElementsByTagName('tbody')[0];
    var LimiteFilas = table.rows.length;
    let Arreglo = [];
    let TotalTMuerto = 0;
    let Eficiencia = 0;
    let Aditamentos = 0;
    let Herramienta = 0;
    let Liberacion = 0;
    let Luz = 0;
    let Mantenimiento = 0;
    let Material = 0;
    let Planeacion = 0;
    let Programas = 0;
    let Setup = 0;
    let Otros = 0;

    for (let index = 0; index < LimiteFilas; index++) {
        var tabla = document.getElementById("TablaHistorialMensual");
        TotalTMuerto = TotalTMuerto + Math.round(parseInt(tabla.rows[(index + 1)].cells[2].childNodes[0].nodeValue)); //TotalTMuerto
        Eficiencia = Eficiencia + Math.round(parseInt(tabla.rows[(index + 1)].cells[1].childNodes[0].nodeValue)); //Eficiencia
        Aditamentos = Aditamentos + parseInt(tabla.rows[(index + 1)].cells[3].childNodes[0].nodeValue); //Aditamentos
        Herramienta = Herramienta + parseInt(tabla.rows[(index + 1)].cells[4].childNodes[0].nodeValue); //Herramienta
        Liberacion = Liberacion + parseInt(tabla.rows[(index + 1)].cells[5].childNodes[0].nodeValue); //Liberacion
        Luz = Luz + parseInt(tabla.rows[(index + 1)].cells[6].childNodes[0].nodeValue); //Luz
        Mantenimiento = Mantenimiento + parseInt(tabla.rows[(index + 1)].cells[7].childNodes[0].nodeValue); //Mantenimiento
        Material = Material + parseInt(tabla.rows[(index + 1)].cells[8].childNodes[0].nodeValue); //Material
        Planeacion = Planeacion + parseInt(tabla.rows[(index + 1)].cells[9].childNodes[0].nodeValue); //Planeacion
        Programas = Programas + parseInt(tabla.rows[(index + 1)].cells[10].childNodes[0].nodeValue); //Programas
        Setup = Setup + parseInt(tabla.rows[(index + 1)].cells[11].childNodes[0].nodeValue); //Setup
        Otros = Otros + parseInt(tabla.rows[(index + 1)].cells[12].childNodes[0].nodeValue); //Otros
        if (index == (LimiteFilas - 1)) {
            Arreglo = ["", (Eficiencia / LimiteFilas).toFixed(0) + "%", TotalTMuerto, Aditamentos, Herramienta, Liberacion, Luz, Mantenimiento, Material, Planeacion, Programas, Setup, Otros];
        }
    }

    var Tabla = document.getElementById('TablaHistorialMensual').getElementsByTagName('tbody')[0];//inserta una fila al final de la tabla
    var newRow = Tabla.insertRow(Tabla.rows.length);
    for (var x = 0; x < Arreglo.length; x++) {
        // inserta una celda en el indice 0
        var newCell = newRow.insertCell(x);
        newRow.setAttribute("id", "Rows" + "Totales"); //se asigna id al incrementar cada fila +1 para contar el encabezado
        // adjuntar el texto al nodo
        var newText = document.createTextNode(Arreglo[x]);
        newCell.appendChild(newText);
    } //fin de for de columnas
}

function ExcelMensual() {
    var tabla = document.getElementById("TablaHistorialMensual");
    var total = tabla.rows.length //Total de filas
    var sheet_1_data = [];
    for (var j = 0; j <= total - 1; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Eficiencia = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var TotalTMuerto = tabla.rows[j].cells[2].childNodes[0].nodeValue;

        var Aditamentos = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var Herramienta = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Liberacion = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Luz = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Mantenimiento = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Material = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Planeacion = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var ProgramaError = tabla.rows[j].cells[10].childNodes[0].nodeValue;
        var Setup = tabla.rows[j].cells[11].childNodes[0].nodeValue;
        var Otros = tabla.rows[j].cells[12].childNodes[0].nodeValue;

        var Fila = [OT, Eficiencia, TotalTMuerto, Aditamentos, Herramienta, Liberacion, Luz, Mantenimiento, Material, Planeacion, ProgramaError, Setup, Otros]
        sheet_1_data.push(Fila);
    } //fin filas

    console.table(sheet_1_data)
    var opts = [{
        sheetid: 'Sheet One',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("ReporteArticulo.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}



function Excel() {
    if (ReporteActivo == 'ReporteOT') {
        ExcelOT();
    } else {
        ExcelMensual();
    }
}

















