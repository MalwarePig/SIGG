var AreaActual = localStorage.getItem("Area")
var PlantaGeneral = localStorage.getItem("PlantaGeneral")

//Leer Ordenado
function ConsultaOrdenado() {
 
    $.ajax({
        url: '/ListaDeOrdenes',
        success: function (Herramientas) {
            //console.table(Herramientas)
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('TablaOrdenado').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            var TotalHerramientas = Herramientas.length;



            for (var i = 0; i < limite; i++) {
                $("#RowsOrdenado" + i).remove(); //elimina los elementos con id Rows
            }

            let IndiceFila = 0;
            for (var i = 0; i < Herramientas.length; i++) {
                var Producto = Herramientas[i].Producto;
                var Stock = Herramientas[i].Stock || '-';
                var Almacen = Herramientas[i].Almacen;
                var Cantidad = Herramientas[i].Cantidad;
                var Folio = Herramientas[i].Folio;
                var FechaOrdenado = moment(Herramientas[i].FechaOrdenado).format("DD-MM-YYYY");
                //Substraer registro por planta
                if (Almacen == ('Almacen ' + PlantaGeneral)) {
                    Arreglo = [Producto, Stock, Almacen, Cantidad, Folio, FechaOrdenado]
                    var TablaAlmacen = document.getElementById('TablaOrdenado').getElementsByTagName('tbody')[0];
                    // inserta una fila al final de la tabla
                    var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                    for (var x = 0; x < Arreglo.length; x++) {

                        // inserta una celda en el indice 0
                        var newCell = newRow.insertCell(x);
                        newRow.setAttribute("id", "RowsOrdenado" + IndiceFila); //se asigna id al incrementar cada fila +1 para contar el encabezado
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                        if (x == 5) { //Si termina de registrar datos crear el boton 
                            var newCell = newRow.insertCell(6); //CREAR CELDA 
                            newCell.innerHTML = '<input  type="text" id="Recibido' + IndiceFila + '" class="form-control"></input>';

                            var newCell = newRow.insertCell(7); //CREAR CELDA 
                            newCell.innerHTML = '<input  type="text" id="Factura' + IndiceFila + '" class="form-control"></input>';

                            var newCell = newRow.insertCell(8); //CREAR CELDA 
                            newCell.innerHTML = '<button id="' + i + '" class="btn btn-info" name="btn" onclick= ActualizarOrdenar(' + IndiceFila + "," + (Herramientas[i].id) + ') data-toggle="tooltip" data-placement="top" title="Actualizar producto"> <i class="fas fa-edit"></i> </button>';
                        }
                    } //fin de for de columnas
                    IndiceFila++;
                }
               


            } //fin de for de filas 
        } //Funcion success
    }); //Ajax 
}


function ActualizarOrdenar(indice, params) {

    let Recibido = document.getElementById("Recibido" + indice).value;
    let Factura = document.getElementById("Factura" + indice).value;

    let data = {
        IndiceProducto: params,
        Recibido: Recibido,
        Factura: Factura
    }

    $.post("/ActualizarOrdenar", // url
        {
            data
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
            ConsultaOrdenado()
        });
}


function MostrarRecepcion() {

    $.ajax({
        url: '/MostrarRecepcion',
        success: function (Herramientas) {
            //console.table(Herramientas)
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('TablaRecepcion').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            var TotalHerramientas = Herramientas.length;

            for (var i = 0; i < limite; i++) {
                $("#RowsRecepcion" + i).remove(); //elimina los elementos con id Rows
            }
            let IndiceFila = 0
            for (var i = 0; i < Herramientas.length; i++) {
                var id = Herramientas[i].id;
                var Producto = Herramientas[i].Producto;
                var Recibido = Herramientas[i].Recibido;
                var Almacen = Herramientas[i].Almacen;
                //Eliminar variable dentro del For 
                Arreglo = [Producto, Recibido, Almacen]

                if(Almacen == ('Almacen ' + PlantaGeneral)){
                    var TablaAlmacen = document.getElementById('TablaRecepcion').getElementsByTagName('tbody')[0];
                    // inserta una fila al final de la tabla
                    var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                    for (var x = 0; x < Arreglo.length; x++) {
    
                        // inserta una celda en el indice 0
                        var newCell = newRow.insertCell(x);
                        newRow.setAttribute("id", "RowsRecepcion" + IndiceFila); //se asigna id al incrementar cada fila +1 para contar el encabezado
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                        if (x == 2) { //Si termina de registrar datos crear el boton
                            var newCell = newRow.insertCell(3); //CREAR CELDA 
                            newCell.innerHTML = '<button id="' + IndiceFila + '" class="btn btn-info" name="btn" onclick=Recolectar(' + IndiceFila + "," + Herramientas[i].idOrdenado + ',' + Herramientas[i].idAlmacen + "," + Herramientas[i].idRecepcion + ') data-toggle="tooltip" data-placement="top" title="Actualizar producto"> <i class="fas fa-edit"></i> </button>';
                        }
                    } //fin de for de columnas
                    IndiceFila++
                } 
                
            } //fin de for de filas 
        } //Funcion success
    }); //Ajax 
}



function Recolectar(indice, idOrdenado, idAlmacen, idRecepcion) {
    var tabla = document.getElementById("TablaRecepcion");

    var Recibido = tabla.rows[(indice + 1)].cells[1].childNodes[0].nodeValue;
    let data = {
        Recibido: Recibido,
        idAlmacen: idAlmacen,
        idOrdenado: idOrdenado,
        idRecepcion: idRecepcion
    }

    $.post("/RecolectarAlmacen", // url
        {
            data
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
            if(objeto == true){
                MostrarRecepcion()
            }else{
                alert("error")
            } 
        });
}
