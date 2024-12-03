






































//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
function Buscar() {
    //Limpiar tabla 
    var TablaAlmacen = document.getElementById('tableReporte').getElementsByTagName('tbody')[0];
    var limite = TablaAlmacen.rows.length;
    for (var i = 0; i < limite; i++) {
        $("#Rows" + i).remove(); //elimina los elementos con id Rows
    }


    for (var i = 0; i < 1; i++) {
        var id = "00";
        var Categoria = "Categoria";
        var Articulo = "Articulo";
        var Cantidad = "Cantidad";
        var Estado = "Estado";
        var Fecha = "Fecha";

        Arreglo = [id, Categoria, Articulo, Cantidad, Estado, Fecha]
        // inserta una fila al final de la tabla
        var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
        for (var x = 0; x < Arreglo.length; x++) {

            // inserta una celda en el indice 0
            var newCell = newRow.insertCell(x);
            newRow.setAttribute("id", "Rows" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado

            switch (x) {
                case 0:
                    newCell.innerHTML = '<input required type="text" id="id' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    break;
                case 1:
                    newCell.innerHTML = '<input  type="text" id="Clave' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                    break;
                case 2:
                    console.log(Arreglo[x])
                    newCell.innerHTML = '<input type="text" id="Producto' + i + '" class="form-control"  readonly></input>';
                    const Campo = document.getElementById('Producto' + i); //se renombra el id de la parte colapsador 
                    Campo.value = Arreglo[x];
                    break;
                case 3:
                    var Almacen = "";
                    if (Arreglo[x] == "Almacen Morelos") {
                        Almacen = "Morelos";
                    } else if (Arreglo[x] == "Almacen Bravo") {
                        Almacen = "Bravo";
                    } else {
                        Almacen = "Gaveta";
                    }
                    newCell.innerHTML = '<input  type="text" id="Almacen' + i + '" class="form-control" value="' + Almacen + '" readonly></input>';
                    break;
                case 4:
                    newCell.innerHTML = '<input  type="text" readonly id="StockNuevo' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                    break;
                case 5:
                    newCell.innerHTML = '<input  type="text" id="StockUsado' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                    break;
            }

            if (x == 4) { //Si termina de registrar datos crear el boton
                var newCell = newRow.insertCell(

                ); //CREAR CELDA
                newCell.innerHTML = '<button id="' + i + '" class="btn btn-danger" name="btn" onclick=Eliminar(' + (i + 1) + ') data-toggle="tooltip" data-placement="top" title="Eliminar producto"> <i class="fas fa-trash-alt"></i> </button>';

                var newCell = newRow.insertCell(6); //CREAR CELDA
                newCell.innerHTML = '<button id="' + i + '" class="btn btn-info" name="btn" onclick=ModalAjuste(' + (i + 1) + ') data-toggle="tooltip" data-placement="top" title="Actualizar producto"> <i class="fas fa-edit"></i> </button>';

                var newCell = newRow.insertCell(7); //CREAR CELDA
                newCell.innerHTML = '<button id="ActualizarUsados' + i + '" class="btn btn-success" name="btn" onclick=AjustarUsados(' + (i) + ') data-toggle="tooltip" data-placement="top" title="Actualizar campos"> <i class="fas fa-pen"></i></button>';
            }
        } //fin de for de columnas
    } //fin de for de filas

} //Evento click