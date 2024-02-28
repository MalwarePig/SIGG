function InicarFechas() {
    let fechaInicial = new Date()
    //fechaInicial.setDate(fechaInicial.getDate() - 1);
    document.getElementById("inicio").value = moment(fechaInicial).format('YYYY-MM-DD');

    let fechaFinal = new Date()
    fechaFinal.setDate(fechaFinal.getDate() + 1);
    document.getElementById("fin").value = moment(fechaFinal).format('YYYY-MM-DD');

}

function MostrarReporte() {
    var categoria = document.getElementById("Categoria").value;
    var Almacen = document.getElementById("Almacen").value;
    var fechaInicio = document.getElementById("inicio").value;
    var fechafin = document.getElementById("fin").value;
    //alert(fechaInicio);
    $.ajax({
        url: '/TipoReporte/' + categoria + '|' + fechaInicio + '|' + fechafin + '|' + Almacen,
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
                var Folio = Herramientas[i].Folio;
                var Producto = Herramientas[i].Producto;
                var Cantidad = Herramientas[i].Entregado || Herramientas[i].Cantidad;
                var Devuelto = Herramientas[i].Devuelto || "-";
                var Estado = Herramientas[i].Estado;
                var OT = Herramientas[i].OT || "-";
                var Maquina = Herramientas[i].Maquina;
                var Empleado = Herramientas[i].Empleado;
                var Almacen = Herramientas[i].Almacen;
                var Fecha = moment(Herramientas[i].Salida).format('DD-MM-YYYY HH:MM');
                var Comentarios = Herramientas[i].Comentarios;
                var Utilizado = Herramientas[i].Utilizado || "-";
                var Despachado = Herramientas[i].Despachado | "-";
                //Eliminar variable dentro del For
                if (categoria == 'itemprestado') {
                    Arreglo = [Folio, Producto, Cantidad,Devuelto,Utilizado, Estado, OT, Maquina, Empleado, Almacen, Fecha, Comentarios];
                }else{
                    Arreglo = [Folio, Producto, Despachado,Cantidad,Utilizado, Estado, OT, Maquina, Empleado, Almacen, Fecha, Comentarios];
                }

                
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

function MostrarReporteHerramienta() {
    var Herramienta = Transformer(document.getElementById("BHerramienta").value);
    var Almacen = document.getElementById("Almacen").value;
    
    var fechaInicio = document.getElementById("inicio").value;
    var fechafin = document.getElementById("fin").value;

    /*Limpiar tabla*/ 
    var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
    var limite = TablaAlmacen.rows.length;
    for (var i = 0; i < limite; i++) {
        $("#Rows").remove(); //elimina los elementos con id Rows
    }
    
        $.ajax({
            url: '/TipoReporteHerramienta/' + Herramienta + '|' + fechaInicio + '|' + fechafin + '|' + Almacen,
            success: function (Herramientas) {
                console.log(Herramientas)
                var Arreglo = [];
                //Limpiar tabla 
                var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
                var limite = TablaAlmacen.rows.length;
                var TotalHerramientas = Herramientas.length;
                for (var i = 0; i < limite; i++) {
                    $("#Rows").remove(); //elimina los elementos con id Rows
                }
                for (var i = 0; i < TotalHerramientas; i++) {
                    var Folio = Herramientas[i].Folio;
                    var Producto = Herramientas[i].Producto;
                    var Cantidad =  Herramientas[i].Entregado || Herramientas[i].Cantidad;
                    var Estado = Herramientas[i].Estado;
                    var OT = Herramientas[i].OT || "-";
                    var Maquina = Herramientas[i].Maquina;
                    var Empleado = Herramientas[i].Empleado;
                    var Almacen = Herramientas[i].Almacen; 
                    var Fecha = moment(Herramientas[i].Salida).format('DD-MM-YYYY');
                    var OC = Herramientas[i].OC;
                    var FechaRegistro = moment(Herramientas[i].FechaRegistro).format('DD-MM-YYYY');
                    var FechaIngreso = moment(Herramientas[i].FechaIngreso).format('DD-MM-YYYY');

                    //Eliminar variable dentro del For
                    Arreglo = [Folio, Producto, Cantidad, Estado, OT, Maquina, Empleado, Almacen, Fecha,OC,FechaIngreso];
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

function MostrarReporteHerramientaAdmin() {
    var Herramienta = Transformer(document.getElementById("BHerramienta").value);
    var Almacen = document.getElementById("Almacen").value;
    
    var fechaInicio = document.getElementById("inicio").value;
    var fechafin = document.getElementById("fin").value;

    /*Limpiar tabla*/ 
    var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
    var limite = TablaAlmacen.rows.length;
    for (var i = 0; i < limite; i++) {
        $("#Rows").remove(); //elimina los elementos con id Rows
    }
    
        $.ajax({
            url: '/TipoReporteHerramientaAdmin/' + Herramienta + '|' + fechaInicio + '|' + fechafin + '|' + Almacen,
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
                    var Folio = Herramientas[i].Folio;
                    var Producto = Herramientas[i].Producto;
                    var Cantidad =  Herramientas[i].Entregado.toString() || Herramientas[i].Cantidad;
                    var Precio = parseFloat(Herramientas[i].precio).toFixed(2).toString() || 0;
                    var Estado = Herramientas[i].Estado;
                    var OT = Herramientas[i].OT || "-";
                    var Maquina = Herramientas[i].Maquina;
                    var Empleado = Herramientas[i].Empleado;
                    var Almacen = Herramientas[i].Almacen;
                    var Fecha = moment(Herramientas[i].Salida).format('DD-MM-YYYY HH:MM');

                    //Eliminar variable dentro del For
                    Arreglo = [Folio, Producto, Cantidad,Precio, Estado, OT, Maquina, Empleado, Almacen, Fecha];
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


 
function ExcelReporteArticuloOT() {
    var tabla = document.getElementById("TablaReporte");
    var total = tabla.rows.length //Total de filas


    var sheet_1_data = [];
    for (var j = 0; j <= total - 1; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;

        var Folio = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Producto = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Cantida = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Estado = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Maquina = tabla.rows[j].cells[5].childNodes[0].nodeValue; 
        var Empleado  = tabla.rows[j].cells[6].childNodes[0].nodeValue; 
        var Almacen  = tabla.rows[j].cells[7].childNodes[0].nodeValue; 
        var FechaSalida  = tabla.rows[j].cells[8].childNodes[0].nodeValue; 
        var OC  = tabla.rows[j].cells[9].childNodes[0].nodeValue; 
        var FechaIngreso  = tabla.rows[j].cells[10].childNodes[0].nodeValue; 
        
        var Fila = [Folio,Producto,Cantida,Estado,OT,Maquina,Empleado,Almacen,FechaSalida,OC,FechaIngreso]
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Hoja1',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("Rep_ArticuloOT_'+moment().format('L')+'.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}











 

function ExcelArticulo() {
    var tabla = document.getElementById("TablaReporte");
    var total = tabla.rows.length //Total de filas
    var Total = 0;


    var sheet_1_data = [];
    for (var j = 0; j <= total - 1; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue; 
        var Folio = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Producto = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Entregado = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        if(parseInt(Entregado)){
            console.log(parseInt(Entregado))
        Total = Total + parseInt(Entregado);
        }
        
        var Estado = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Maquina = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Empleado = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Almacen = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Fecha = tabla.rows[j].cells[8].childNodes[0].nodeValue; 
        var Fila = [Folio, Producto, Entregado, Estado, OT, Maquina, Empleado, Almacen, Fecha]
        sheet_1_data.push(Fila);
    } //fin filas

    var Fila = ["","Cantidad: ", Total, "", "", "", "", "", ""]
    sheet_1_data.push(Fila);


    var opts = [{
        sheetid: 'Sheet One',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("ReporteArticulo.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}



function ExcelArticuloAdmin() {
    var tabla = document.getElementById("TablaReporte");
    var total = tabla.rows.length //Total de filas
    var Total = 0; 

    var sheet_1_data = [];
    for (var j = 0; j <= total - 1; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue; 
        var Folio = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Producto = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Entregado = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        if(parseInt(Entregado)){
            console.log(parseInt(Entregado))
        Total = Total + parseInt(Entregado);
        }
        var Precio = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var Estado = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Maquina = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Empleado = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Almacen = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Fecha = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var Fila = [Folio, Producto, Entregado,Precio, Estado, OT, Maquina, Empleado, Almacen, Fecha]
        sheet_1_data.push(Fila);
    } //fin filas

    var Fila = ["","Cantidad: ", Total, "", "","", "", "", "", ""]
    sheet_1_data.push(Fila);


    var opts = [{
        sheetid: 'Sheet One',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("ReporteArticulo.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}















function ExcelReporte() {
    var tabla = document.getElementById("TablaReporte");
    var total = tabla.rows.length //Total de filas


    var sheet_1_data = [];
    for (var j = 0; j <= total - 1; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;

        var Folio = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Producto = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Entregado = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Estado = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Maquina = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Empleado = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Almacen = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Fecha = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Utilizado = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var Comentarios = tabla.rows[j].cells[10].childNodes[0].nodeValue
        var Fila = [Folio, Producto, Entregado, Estado, OT, Maquina, Empleado, Almacen, Fecha,Utilizado, Comentarios]
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
            Herramienta += '@';
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
            var sheet_1_data = [['Clave', 'Producto', 'almacen', 'Stock', 'StockMin', 'StockMax', 'StockUsado']];

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