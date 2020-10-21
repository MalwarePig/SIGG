function MostrarReporte(){
    var categoria = document.getElementById("Categoria").value;
    var Almacen = document.getElementById("Almacen").value;
    var fechaInicio = document.getElementById("inicio").value;
    var fechafin = document.getElementById("fin").value;
    alert(fechaInicio);
    $.ajax({
        url: '/TipoReporte/' + categoria+'|'+fechaInicio+'|'+fechafin+'|'+Almacen,
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            var TotalHerramientas = Herramientas.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove();//elimina los elementos con id Rows
            }
            for (var i = 0; i < TotalHerramientas; i++) {
                var Folio = Herramientas[i].Folio;
                var Producto = Herramientas[i].Producto;
                var Cantidad = Herramientas[i].Entregado || Herramientas[i].Cantidad;
                var Estado = Herramientas[i].Estado;
                var OT = Herramientas[i].OT || "-";
                var Empleado = Herramientas[i].Empleado;
                var Almacen = Herramientas[i].Almacen;
                var Fecha = Herramientas[i].Salida;
                //Eliminar variable dentro del For
                Arreglo = [Folio, Producto, Cantidad, Estado, OT, Empleado, Almacen, Fecha];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows");//se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);
                }//fin de for de columnas
            }//fin de for de filas
        }//Funcion success
    });//Ajax

}