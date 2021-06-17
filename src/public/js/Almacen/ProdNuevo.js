//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
function GETPRODUCTS() {
    var Herramientas = Transformer(document.getElementById("BHerramienta").value);
    $.ajax({
        url: '/BuscarHerramientas/' + Herramientas,
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
            }
            if (Herramientas.length == 0) {
                $("#Vacio").modal();
            }
            for (var i = 0; i < Herramientas.length; i++) {
                var Clave = Herramientas[i].Clave;
                var Producto = Herramientas[i].Producto;
                var Stock = Herramientas[i].Stock;
                var StockUsado = Herramientas[i].StockUsado;
                var Ubicacion = Herramientas[i].Ubicacion;
                var Almacen = Herramientas[i].Almacen;
                //Eliminar variable dentro del For
                Arreglo = [Clave, Producto, Stock, StockUsado, Ubicacion, Almacen]
                var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
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
} //Evento clic

//Intercambiar el diagonal por otro simbolo para no tener problemas con el url
function Transformer(variable) {
    var Herramienta = "";
    for (var q = 0; q < variable.length; q++) {
        if (variable.charAt(q) == '/') {
            Herramienta += '|';
        } else {
            Herramienta += variable.charAt(q);
        }
    }
    return Herramienta;
}

//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
function runScript(e) {
    if (e.keyCode == 13) {
        GETPRODUCTS();
    }
}

//Mostrar Modal - Nuevo Articulo
function modal() {
    $("#ModalNuevoPro").modal();
}


//=========================================== Guardar producto nuevo =================================================//
function GuardarNota() {
    var Clave = document.getElementById("Clave").value;
    var Producto = document.getElementById("Producto").value;
    var Almacen = document.getElementById("Almacen").value;
    var Stock = document.getElementById("Stock").value;
    var StockMin = document.getElementById("StockMin").value;
    var StockMax = document.getElementById("StockMax").value;
    var StockUsado = document.getElementById("StockUsado").value;
    var Ubicacion = document.getElementById("Ubicacion").value;
    var Categoria = document.getElementById("Categoria").value;
    var Familia = document.getElementById("Familia").value;

    var Tabla = [Clave, Producto, Almacen, Stock, StockMin, StockMax, StockUsado, Ubicacion,Categoria,Familia];
 
    $.post("/addNuevoProducto", // url
        {
            Tabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });
        document.getElementById("FormNuevoPro").reset();
   
}

function CargarCategorias(indice) {
    var listCategoria = document.getElementById("Categoria"+indice);
    let Categorias = ['A','B','C'];
    for (let i = listCategoria.options.length; i >= 0; i--) { //Borrar elementos option de select
        listCategoria.remove(i);
    }

    for (var i = 0; i < Categorias.length; i++) { //Agregar nuevos options del select

        var option = document.createElement("option");
        option.text = Categorias[i];
        listCategoria.add(option);
    }
}

function CargarFamilias() {
    var listFamilia = document.getElementById("Familia");
    let FamiliasMorelos = ['Torno','Centro maquinado','Endmills','Machuelos','Rimas','Brocas','Produccion','Seguridad','Embarque','Acabado','Mantenimiento','ULINE','Otros']
    let FamiliasBravo = ['John Deere','Nidec','Nidec ACEM','Tornos Ch ACME','Tornos','Centro maquinado','Machuelos','Endmills','Rimas','Brocas','Produccion','Embarque','Seguridad','Acabado','Mantenimiento']
    let PlantaSeleccionada = "";
    document.getElementById("Almacen").value == 'Almacen Morelos' ? PlantaSeleccionada = "Morelos" : PlantaSeleccionada = "Bravo";
    for (let i = listFamilia.options.length; i >= 0; i--) { //Borrar elementos option de select
        listFamilia.remove(i);
    }

    for (var i = 0; i < FamiliasMorelos.length; i++) { //Agregar nuevos options del select

        var option = document.createElement("option");
        option.text = PlantaSeleccionada == 'Morelos' ? FamiliasMorelos[i] : FamiliasBravo[i];
        listFamilia.add(option);
    }    
}