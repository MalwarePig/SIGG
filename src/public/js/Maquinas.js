google.charts.load("current", {packages:["timeline"]});
google.charts.setOnLoadCallback(drawChart);


function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}

function drawChart() {
  try{
//////////////////// CREAR DATA TABLE ////////////////////////
  var dataTable = new google.visualization.DataTable();
  ////////////////// AGREGAR COLUMNAS ///////////////////////
  dataTable.addColumn({ type: 'string', id: 'Maquina' });
  dataTable.addColumn({ type: 'string', id: 'OT' });
  dataTable.addColumn({ type: 'date', id: 'Start' });
  dataTable.addColumn({ type: 'date', id: 'End' });
///////////////////// RECORRER TABLAS ////////////////////////
  var miArray=new Array()
  var i=0
  var tabla = document.getElementById("OTRegistros");
  var total = tabla.rows.length//Total de filas

  for(j=1;j<=total-1;j++){//filas
     //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
     var OT = tabla.rows[j].cells[1].childNodes[0].nodeValue;
     var nPart = tabla.rows[j].cells[2].childNodes[0].nodeValue;
     var Cantidad = tabla.rows[j].cells[3].childNodes[0].nodeValue;
     var Maquina = tabla.rows[j].cells[4].childNodes[0].nodeValue;
     var Inicio = new Date( FormtatoFechas(tabla.rows[j].cells[5].childNodes[0].nodeValue) );
     var Fin = new Date( FormtatoFechas(tabla.rows[j].cells[6].childNodes[0].nodeValue) );
     //alert(total);
     //alert("Maquina: " + Maquina + " OT: " + OT + " Inicio: " + Inicio + " Fin: " + Fin);
     ///////////////////////// INSERTAR DATOS ///////////////////////var date_format = new Date(date_input).toDateString("yyyy-MM-dd");
    //TECNO FON NPRONMEOL
     dataTable.addRows([
      [ Maquina, OT, Inicio, Fin]
      ]);
     
 }//fin filas

///////////////////////////////////////////////// API TIMELINE //////////////////////////////////////////////////////////////////////////////////
  var container = document.getElementById('MaquinasLap');
  var chart = new google.visualization.Timeline(container);

  var options = {
    //height: 100,
    timeline: { showRowLabels: true,colorByRowLabel: true },//Muestra encabezado, un solo color por fila
    avoidOverlappingGridLines: true,
     
    //colors:['red','#00cc00']
  };

  chart.draw(dataTable, options);
  }catch(e){
    alert(e);
  }
}

          /*
google.visualization.events.addListener(chart, 'select', selectHandler); 

function selectHandler() {
  var selection = chart.getSelection();
  var message = '';
  for (var i = 0; i < selection.length; i++) {
  var item = selection[i];
  if (item.row != null && item.column != null) {
  var str = data.getFormattedValue(item.row, item.column);
  var category = data
  .getValue(chart.getSelection()[0].row, 0)
  var type
  if (item.column == 1) {
  type = "sale";
  } 
  else if(item.column == 2){
  type = "Expense";
  }
  else{
  type = "Profit";
  }
  message += '{row:' + item.row + ',column:' + item.column   + '} = ' + str + '  The Category is:' + category  + ' it belongs to : ' + type + '\n';
  }
   else if (item.row != null) {
  var str = data.getFormattedValue(item.row, 0);
  message += '{row:' + item.row  + ', column:none}; value (col 0) = ' + str  + '  The Category is:' + category + '\n';
  } 
  else if (item.column != null) {  var str = data.getFormattedValue(0, item.column);
  message += '{row:none, column:' + item.column  + '}; value (row 0) = ' + str  + '  The Category is:' + category + '\n';
  }
  }
  if (message == '') {
  message = 'nothing';
  }
  alert('You selected ' + message);
  }
  
*/
function FormtatoFechas(fecha){

  var today = new Date(fecha); 
  var dd = today.getDate(); 
  var mm = today.getMonth() + 1; 
  var yyyy = today.getFullYear(); 
  if (dd < 10) { 
      dd = '0' + dd; 
  } 
  if (mm < 10) { 
      mm = '0' + mm; 
  } 
  var today =  yyyy+ '/' + mm + '/' + dd; 
  return today
}


///////////////////////////////////////////////// LECTURA DE DATOS //////////////////////////////////////////////////////////////////////////////////
//Cajas de texto
//var Maquina = document.getElementById("texto").value;
//alert(Maquina);
/*
//ListBox
var listfamilia= document.getElementById("familia");
// Obtener el índice de la opción que se ha seleccionado
var indiceFamilia = listfamilia.selectedIndex;
// Con el índice y el array "options", obtener la opción seleccionada
var opcionFamilia = listfamilia.options[indiceFamilia];
// Obtener el valor y el texto de la opción seleccionada
var textoFamilia = opcionFamilia.text;
var valorFamilia = opcionFamilia.value;
//alert(valorFamilia);

//ListBox
var listaMaquina = document.getElementById("maquina");
// Obtener el índice de la opción que se ha seleccionado
var indiceMaquina = listaMaquina.selectedIndex;
// Con el índice y el array "options", obtener la opción seleccionada
var opcionMaquina = listaMaquina.options[indiceMaquina];
// Obtener el valor y el texto de la opción seleccionada
var textoMaquina = opcionMaquina.text;
var valorMaquina = opcionMaquina.value;
//alert(valorMaquina);

var ot = document.getElementById("ot").value;
var cantidad = document.getElementById("cantidad").value;
//alert("Cantidad: " + cantidad + " OT: " + ot);

var InicioValue = document.getElementById("inicio").value;
var inicio = new Date(InicioValue.toString());
var FinValue = document.getElementById("fin").value;
var fin = new Date(FinValue.toString());
//alert("Inicio: " + inicio + " Fin: " + fin);

var Hoy = new Date();
var newdate = new Date(Hoy);
var Fin = new Date(newdate.setDate(newdate.getDate() +4 ));

/*********************************************************************************** */
//var rows = document.getElementById('OTRegistros').getElementsByTagName('tbody')[0].getElementsByTagName('tr').length;
//console.log(rows);