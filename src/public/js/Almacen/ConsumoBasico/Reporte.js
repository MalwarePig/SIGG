

function MostrarReporteHerramienta() {
    /* var Herramienta = Transformer(document.getElementById("BHerramienta").value); */
    var Almacen = document.getElementById("Almacen").value;

    var fechaInicio = document.getElementById("inicio").value;
    var fechafin = document.getElementById("fin").value;


    if (fechaInicio == '' || fechafin == '') {
        alert("Error en el rango de fechas")
    } else {

        /*Limpiar tabla*/
        var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
        var limite = TablaAlmacen.rows.length;
        for (var i = 0; i < limite; i++) {
            $("#Rows").remove(); //elimina los elementos con id Rows
        }

        $.ajax({
            url: '/ReporteConsumoBasico/' + fechaInicio + '|' + fechafin + '|' + Almacen,
            success: function (Herramientas) {

                if (!Herramientas.length) {
                    alert("No se encontraron datos en la consulta")
                }
                var Arreglo = [];
                //Limpiar tabla 
                var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
                var limite = TablaAlmacen.rows.length;//Eestablece el limite
                var TotalHerramientas = Herramientas.length;
                for (var i = 0; i < limite; i++) {
                    $("#Rows").remove(); //elimina los elementos con id Rows
                }
                for (var i = 0; i < TotalHerramientas; i++) {
                    var Clave = Herramientas[i].Clave;
                    var Familia = Herramientas[i].Familia;
                    var Almacen = Herramientas[i].Almacen;
                    var Producto = Herramientas[i].Producto;
                    var Total = Herramientas[i].Total;
                    var Stock = Herramientas[i].Stock;
                    var StockMin = Herramientas[i].StockMin;
                    var StockMax = Herramientas[i].StockMax;
                    var StockUsado = Herramientas[i].StockUsado;
                    var StockAfilado = Herramientas[i].StockAfilado;
                    var Precio = Herramientas[i].Precio;
                    var Moneda = Herramientas[i].Moneda;
                    var OC = Herramientas[i].OC;
                    var Proveedor = Herramientas[i].Proveedor;
                    var TiempoEntrega = Herramientas[i].TiempoEntrega;
                    //Eliminar variable dentro del For
                    Arreglo = [Clave, Familia, Almacen, Producto, Total, Stock, StockMin, StockMax, StockUsado,StockAfilado,TiempoEntrega, OC, Proveedor, Precio, Moneda];
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
}


function ExcelReporte() {
    var tabla = document.getElementById("TablaReporte");
    var total = tabla.rows.length //Total de filas 
    var sheet_1_data = [];
    for (var j = 0; j <= total - 1; j++) { //filas 

        var Clave = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Familia = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Almacen = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Producto = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var Total = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Stock = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var StockMin = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var StockMax = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var StockUsado = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var StockAfilado = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var TiempoEntrega = tabla.rows[j].cells[10].childNodes[0].nodeValue;
        var OC = tabla.rows[j].cells[11].childNodes[0].nodeValue;
        var Proveedor = tabla.rows[j].cells[12].childNodes[0].nodeValue; 
        var Precio = tabla.rows[j].cells[13].childNodes[0].nodeValue;
        var Moneda = tabla.rows[j].cells[14].childNodes[0].nodeValue; 

        var Fila = [Clave, Familia, Almacen, Producto, Total, Stock, StockMin, StockMax, StockUsado,StockAfilado, TiempoEntrega, OC, Proveedor, Precio, Moneda]
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Hoja1',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("Reporte.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}