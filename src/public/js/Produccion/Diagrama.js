google.charts.load('current', {'packages':['gantt'],'language':'es'});
google.charts.setOnLoadCallback(drawChart);
var data = new google.visualization.DataTable(); //Tabla de datos

function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}
function drawChart() {

var fecha = new Date();
var dia = fecha.getDay() + 1;
var mes = fecha.getMonth() + 1 ;
var año =  fecha.getFullYear();

/*var date = new Date('2011','01','02');
alert('the original date is '+date);
var newdate = new Date(date);
newdate.setDate(newdate.getDate() - 7);
var nd = new Date(newdate);
alert('the new date is '+nd);*/
var newdate = new Date(fecha);
newdate.setDate(newdate.getDate() +8);
var nd = new Date(newdate);
alert('the new date is '+ nd);


function toMilliseconds(dias) {
  return dias * 24 * 60 * 60 * 1000;
}

 // var data = new google.visualization.DataTable(); //Tabla de datos
  data.addColumn('string', 'ID Tarea');//Columnas
  data.addColumn('string', 'Tarea');
  data.addColumn('string', 'Recurso');
  data.addColumn('date', 'Fecha inicio');
  data.addColumn('date', 'Fecha fin');
  data.addColumn('number', 'Duracion');
  data.addColumn('number', 'Porcentaje de avance');
  data.addColumn('string', 'Dependencias');

  //id,Titulo, dependencia, fecha inicio, fecha final, duracion,Percent Complete,	Dependencies
  data.addRows([
      ['requerimientos','Requerimientos','',fecha,null,toMilliseconds(5),100,null],
      ['compras','Compras','requerimientos',new Date(2019,11,05),nd,null,50,requerimientos],
      ['produccion','Producción','compras',fecha,nd,null,40,compras],
      ['calidad','Calidad','produccion',fecha,nd,null,30,null],
      ['acabados','Acabados','calidad',fecha,nd,null,20,null],
      ['tratamientos','Tratamientos','acabados',fecha,nd,null,0,null],
      ['embarques','Embarques','tratamientos',fecha,nd,null,0,null]
  ]);
  var options = {
    height: 300,
gantt: {
        criticalPathEnabled: false,
        arrow: {
          width: 5
        },
      }
  };
  var chart = new google.visualization.Gantt(document.getElementById('chart_div'));
  chart.draw(data, options);
}


//Encargho 9963asd