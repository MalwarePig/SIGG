//CONSULTAR Lineas -- BOTON BUSCAR    
function Carga() {
    var Planta = document.getElementById("Planta").value;
    var Area = document.getElementById("Area").value;
    $.ajax({
        url: '/ConsultaFlujo/' + Planta + " " + Area,
        success: function (Lineas) {
            var Arreglo = [];
            //Limpiar tabla 
            var Tabla = document.getElementById('Tabla').getElementsByTagName('tbody')[0];
            var limite = Tabla.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows" + i).remove(); //elimina los elementos con id Rows
            }
            if (Lineas.length == 0) {
                $("#Vacio").modal();
            }
            for (var i = 0; i < Lineas.length; i++) {
                var id = Lineas[i].id;
                var OT = Lineas[i].OT;
                var Parte = Lineas[i].Parte;
                var Cantidad = Lineas[i].CantOt;
                var Planta = Lineas[i].Planta;
                var Area = Lineas[i].Fisico;
                var Inicio = Lineas[i].FechaInicio;
                var Vencimiento = Lineas[i].FechaVenc;
                //Eliminar variable dentro del For
                Arreglo = [id, OT, Parte, Cantidad, Planta, Area, Inicio, Vencimiento];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    newRow.setAttribute("onclick", "Mostrar(" + i + ")"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo


                    if (x < 6) {
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                    } else {
                        var newText = document.createTextNode(moment(Arreglo[x]).format('YYYY/MM/DD'));
                        newCell.appendChild(newText);
                    }

                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
} //Evento clic

//Muestra grafica de gant por areas  
function Grafica(Ancho) {
    google.charts.load('current', {
        'packages': ['gantt'],
        'language': 'es'
    });
    google.charts.setOnLoadCallback(drawChart);

    function toMilliseconds(dias) {
        return dias * 24 * 60 * 60 * 1000;
    }
 
    function drawChart() {

        var otherData = new google.visualization.DataTable();
        otherData.addColumn('string', 'Task ID');
        otherData.addColumn('string', 'Task Name');
        otherData.addColumn('string', 'Resource');
        otherData.addColumn('date', 'Inicio');
        otherData.addColumn('date', 'Fin');
        otherData.addColumn('number', 'Duración');
        otherData.addColumn('number', 'Porcentaje de avance');
        otherData.addColumn('string', 'Dependencias');

        //[TareaOrigen,TareaDependiente,]
        otherData.addRows([
            /* ['requerimientos','Requerimientos', '', null, null, toMilliseconds(1), 100, null],
             ['compras','Compras', '', null, null, toMilliseconds(2), 50, 'requerimientos'],*/
            ['produccion', 'Producción', '', null, null, toMilliseconds(10), 90, null],
            ['calidad', 'Calidad', '', null, null, toMilliseconds(45), 0, 'produccion'],
            ['acabados', 'Acabados', '', null, null, toMilliseconds(10), 0, 'calidad'],
            ['tratamientos', 'Tratamientos', '', null, null, toMilliseconds(2), 0, 'acabados'],
            ['embarques', 'Embarques', 'tratamientos', null, null, toMilliseconds(2), 0, 'tratamientos'],
        ]);

        //var size = window.innerWidth;
        var options = {
            height: 335, //valor de alto
            width: Ancho,
            gantt: {
                defaultStartDateMillis: new Date(2015, 3, 28)
            }
        };

        var chart = new google.visualization.Gantt(document.getElementById('GraficaGant'));
        chart.draw(otherData, options);
    }
}

function Mostrar(indice) {
    var tabla = document.getElementById("Tabla");
    document.ready = document.getElementById("R_Planta").value = tabla.rows[(indice + 1)].cells[4].childNodes[0].nodeValue;
    document.ready = document.getElementById("R_Area").value = tabla.rows[(indice + 1)].cells[5].childNodes[0].nodeValue;
    document.getElementById("R_id").value = tabla.rows[(indice + 1)].cells[0].childNodes[0].nodeValue;
    document.getElementById("R_OT").value = tabla.rows[(indice + 1)].cells[1].childNodes[0].nodeValue;
    document.getElementById("R_Parte").value = tabla.rows[(indice + 1)].cells[2].childNodes[0].nodeValue;
    document.getElementById("R_Cantidad").value = tabla.rows[(indice + 1)].cells[3].childNodes[0].nodeValue;
    //document.getElementById("R_Planta").value = tabla.rows[(indice+1)].cells[4].childNodes[0].nodeValue;
    //document.getElementById("R_Area").value = tabla.rows[(indice+1)].cells[5].childNodes[0].nodeValue;
    var fecha = moment(tabla.rows[(indice + 1)].cells[6].childNodes[0].nodeValue).format('YYYY-MM-DD');
    document.getElementById("R_Inicio").value = fecha;
    var fecha = moment(tabla.rows[(indice + 1)].cells[7].childNodes[0].nodeValue).format('YYYY-MM-DD');
    document.getElementById("R_Fin").value = fecha;

    $("#exampleModalPreview").modal();
    setTimeout(function () {
        var widthModal = document.getElementById("GraficaGant");
        var Ancho = widthModal.clientWidth;
        Grafica(Ancho);
    }, 500);

    /*$.ajax({
        url: '/ConsultaFlujo/'+OT,
        success: function (Lineas) {

        } //Funcion success
    }); //Ajax*/
}

/*Eliminar nodo seleccionado
var parrafo = document.getElementById("provisional");
parrafo.parentNode.removeChild(parrafo);*/

function Eliminar(){
    var puntero = document.getElementById("GraficaGant");
    puntero.removeChild(puntero.childNodes[0]);  
}