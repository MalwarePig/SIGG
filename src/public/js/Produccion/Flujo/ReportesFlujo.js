function HistorialMensual() {
    var tabla = document.getElementById("TablaHistorial");
    var total = tabla.rows.length //Total de filas

    var sheet_1_data = [];
    for (var j = 0; j < total; j++) { //filas

        var N = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Parte = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Cantidad = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Recibido = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var Enviados = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Maquina = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Planta = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Servicios = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Area = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Origen = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var Registro = tabla.rows[j].cells[10].childNodes[0].nodeValue;
        var Aceptado = tabla.rows[j].cells[11].childNodes[0].nodeValue;
        var Terminado = tabla.rows[j].cells[12].childNodes[0].nodeValue;
        var Vencimiento = tabla.rows[j].cells[13].childNodes[0].nodeValue;
        var Tiempo = tabla.rows[j].cells[14].childNodes[0].nodeValue;


        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Historial',
        header: false
    }];
    var result = alasql('SELECT * INTO XLSX("Historial-' + OT + '.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}



function HistorialExcel() {
    var tabla = document.getElementById("TablaHistorial");
    var total = tabla.rows.length //Total de filas

    var sheet_1_data = [];
    for (var j = 1; j < total; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
        var Fila = {
            N: tabla.rows[j].cells[0].childNodes[0].nodeValue,
            OT: tabla.rows[j].cells[1].childNodes[0].nodeValue,
            Parte: tabla.rows[j].cells[2].childNodes[0].nodeValue,
            Cantidad: tabla.rows[j].cells[3].childNodes[0].nodeValue,
            Recibido: tabla.rows[j].cells[4].childNodes[0].nodeValue,
            Enviados: tabla.rows[j].cells[5].childNodes[0].nodeValue,
            Maquina: tabla.rows[j].cells[6].childNodes[0].nodeValue,
            Planta: tabla.rows[j].cells[7].childNodes[0].nodeValue,
            Servicios: tabla.rows[j].cells[8].childNodes[0].nodeValue,
            Area: tabla.rows[j].cells[9].childNodes[0].nodeValue,
            Origen: tabla.rows[j].cells[10].childNodes[0].nodeValue,
            Registro: tabla.rows[j].cells[11].childNodes[0].nodeValue,
            Aceptado: tabla.rows[j].cells[12].childNodes[0].nodeValue,
            Terminado: tabla.rows[j].cells[13].childNodes[0].nodeValue,
            Vencimiento: tabla.rows[j].cells[14].childNodes[0].nodeValue,
            Tiempo: tabla.rows[j].cells[15].childNodes[0].nodeValue,
            Fila: tabla.rows[j].cells[16].childNodes[0].nodeValue
        }
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Historial',
        header: false
    }];
    var result = alasql('SELECT * INTO XLSX("Historial-' + OT + '.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}


/*
function FlujoActivoExcel() {
    var tabla = document.getElementById("Tabla");
    var total = tabla.rows.length //Total de filas

    var sheet_1_data = [];
    for (var j = 0; j < total; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
        var Entrada = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Fecha_vencimiento = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Parte = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Maquina = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var Cliente = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Servicio_In = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Origen = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Cantidad_OT  = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Recibido = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Enviados = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var Stock = tabla.rows[j].cells[10].childNodes[0].nodeValue;
        var PNC = tabla.rows[j].cells[11].childNodes[0].nodeValue;
        
        var Fila = [Entrada,Fecha_vencimiento,OT,Parte,Maquina,Cliente,Servicio_In,Origen,Cantidad_OT,Recibido,Enviados,Stock,PNC]
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Historial',
        header: false
    }];
    var result = alasql('SELECT * INTO XLSX("Flujo activo.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}
*/

function FlujoActivoExcel() {
    var tabla = document.getElementById("Tabla");
    var total = tabla.rows.length //Total de filas

    var sheet_1_data = [];
    for (var j = 1; j < total; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
        var Fila = {
            Entrada: tabla.rows[j].cells[0].childNodes[0].nodeValue,
            Fecha_vencimiento: tabla.rows[j].cells[1].childNodes[0].nodeValue,
            OT: tabla.rows[j].cells[2].childNodes[0].nodeValue,
            Parte: tabla.rows[j].cells[3].childNodes[0].nodeValue,
            Maquina: tabla.rows[j].cells[4].childNodes[0].nodeValue,
            Cliente: tabla.rows[j].cells[5].childNodes[0].nodeValue,
            Servicio_In: tabla.rows[j].cells[6].childNodes[0].nodeValue,
            Origen: tabla.rows[j].cells[7].childNodes[0].nodeValue,
            Cantidad_OT: tabla.rows[j].cells[8].childNodes[0].nodeValue,
            Recibido: tabla.rows[j].cells[9].childNodes[0].nodeValue,
            Enviados: tabla.rows[j].cells[10].childNodes[0].nodeValue,
            Stock: tabla.rows[j].cells[11].childNodes[0].nodeValue,
            PNC: tabla.rows[j].cells[12].childNodes[0].nodeValue
        }
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Historial',
        header: false
    }];
    var result = alasql('SELECT * INTO XLSX("Flujo activo.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}


//=========================================== Total Registros por area =================================================//

function RegistrosArea() {
    let FechaInicio = document.getElementById("Registros_inicio").value;
    let FechaFin = document.getElementById("Registros_fin").value;
    let AreaSeleccionada = document.getElementById("ListAreaRegistros").value;

    $.ajax({
        url: '/RegistrosArea/' + FechaInicio + '|' + FechaFin + '|' + AreaSeleccionada,
        success: function (Data) {

            let TotalRegistros = Data.length
            var sheet_1_data = [];
            /* let Cabezera = {
                id: 'id',
                OT: 'OT',
                Parte: 'Parte',
                CantOT: 'CantOT',
                Maquina: 'Maquina',
                Registro: 'Fecha Registro',
                Inicio: 'Fecha Inicio',
                Terminado: 'Fecha Terminado',
                Vencimiento: 'Vencimiento',
                Recibido: 'Recibido',
                Enviadas: 'Enviadas',
                usuario:'usuario'
            } */
          /*   let Cabezera = [ 'id', 'OT', 'Parte', 'CantOT', 'Maquina', 'Fecha Registro', 'Fecha Inicio', 'Fecha Terminado', 'Vencimiento', 'Recibido', 'Enviadas', 'usuario'    ]
            sheet_1_data.push(Cabezera); */
            for (var j = 0; j < TotalRegistros; j++) { //filas 
                var Fila = {
                    id: Data[j].id,
                    OT: Data[j].OT,
                    Parte: Data[j].Parte,
                    CantOT: Data[j].CantOt,
                    Maquina: Data[j].Maquina,
                    FechaRegistro: moment(Data[j].FechaRegistro).format('YYYY/MM/DD HH:mm') || 'N/A',
                    FechaInicio: moment(Data[j].FechaInicio).format('YYYY/MM/DD HH:mm') || 'N/A',
                    FechaTerminado: Data[j].FechaTerminado,
                    Vencimiento: Data[j].Vencimiento,
                    Recibido: Data[j].Recibido,
                    Enviadas: Data[j].Enviadas,
                    usuario: Data[j].usuario,
                }

                console.log(Fila)
                sheet_1_data.push(Fila);
            } //fin filas

            var opts = [{
                sheetid: 'Historial',
                header: false
            }];
            var result = alasql('SELECT * INTO XLSX("Flujo activo.xlsx",?) FROM ?', [opts, [sheet_1_data]]); 
        } //Funcion success
    }); //Ajax

}