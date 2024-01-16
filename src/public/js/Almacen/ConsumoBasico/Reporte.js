

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

                if(!Herramientas.length){
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
                    var Precio = Herramientas[i].Precio;
                    var Moneda = Herramientas[i].Moneda;
                    var OC = Herramientas[i].OC;
                    var Proveedor = Herramientas[i].Proveedor;
                    var TiempoEntrega = Herramientas[i].TiempoEntrega;
                    //Eliminar variable dentro del For
                    Arreglo = [Clave, Familia, Almacen, Producto,Total, Stock, StockMin, StockMax, StockUsado, Precio, Moneda, OC, Proveedor,TiempoEntrega];
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