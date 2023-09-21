function InicarFechas() {
    let fechaInicial = new Date()
    //fechaInicial.setDate(fechaInicial.getDate() - 1);
    document.getElementById("inicio").value = moment(fechaInicial).format('YYYY-MM-DD');

    let fechaFinal = new Date()
    fechaFinal.setDate(fechaFinal.getDate() + 1);
    document.getElementById("fin").value = moment(fechaFinal).format('YYYY-MM-DD');

}

function MostrarReporte() {
    var categoria = document.getElementById("Categoria").value;
    var Almacen = document.getElementById("Almacen").value;
    var fechaInicio = document.getElementById("inicio").value;
    var fechafin = document.getElementById("fin").value;
    //alert(fechaInicio);
    $.ajax({
        url: '/TipoReporteHerramental/' + categoria + '|' + fechaInicio + '|' + fechafin + '|' + Almacen,
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            var TotalHerramientas = Herramientas.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
            }
            for (var i = 0; i < TotalHerramientas; i++) {
                var Planta = Herramientas[i].Planta;
                var Clave = Herramientas[i].Clave;
                var Estado = Herramientas[i].Estado || Herramientas[i].Cantidad;
                var OT = Herramientas[i].OT || "-";
                var Nomina = Herramientas[i].Nomina;
                var Empleado = Herramientas[i].Empleado || "-";
                var Familia = Herramientas[i].Familia || "-";
                var Maquina = Herramientas[i].Maquina || "-";
                var Comentario = Herramientas[i].Comentario;
                var Fecha = moment(Herramientas[i].Salida).format('DD-MM-YYYY HH:MM');
                Arreglo = [Planta,Clave,Estado,OT,Nomina,Empleado,Familia,Maquina,Comentario,Fecha]; 

                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
} 


function ExcelReporte() {
    var tabla = document.getElementById("TablaReporte");
    var total = tabla.rows.length //Total de filas

    var sheet_1_data = [];
    for (var j = 0; j <= total - 1; j++) { //filas

        var Planta  = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Clave  = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Estado  = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var OT  = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var Nomina  = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Empleado  = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Familia   = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Maquina  = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Comentario  = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Fecha  = tabla.rows[j].cells[9].childNodes[0].nodeValue;
 
        var Fila = [Planta,Clave,Estado,OT,Nomina,Empleado,Familia,Maquina,Comentario,Fecha]
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Hoja1',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("Reporte.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}


