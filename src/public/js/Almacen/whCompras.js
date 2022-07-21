
function ListaDeCotizaciones() {
    
    $.ajax({
        url: '/ListaDeCotizaciones',
        success: function (Herramientas) {
            //console.table(Herramientas)
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            var TotalHerramientas = Herramientas.length;

            for (var i = 0; i < limite; i++) {
                $("#Rows" + i).remove(); //elimina los elementos con id Rows
            }

            for (var i = 0; i < Herramientas.length; i++) {
                var id = Herramientas[i].id;
                var Clave = Herramientas[i].Clave || '-';
                var Producto = Herramientas[i].Producto;
                var Planta = Herramientas[i].Almacen;
                var StockNuevo = Herramientas[i].Stock;
                var StockUsado = Herramientas[i].StockUsado;
                var StockMinimo = Herramientas[i].StockMin;
                var StockMaximo = Herramientas[i].StockMax;
                var Ubicacion = Herramientas[i].Ubicacion;
                var Categoria = Herramientas[i].Categoria;
                var Familia = Herramientas[i].Familia;
                var Cotizado = Herramientas[i].Cotizado;
                //Eliminar variable dentro del For

                Arreglo = [Clave, Producto, Herramientas[i].Almacen, StockNuevo, StockMinimo, StockMaximo, StockUsado, Ubicacion, Categoria, Familia]
                var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {

                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);
                    if (x == 9) { //Si termina de registrar datos crear el boton
 
                        var newCell = newRow.insertCell(10); //CREAR CELDA 
                        newCell.innerHTML = '<input  type="text" id="Cantidad' + i + '" class="form-control"></input>';

                        var newCell = newRow.insertCell(11); //CREAR CELDA 
                        newCell.innerHTML = '<input  type="text" id="Folio' + i + '" class="form-control"></input>';

                        var newCell = newRow.insertCell(12); //CREAR CELDA 
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-info" name="btn" onclick=Ordenar(' + i+","+(Herramientas[i].id) + ') data-toggle="tooltip" data-placement="top" title="Actualizar linea"> <i class="fas fa-edit"></i> </button>';
                       
                        var newCell = newRow.insertCell(13); //CREAR CELDA 
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-danger" name="btn" onclick=CancelarOrden(' + i+","+(Herramientas[i].id) + ') data-toggle="tooltip" data-placement="top" title="Cancelar Orden"> <i class="fas fa-ban"></i> </button>';
                    }   
                } //fin de for de columnas
            } //fin de for de filas 
        } //Funcion success
    }); //Ajax 
}

function Ordenar(indice, params) {

    let Cantidad = document.getElementById("Cantidad"+indice).value;
    let Folio = document.getElementById("Folio"+indice).value;

    let data = {
        IndiceProducto: params,
        Cantidad: Cantidad,
        Folio: Folio
    }

    $.post("/Ordenar", // url
    {
        data
    }, // data to be submit
    function (objeto, estatus) { // success callback
        //console.log("objeto: " + objeto + "Estatus: " + estatus);
        ListaDeCotizaciones()
    });

}

function CancelarOrden(indice, params) {
    let data = {
        IndiceProducto: params 
    }

    $.post("/CancelarOrden", // url
    {
        data
    }, // data to be submit
    function (objeto, estatus) { // success callback
        //console.log("objeto: " + objeto + "Estatus: " + estatus);
        ListaDeCotizaciones()
    });

}


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

            for (var i = 0; i < Herramientas.length; i++) {
                var Producto = Herramientas[i].Producto;
                var Stock = Herramientas[i].Stock || '-';
                var Almacen = Herramientas[i].Almacen;
                var Cantidad = Herramientas[i].Cantidad;
                var Folio = Herramientas[i].Folio;
                var FechaOrdenado = moment(Herramientas[i].FechaOrdenado).format("DD-MM-YYYY"); 
                //Eliminar variable dentro del For

                Arreglo = [Producto,Stock,Almacen,Cantidad,Folio,FechaOrdenado]
                var TablaAlmacen = document.getElementById('TablaOrdenado').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {

                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "RowsOrdenado" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);
                    if (x == 5) { //Si termina de registrar datos crear el boton 
                        var newCell = newRow.insertCell(6); //CREAR CELDA 
                        newCell.innerHTML = '<input  type="text" id="Recibido' + i + '" class="form-control"></input>';

                        var newCell = newRow.insertCell(7); //CREAR CELDA 
                        newCell.innerHTML = '<input  type="text" id="Factura' + i + '" class="form-control"></input>'; 

                        var newCell = newRow.insertCell(8); //CREAR CELDA 
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-info" name="btn" onclick= ActualizarOrdenar(' + i+","+(Herramientas[i].id) + ') data-toggle="tooltip" data-placement="top" title="Actualizar producto"> <i class="fas fa-edit"></i> </button>';

                        var newCell = newRow.insertCell(9); //CREAR CELDA 
                        newCell.innerHTML = '<button id="CancelarOrden' + i + '" class="btn btn-danger" name="btn" onclick= CancelarOrdenados(' + i+","+(Herramientas[i].id) + ') data-toggle="tooltip" data-placement="top" title="Actualizar producto"> <i class="fas fa-edit"></i> </button>';
                    }   
                } //fin de for de columnas
            } //fin de for de filas 
        } //Funcion success
    }); //Ajax 
}



function ActualizarOrdenar(indice, params) {

    let Recibido = document.getElementById("Recibido"+indice).value;
    let Factura = document.getElementById("Factura"+indice).value;

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



function CancelarOrdenados(indice, params) {
    var tabla = document.getElementById("TablaOrdenado");
    var Producto = tabla.rows[(indice+1)].cells[0].childNodes[0].nodeValue;
    var Almacen = tabla.rows[(indice+1)].cells[2].childNodes[0].nodeValue;

    alert(Producto+Almacen)
    let data = {
        IndiceProducto: params,
        Producto : Producto,
        Almacen: Almacen
    }

    $.post("/CancelarOrdenados", // url
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

            for (var i = 0; i < Herramientas.length; i++) {
                var id = Herramientas[i].id; 
                var Producto = Herramientas[i].Producto;
                var Recibido = Herramientas[i].Recibido; 
                var Almacen = Herramientas[i].Almacen; 
                //Eliminar variable dentro del For

                Arreglo = [Producto,Recibido, Almacen]
                var TablaAlmacen = document.getElementById('TablaRecepcion').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {

                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "RowsRecepcion" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);
                    if (x == 2) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(3); //CREAR CELDA 
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-info" name="btn" onclick=Recolectar(' + i+","+Herramientas[i].idOrdenado+','+Herramientas[i].idAlmacen+","+ Herramientas[i].idRecepcion+ ') data-toggle="tooltip" data-placement="top" title="Actualizar producto"> <i class="fas fa-edit"></i> </button>';
                    }   
                } //fin de for de columnas
            } //fin de for de filas 
        } //Funcion success
    }); //Ajax 
}



function Recolectar(indice, idOrdenado,idAlmacen,idRecepcion) {
    var tabla = document.getElementById("TablaRecepcion"); 

    var Recibido = tabla.rows[(indice+1)].cells[1].childNodes[0].nodeValue;
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
        MostrarRecepcion()
    });   
}







