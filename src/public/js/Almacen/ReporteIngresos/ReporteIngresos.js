

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
            url: '/ReporteHerramientaIngresos/' + Herramienta + '|' + fechaInicio + '|' + fechafin + '|' + Almacen,
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
                    var Producto = Herramientas[i].Producto;
                    var Responsable = Herramientas[i].Responsable;
                    var Planta = Herramientas[i].Planta;
                    var CantidadAnterior =  Herramientas[i].CantidadAnterior;
                    var CantIngreso = Herramientas[i].CantIngreso;
                    var CantidadActual = Herramientas[i].CantidadActual; 
                    var FechaAjuste = moment(Herramientas[i].FechaAjuste).format('DD-MM-YYYY HH:MM'); 
                    //Eliminar variable dentro del For
                    Arreglo = [Producto,Responsable,Planta,CantidadAnterior,CantIngreso,CantidadActual,FechaAjuste];
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



function ExcelReporte() {
    var tabla = document.getElementById("TablaReporte");
    var total = tabla.rows.length //Total de filas


    var sheet_1_data = [];
    for (var j = 0; j <= total - 1; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;

        var Producto = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Responsable = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Planta = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Anterior = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var Ingreso = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Ajuste = tabla.rows[j].cells[5].childNodes[0].nodeValue; 
        var Fecha  = tabla.rows[j].cells[5].childNodes[0].nodeValue; 
        
        var Fila = [Producto,Responsable,Planta,Anterior,Ingreso,Ajuste,Fecha]
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Hoja1',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("Rep_Ingresos_'+moment().format('L')+'.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}