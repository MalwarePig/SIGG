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
                $("#Rows"+i).remove(); //elimina los elementos con id Rows
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
                Arreglo = [id,OT,Parte,Cantidad, Planta, Area,Inicio,Vencimiento];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"+i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    newRow.setAttribute("onclick","Mostrar("+i+")"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
              
                  
                    if(x < 6){
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                    }else{
                        var newText = document.createTextNode(moment(Arreglo[x]).format('YYYY/MM/DD'));
                        newCell.appendChild(newText); 
                    }
                   
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
} //Evento clic

//Muestra grafica de gant por areas  
function Grafica(){
    google.charts.load('current', {
        'packages': ['gantt']
    });
    google.charts.setOnLoadCallback(drawChart);

    function daysToMilliseconds(days) {
        return days * 24 * 60 * 60 * 1000;
    }

    function drawChart() {

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Task ID');
        data.addColumn('string', 'Task Name');
        data.addColumn('date', 'Start Date');
        data.addColumn('date', 'End Date');
        data.addColumn('number', 'Duration');
        data.addColumn('number', 'Percent Complete');
        data.addColumn('string', 'Dependencies');

        data.addRows([
            ['Research', 'Find sources', new Date(2015, 0, 1), new Date(2015, 0, 5), null, 100, null],
            ['Write', 'Write paper', null, new Date(2015, 0, 9), daysToMilliseconds(3), 25,
                'Research,Outline'
            ],
            ['Cite', 'Create bibliography', null, new Date(2015, 0, 7), daysToMilliseconds(1), 20,
                'Research'
            ],
            ['Complete', 'Hand in paper', null, new Date(2015, 0, 10), daysToMilliseconds(1), 0,
                'Cite,Write'
            ],
            ['Outline', 'Outline paper', null, new Date(2015, 0, 6), daysToMilliseconds(1), 100, 'Research']
        ]);

        var options = {
            height: 275
        };

        var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

        chart.draw(data, options);
    }
}

function Mostrar(indice){
var tabla = document.getElementById("Tabla");
document.ready = document.getElementById("R_Planta").value = tabla.rows[(indice+1)].cells[4].childNodes[0].nodeValue;
document.ready = document.getElementById("R_Area").value = tabla.rows[(indice+1)].cells[5].childNodes[0].nodeValue;
document.getElementById("R_id").value = tabla.rows[(indice+1)].cells[0].childNodes[0].nodeValue;
document.getElementById("R_OT").value = tabla.rows[(indice+1)].cells[1].childNodes[0].nodeValue;
document.getElementById("R_Parte").value = tabla.rows[(indice+1)].cells[2].childNodes[0].nodeValue;
document.getElementById("R_Cantidad").value = tabla.rows[(indice+1)].cells[3].childNodes[0].nodeValue;
//document.getElementById("R_Planta").value = tabla.rows[(indice+1)].cells[4].childNodes[0].nodeValue;
//document.getElementById("R_Area").value = tabla.rows[(indice+1)].cells[5].childNodes[0].nodeValue;
var fecha = moment(tabla.rows[(indice+1)].cells[6].childNodes[0].nodeValue).format('YYYY-MM-DD');
document.getElementById("R_Inicio").value =  fecha; 
var fecha = moment(tabla.rows[(indice+1)].cells[7].childNodes[0].nodeValue).format('YYYY-MM-DD');
document.getElementById("R_Fin").value = fecha;

$("#exampleModalPreview").modal();
    /*
    $.ajax({
        url: '/ConsultaFlujo/'+OT,
        success: function (Lineas) {

        } //Funcion success
    }); //Ajax*/
}
