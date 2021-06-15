function CargarAlmacen() {
    var listPlantas = document.getElementById("Almacen");
    let Plantas = ['Todo', 'Bravo', 'Morelos'];
    for (let i = listPlantas.options.length; i >= 0; i--) { //Borrar elementos option de select
        listPlantas.remove(i);
    }

    for (var i = 0; i < Plantas.length; i++) { //Agregar nuevos options del select
        var option = document.createElement("option");
        option.text = Plantas[i];
        listPlantas.add(option);
    }

    //Limpiar Famlias
    var listFamilia = document.getElementById("Familia");
    for (let i = listFamilia.options.length; i >= 0; i--) { //Borrar elementos option de select
        listFamilia.remove(i);
    }
    var option = document.createElement("option");
    option.text = "seleccione la familia";
    option.selected;
    option.disabled;
    listFamilia.add(option);
}


function CargarCategorias() {
    var listCategoria = document.getElementById("Categoria");
    let Categorias = ['A', 'B', 'C'];
    for (let i = listCategoria.options.length; i >= 0; i--) { //Borrar elementos option de select
        listCategoria.remove(i);
    }

    var option = document.createElement("option");
    option.text = "Todo";
    listCategoria.add(option);

    for (var i = 0; i < Categorias.length; i++) { //Agregar nuevos options del select

        var option = document.createElement("option");
        option.text = Categorias[i];
        listCategoria.add(option);
    }
}

function CargarFamilias() {
    var listFamilia = document.getElementById("Familia");
    var Almacen = document.getElementById("Almacen").value;
    let FamiliasMorelos = ['Torno', 'Centro maquinado', 'Endmills', 'Machuelos', 'Rimas', 'Brocas', 'Produccion', 'Seguridad', 'Embarque', 'Acabado', 'Mantenimiento', 'ULINE', 'Otros']
    let FamiliasBravo = ['John Deere', 'Nidec', 'Nidec ACEM', 'Tornos Ch ACME', 'Tornos', 'Centro maquinado', 'Machuelos', 'Endmills', 'Rimas', 'Brocas', 'Produccion', 'Embarque', 'Seguridad', 'Acabado', 'Mantenimiento']

    for (let i = listFamilia.options.length; i >= 0; i--) { //Borrar elementos option de select
        listFamilia.remove(i);
    }

    var option = document.createElement("option");
    option.text = "Todo";
    listFamilia.add(option);
    for (var i = 0; i < FamiliasMorelos.length; i++) { //Agregar nuevos options del select

        var option = document.createElement("option");
        option.text = Almacen == 'Morelos' ? FamiliasMorelos[i] : FamiliasBravo[i];
        listFamilia.add(option);
    }
}




function MostrarReporte() {
    var Categoria = document.getElementById("Categoria").value;
    var Almacen = document.getElementById("Almacen").value;
    var Familia = document.getElementById("Familia").value;

    $.ajax({
        url: '/ExistenciaTotalAlmacen/' + Almacen + '|' + Categoria + '|' + Familia,
        success: function (Herramientas) {
            //console.table(Herramientas)
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            var TotalHerramientas = Herramientas.length;

            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
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
                //Eliminar variable dentro del For

                Arreglo = [Clave, Producto, Herramientas[i].Almacen, StockNuevo, StockUsado, StockMinimo, StockMaximo, Ubicacion, Categoria, Familia]
                var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {

                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);
                } //fin de for de columnas
            } //fin de for de filas



        } //Funcion success
    }); //Ajax
}




function ExportarExcel() {
    var tabla = document.getElementById("TablaReporte");
    var total = tabla.rows.length //Total de filas


    var sheet_1_data = [];
    for (var j = 0; j <= (total - 1); j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;

        var Clave = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Producto = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Almacen = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Stock = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var StockMin = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var StockMax = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var StockUsado = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Ubicacion = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Categoria = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Familia = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var Fila = [Clave, Producto, Almacen, Stock, StockMin, StockMax, StockUsado, Ubicacion, Categoria, Familia]
        console.log((total - 1))
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Hoja1',
       
    }];
    var result = alasql('SELECT * INTO XLSX("Reporte.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}