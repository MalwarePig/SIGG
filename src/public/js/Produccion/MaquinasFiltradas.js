///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// VARIABLES GLOBALES //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Data;
var Data_Maquinas;

google.charts.load("current", {
  packages: ["timeline"]
});
google.charts.setOnLoadCallback(drawChart);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// CAPTURAR TABLA ORIGINAL /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getTabla() {
  //Obtener la tabla 
  Data = document.getElementById("OTRegistros");
  Data_Maquinas = document.getElementById("MaquinasTabla");
  drawChart();
}
 

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// CARGAR LISTA DE MAQUINAS ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Cargar_list_Maquina() {
  //Obtener datos de tabla
  var total_Maquinas = Data_Maquinas.rows.length //Total de filas
  var arrayMachin = new Array();
  var Obj_Maquinas = new Object();
  select = document.getElementById("maquina");
  select.options.length = 0;
  //OBTENER FILTRO DE FAMILIA
  var listaMaquina = document.getElementById("familia");
  var indiceMaquina = listaMaquina.selectedIndex;
  var opcionMaquina = listaMaquina.options[indiceMaquina];
  var valorMaquina = opcionMaquina.value;

  //CREAR ARRAY CON DATOS DE TABLA
  for (var i = 1; i < total_Maquinas; i++) {
    for (var j = 0; j < 2; j++) {
      Obj_Maquinas.Familia = Data_Maquinas.rows[i].cells[0].childNodes[0].nodeValue; //Obtiene el valor de familia
      Obj_Maquinas.Nombre = Data_Maquinas.rows[i].cells[1].childNodes[0].nodeValue; //Obtiene el valor de nombre
    }
    arrayMachin[i] = Obj_Maquinas;
    if ((valorMaquina == arrayMachin[i].Familia) || (valorMaquina == 'Todo')) {
      option = document.createElement("option");
      option.value = arrayMachin[i].Nombre;
      option.text = arrayMachin[i].Nombre;
      select.appendChild(option);
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// CREAR TABLA FILTRADA //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function CrearTablaMaquinas() {
  //ListBox
  var listaMaquina = document.getElementById("maquina");
  // Obtener el índice de la opción que se ha seleccionado
  var indiceMaquina = listaMaquina.selectedIndex;
  // Con el índice y el array "options", obtener la opción seleccionada
  var opcionMaquina = listaMaquina.options[indiceMaquina];
  // Obtener el valor y el texto de la opción seleccionada
  var valorMaquina = opcionMaquina.value;
  //Obtener datos de tabla
  var total = Data.rows.length //Total de filas
  ////////////////////////////// CREAR NUEVA TABLA //////////////////////////////////////////////////////
  // Obtenemos la referencia del elemento body
  var body = document.getElementsByTagName("body")[0];
  // Creamos un elemento <table> y un elemento <tbody>
  tabla = document.createElement("table");
  var tblBody = document.createElement("tbody");
  // Creamos las celdas
  for (var i = 0; i < total; i++) {
    // Creamos las hileras de la tabla
    var fila = document.createElement("tr");
    for (var j = 0; j < 9; j++) {
      if ((i == 0) || (valorMaquina == 'Todo')) { //FORZAR LA TOMA DE VALOR DE LA CABEZERA DE LA TABLA
        // Crea un elemento <td> y un nodo de texto, hace que el nodo de
        // texto sea el contenido de <td>, ubica el elemento <td> al final
        // de la hilera de la tabla
        var celda = document.createElement("td");
        var textoCelda = document.createTextNode(Data.rows[i].cells[j].childNodes[0].nodeValue);
        celda.appendChild(textoCelda);
        fila.appendChild(celda);
        if (i > 0 && j == 8) {
          newlink = document.createElement('a');
          newlink.setAttribute('class', 'btn btn-info');
          newlink.setAttribute('href', '/update/' + Data.rows[i].cells[0].childNodes[0].nodeValue);
          celda.appendChild(newlink);
          fila.appendChild(celda); //Se agrega la informacion de la fila
        }
      }
      if ((Data.rows[i].cells[5].childNodes[0].nodeValue == valorMaquina)) { //OBTENER LOS DATOS CUANDO SE SELECCIONE LA MAQUINA
        // Crea un elemento <td> y un nodo de texto, hace que el nodo de
        // texto sea el contenido de <td>, ubica el elemento <td> al final
        // de la hilera de la tabla
        var celda = document.createElement("td");
        var textoCelda = document.createTextNode(Data.rows[i].cells[j].childNodes[0].nodeValue); //obtiene el valor
        celda.appendChild(textoCelda);
        fila.appendChild(celda); //Se agrega la informacion de la fila
        if (j == 8) {
          newlink = document.createElement('a');
          newlink.setAttribute('class', 'btn btn-info');
          newlink.setAttribute('href', '/update/' + Data.rows[i].cells[0].childNodes[0].nodeValue);
          celda.appendChild(newlink);
          fila.appendChild(celda); //Se agrega la informacion de la fila
        }
      }
    }
    // agregamos la hilera al final de la tabla (al final del elemento tblbody)
    tblBody.appendChild(fila);
  }
  // modifica el atributo "border" de la tabla y lo fija a "2";
  tabla.setAttribute("border", 2);
  tabla.setAttribute("id", "OTRegistros");
  tabla.setAttribute("class", "table table-bordered table-hover");

  // posicionamos el <tbody> debajo del elemento <table>
  tabla.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tabla);

  //SE REMUEVE LA TABLA ORIGINAL
  var node = document.getElementById("OTRegistros");
  node.parentNode.removeChild(node);

  var result = document.getElementById("divTabla");
  result.appendChild(tabla);
  drawChart('');
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// TIMELINE /////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function drawChart(filtro) {
  try {

    //////////////////// CREAR DATA TABLE ////////////////////////
    var dataTable = null;
    dataTable = new google.visualization.DataTable();

    ////////////////// AGREGAR COLUMNAS ///////////////////////
    dataTable.addColumn({
      type: 'string',
      id: 'Maquina'
    });
    dataTable.addColumn({
      type: 'string',
      id: 'OT'
    });
    dataTable.addColumn({
      type: 'date',
      id: 'Start'
    });
    dataTable.addColumn({
      type: 'date',
      id: 'End'
    });
    ///////////////////// RECORRER TABLAS ////////////////////////
    var TablaActual = document.getElementById("OTRegistros");
    var tabla = Data; //Carga la tabla de OT
    var TamañoDiv = 75; //Tamaño de pixeles para el div por cada maquina
    var total = tabla.rows.length; //Total de filas
    var CantidadMaquinas = 0; //Contador para multiplicar los pixeles del div de la grafica
    var NombreMaquina = ""; //variable de comparacion para contar la cantidad de maquinas

    //ListBox
    var listaMaquina = document.getElementById("maquina");
    // Obtener el índice de la opción que se ha seleccionado
    var indiceMaquina = listaMaquina.selectedIndex;
    // Con el índice y el array "options", obtener la opción seleccionada
    var opcionMaquina = listaMaquina.options[indiceMaquina];
    // Obtener el valor y el texto de la opción seleccionada
    var valorMaquina = opcionMaquina.value;
    for (j = 1; j <= total - 1; j++) { //filas
      //Obtener la cantidad de maquinas para multiplicar los piexeles por cantidad de maquinas
      NombreMaquina = tabla.rows[j].cells[5].childNodes[0].nodeValue; //se obtiene maquina actual
      if (NombreMaquina != tabla.rows[j - 1].cells[5].childNodes[0].nodeValue) { //se compara maquina con el nombre de la maquina del siguiente registro
        CantidadMaquinas++;
      }

      if (filtro == 'vencidas') {
        for (t = 1; t <= document.getElementById('OTRegistros').rows.length - 1; t++) {
          if (tabla.rows[j].cells[0].childNodes[0].nodeValue == TablaActual.rows[t].cells[0].childNodes[0].nodeValue) {
            //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
            var OT = tabla.rows[j].cells[1].childNodes[0].nodeValue;
            var nPart = tabla.rows[j].cells[2].childNodes[0].nodeValue;
            var Cantidad = tabla.rows[j].cells[4].childNodes[0].nodeValue;
            var Maquina = tabla.rows[j].cells[5].childNodes[0].nodeValue;
            var Inicio = new Date(FormtatoFechas(tabla.rows[j].cells[6].childNodes[0].nodeValue));
            var Fin = new Date(FormtatoFechas(tabla.rows[j].cells[7].childNodes[0].nodeValue));
            ///////////////////////// INSERTAR DATOS ///////////////////////var date_format = new Date(date_input).toDateString("yyyy-MM-dd");
            //TECNO FON NPRONMEOL
            dataTable.addRows([
              [Maquina, OT, Inicio, Fin]
            ]);

          }
        }
      } else {
        if ((valorMaquina == tabla.rows[j].cells[5].childNodes[0].nodeValue) || (valorMaquina == 'Todo')) {
          //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
          var OT = tabla.rows[j].cells[1].childNodes[0].nodeValue;
          var nPart = tabla.rows[j].cells[2].childNodes[0].nodeValue;
          var Cantidad = tabla.rows[j].cells[4].childNodes[0].nodeValue;
          var Maquina = tabla.rows[j].cells[5].childNodes[0].nodeValue;
          var Inicio = new Date(FormtatoFechas(tabla.rows[j].cells[6].childNodes[0].nodeValue));
          var Fin = new Date(FormtatoFechas(tabla.rows[j].cells[7].childNodes[0].nodeValue));
          ///////////////////////// INSERTAR DATOS ///////////////////////var date_format = new Date(date_input).toDateString("yyyy-MM-dd");
          //TECNO FON NPRONMEOL
          dataTable.addRows([
            [Maquina, OT, Inicio, Fin]
          ]);
        }
      }

    } //fin FOR filas
    ///////////////////////////////////////////////// API TIMELINE //////////////////////////////////////////////////////////////////////////////////
    var container = document.getElementById('MaquinasLap');
    var chart = new google.visualization.Timeline(container);
    TamañoDiv = TamañoDiv * CantidadMaquinas;
    var options = {
      height: TamañoDiv,
      timeline: {
        showRowLabels: true,
        colorByRowLabel: true
      }, //Muestra encabezado, un solo color por fila
      avoidOverlappingGridLines: true,
      //colors:['red','#00cc00']
    };

    chart.draw(dataTable, options);
  } catch (e) {
    console.log(e);
  }
  dataTable = null;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// DIAS A MILISEGUNDOS ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// FORMATO FECHAS ///////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function FormtatoFechas(fecha) {
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
  var today = yyyy + '/' + mm + '/' + dd;
  return today;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// CREAR TABLA Rezagadas //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function CrearTablaRezagada() {
  try {
    //ListBox
    var listaMaquina = document.getElementById("maquina");
    // Obtener el índice de la opción que se ha seleccionado
    var indiceMaquina = listaMaquina.selectedIndex;
    // Con el índice y el array "options", obtener la opción seleccionada
    var opcionMaquina = listaMaquina.options[indiceMaquina];
    // Obtener el valor y el texto de la opción seleccionada
    var valorMaquina = opcionMaquina.value;

    //Obtener datos de tabla
    var total = Data.rows.length //Total de filas
    ////////////////////////////// CREAR NUEVA TABLA //////////////////////////////////////////////////////
    // Obtenemos la referencia del elemento body
    var body = document.getElementsByTagName("body")[0];
    // Creamos un elemento <table> y un elemento <tbody>
    tabla = document.createElement("table");
    var tblBody = document.createElement("tbody");
    // Creamos las celdas
    for (var i = 0; i < total; i++) {
      // Creamos las hileras de la tabla
      var fila = document.createElement("tr");
      for (var j = 0; j < 9; j++) {
        if (i == 0) { //FORZAR LA TOMA DE VALOR DE LA CABEZERA DE LA TABLA
          // Crea un elemento <td> y un nodo de texto, hace que el nodo de
          // texto sea el contenido de <td>, ubica el elemento <td> al final
          // de la hilera de la tabla
          var celda = document.createElement("td");
          var textoCelda = document.createTextNode(Data.rows[i].cells[j].childNodes[0].nodeValue);
          celda.appendChild(textoCelda);
          fila.appendChild(celda);
        } else if (i > 0) {
          var FechaProd = new Date(FormtatoFechas(Data.rows[i].cells[6].childNodes[0].nodeValue));
          var FechaVenc = new Date(FormtatoFechas(Data.rows[i].cells[7].childNodes[0].nodeValue));
          if (FechaProd > FechaVenc) { //OBTENER LOS DATOS CUANDO SE SELECCIONE LA MAQUINA
            // Crea un elemento <td> y un nodo de texto, hace que el nodo de
            // texto sea el contenido de <td>, ubica el elemento <td> al final
            // de la hilera de la tabla
            var celda = document.createElement("td");
            var textoCelda = document.createTextNode(Data.rows[i].cells[j].childNodes[0].nodeValue); //obtiene el valor
            celda.appendChild(textoCelda);
            fila.appendChild(celda); //Se agrega la informacion de la fila
            if (j == 8) { //Para agregar boton de editar
              newlink = document.createElement('a');
              newlink.setAttribute('class', 'btn btn-info');
              newlink.setAttribute('href', '/update/' + Data.rows[i].cells[0].childNodes[0].nodeValue);
              celda.appendChild(newlink);
              fila.appendChild(celda); //Se agrega la informacion de la fila
            }
          }
        } // if i > 0
      } //For Columnas J
      // agregamos la hilera al final de la tabla (al final del elemento tblbody)
      tblBody.appendChild(fila);
    }
    // modifica el atributo "border" de la tabla y lo fija a "2";
    tabla.setAttribute("border", 2);
    tabla.setAttribute("id", "OTRegistros");
    tabla.setAttribute("class", "table table-bordered table-hover");

    // posicionamos el <tbody> debajo del elemento <table>
    tabla.appendChild(tblBody);
    // appends <table> into <body>
    body.appendChild(tabla);

    //SE REMUEVE LA TABLA ORIGINAL
    var node = document.getElementById("OTRegistros");
    node.parentNode.removeChild(node);

    var result = document.getElementById("divTabla");
    result.appendChild(tabla);
    drawChart('vencidas');
  } catch (e) {
    console.log(e);
  }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// VENTANA EDIAR PUPOP //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
function AbrirPupop(){
      try{
      console.log('clic');
      var btnAbrirPopup = document.getElementById('btn-abrir-popup'),
      overlay = document.getElementById('overlay'),
      popup = document.getElementById('popup'),
      btnCerrarPopup = document.getElementById('btn-cerrar-popup');

      btnAbrirPopup.addEventListener('click', function(){
        overlay.classList.add('active');
        popup.classList.add('active');
      });

      btnCerrarPopup.addEventListener('click', function(e){
        e.preventDefault();
        overlay.classList.remove('active');
        popup.classList.remove('active');
      });

      }catch(err){
        console.log(err);
      }
}*/

/*function AbrirPupop(){
   try{
console.log('clic');
    var btnAbrirPopup = document.getElementById('btn-abrir-popup'),
    overlay = document.getElementById('overlay'),
    popup = document.getElementById('popup'),
    btnCerrarPopup = document.getElementById('btn-cerrar-popup');

    btnAbrirPopup.addEventListener('click', function(){
      overlay.classList.add('active');
      popup.classList.add('active');
    });

    btnCerrarPopup.addEventListener('click', function(e){
      e.preventDefault();
      overlay.classList.remove('active');
      popup.classList.remove('active');
    });
   }catch(err){
     console.log(err);
   }
   
 }*/

//



/*
function AddButton(){
  Padre = document.getElementById('OTRegistros');
  newlink = document.createElement('a');
  newlink.setAttribute('class', 'btn btn-info');
  newlink.setAttribute('href', '/update/');
  Padre.appendChild(newlink);
}*/


/*function FiltrarMaquinas()
{
    try{
    var tabla = document.getElementById("OTRegistros");
    var listaMaquina = document.getElementById("maquina"); 
    var indiceMaquina = listaMaquina.selectedIndex;
    var opcionMaquina = listaMaquina.options[indiceMaquina];
    var valorMaquina = opcionMaquina.value; 

    var j = 0;
    var filas = document.getElementById('OTRegistros').rows.length;

    for(i = 1; i < filas; i++){ 
      if(valorMaquina !== tabla.rows[i].cells[4].childNodes[0].nodeValue){
        document.getElementById('OTRegistros').rows[i].style.display='none'; 
      }
    }

    drawChart();
    }
    catch(err){
      console.log(err);
    }
}
*/


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


/*



<% var listaMaquina = document.getElementById("maquina"); %>

<% var indiceMaquina = listaMaquina.selectedIndex;%>

<% var opcionMaquina = listaMaquina.options[indiceMaquina]; %>

<% var valorMaquina = opcionMaquina.value; %>*/

/*
function CrearTablaMaquinas(){
  alert('Si entro filtor'  + data[i].OT );
// Obtenemos la referencia del elemento body
var body = document.getElementsByTagName("body")[0];
// Creamos un elemento <table> y un elemento <tbody>
var tabla = document.createElement("table");
var tblBody = document.createElement("tbody");
// Creamos las celdas
for (var i = 0; i < 10; i++) {
  // Creamos las hileras de la tabla
  var fila = document.createElement("tr");
  for (var j = 0; j < 15; j++) {
    // Crea un elemento <td> y un nodo de texto, hace que el nodo de
    // texto sea el contenido de <td>, ubica el elemento <td> al final
    // de la hilera de la tabla
    var celda = document.createElement("td");
    var textoCelda = document.createTextNode(i + " - " + j);
    celda.appendChild(textoCelda);
    fila.appendChild(celda);
  }
// agregamos la hilera al final de la tabla (al final del elemento tblbody)
tblBody.appendChild(fila);
}
// posicionamos el <tbody> debajo del elemento <table>
tabla.appendChild(tblBody);
// appends <table> into <body>
body.appendChild(tabla);
// modifica el atributo "border" de la tabla y lo fija a "2";
tabla.setAttribute("border", 2);
tabla.setAttribute("id", "OTRegistros");
var result = document.getElementById("resultado");
result.appendChild(tabla);
}*/

/*
//RESPALDAR LISTA DE MAQUINAS
function Cargar_list_Maquina(){
  var arrayMachin = new Array();
  var x = document.getElementById("maquina");
  for (var i = 0; i < x.length; i++) {  
    arrayMachin[i] = x.options[i].text;
  } 
//ELIMINAR TODAS LAS OPCIONES
  x.options.length = 0;
  */