function InicarFechas() {
    let fechaInicial = new Date()
    //fechaInicial.setDate(fechaInicial.getDate() - 1);
    document.getElementById("inicio").value= moment(fechaInicial).format('YYYY-MM-DD');

    let fechaFinal = new Date()
    fechaFinal.setDate(fechaFinal.getDate() + 1);
    document.getElementById("fin").value= moment(fechaFinal).format('YYYY-MM-DD');
       
}

function MostrarReporte() {
    
    var Almacen = document.getElementById("Almacen").value;
    var fechaInicio = document.getElementById("inicio").value;
    var fechafin = document.getElementById("fin").value;
    //alert(fechaInicio);
    $.ajax({
        url: '/repRecolectarBasico/' + fechaInicio + '|' + fechafin + '|' + Almacen,
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
                var Usuario = Herramientas[i].Usuario;
                var Producto = Herramientas[i].Producto;
                var Planta = Herramientas[i].Planta;
                var CantidadAnterior = Herramientas[i].CantidadAnterior;
                var CantidadIngreso = Herramientas[i].CantidadIngreso;
                var CantidadActual = Herramientas[i].CantidadActual; 
                var Fecha = moment(Herramientas[i].Fecha).format('DD-MM-YYYY') ;
                var Razon = Herramientas[i].Razon;
                //Eliminar variable dentro del For
                Arreglo = [Usuario,Producto,Planta,CantidadAnterior,CantidadIngreso,CantidadActual,Fecha];
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
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;

        var Responsable = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Producto = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Planta = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Anterior = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var ingreso = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Final = tabla.rows[j].cells[5].childNodes[0].nodeValue; 
        var Fecha = tabla.rows[j].cells[6].childNodes[0].nodeValue; 
        var Fila = [Responsable,Producto,Planta,Anterior,ingreso,Final,Fecha]
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Hoja1',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("Reporte.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}


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
 
//Clave,Producto,almacen,Stock,StockMin,StockMax,StockUsado,Ubicacion
function ExistenciasAlmacen() {
    $.ajax({
        url: '/ExistenciasAlmacenBasico/',
        success: function (Herramientas) {
            var TotalHerramientas = Herramientas.length;
console.log(Herramientas)
            var sheet_1_data = [['Clave','Producto','almacen','Stock','StockMin','StockMax','StockUsado']];
 
            for (var i = 0; i < TotalHerramientas; i++) {
                var Clave = Herramientas[i].Clave;
                var Producto = Herramientas[i].Producto;
                var almacen = Herramientas[i].almacen;
                var Stock = Herramientas[i].Stock;
                var StockMin = Herramientas[i].StockMin;
                var StockMax = Herramientas[i].StockMax;
                var StockUsado = Herramientas[i].StockUsado; 

                var Fila = [Clave, Producto, almacen, Stock, StockMin, StockMax, StockUsado];
 
                sheet_1_data.push(Fila);
            } //fin de for de filas
          
            var opts = [{
                sheetid: 'Hoja1',
                header: false
            }];
            var result = alasql('SELECT * INTO XLSX("Reporte.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
        } //Funcion success
    }); //Ajax
}