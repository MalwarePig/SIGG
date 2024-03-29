/* El 30% de 150 hay que multiplicar 150 por 30 y, después, dividir el resultado por 100. */
 
function MostrarReporte() { 
    //alert(fechaInicio);
    $.ajax({
        url: '/MinCritico/' ,
        success: function (Herramientas) { 
            var Arreglo = [];
            //Limpiar tabla 
             var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            var TotalHerramientas = Herramientas.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
            }
            //proveedor (primario),  precio/ moneda / OC...Lo ideal seria que pusiera el consumo del ultimo mes, con eso sacamos todo
            for (var i = 0; i < TotalHerramientas; i++) {
                var Clave = Herramientas[i].Clave || "-"; 
                var Producto = Herramientas[i].Producto || "-"; 
                var Proveedor = Herramientas[i].Proveedor || "-"; 
                var Precio = Herramientas[i].Precio || "-"; 
                var Moneda = Herramientas[i].Moneda || "-"; 
                var OC = Herramientas[i].OC || "-"; 
                var Almacen = Herramientas[i].Almacen || "-"; 
                var Familia = Herramientas[i].Familia || "-"; 
                var Stock = Herramientas[i].Stock || 0; 
                var StockUsado = Herramientas[i].StockUsado || 0; 
                var Minimo = Herramientas[i].StockMin || "-"; 
                var Maximo = Herramientas[i].StockMax || "-"; 

                Arreglo = [Clave,Producto,Proveedor,Precio,Moneda,OC,Almacen,Familia,Stock,StockUsado,Minimo,Maximo];

                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    if (x == 10) {
                        newCell.style.backgroundColor="#ffc432"//amarillo 
                    }else if (x == 11) {
                        newCell.style.backgroundColor="#96ffb9" //verde
                    }else if (x == 8) {
                        newCell.style.backgroundColor="#ff5e5e" 
                    }
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
        var Clave = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Producto = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Almacen = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Familia = tabla.rows[j].cells[3].childNodes[0].nodeValue; 
        var Stock = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Usado = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Minimo = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Maximo = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Fila = [Clave,Producto,Almacen,Familia,Stock,Usado,Minimo,Maximo]
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Hoja1',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("Reporte.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}
 



function Pruebas() {
    // Obtén la referencia a la tabla
    var tabla = document.getElementById("TablaReporte");
    var limite = tabla.rows.length;
    //  var TotalHerramientas = Herramientas.length;
    for (var i = 0; i <= limite; i++) {
        //Producto a buscar
        var Producto = tabla.rows[(i + 1)].cells[1].childNodes[0].nodeValue; //Obtiene el valor de Producto
         
        var Herramientas = Tranformer(Producto);
        $.ajax({
            url: '/BuscarHerramienta/' + Herramientas,
            success: function (data) {
                console.log(i)

                // Obtén la referencia a la fila a la que deseas agregar la celda (por ejemplo, la segunda fila)
                var fila = tabla.rows[(i + 1)];

                // Crea una nueva celda y asigna el contenido que desees
                var nuevaCelda = fila.insertCell();
                // Agrega contenido a la nueva celda
                nuevaCelda.innerHTML = i + data;
            } //Funcion success
        }); //Ajax 
    }
}


function Tranformer(variable) {
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