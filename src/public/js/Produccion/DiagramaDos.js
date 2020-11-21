
google.charts.load('current', {'packages':['gantt'],'language':'es'});
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

      otherData.addRows([
        ['requerimientos','Requerimientos', '', null, null, toMilliseconds(1), 100, null],
        ['compras','Compras', '', null, null, toMilliseconds(2), 50, 'requerimientos'],
        ['produccion','Producción', '', null, null, toMilliseconds(10), 0, 'compras'],
        ['calidad','Calidad','', null, null, toMilliseconds(45), 0, 'produccion'],
        ['acabados','Acabados', '', null, null, toMilliseconds(10), 0, 'calidad'],
        ['tratamientos','Tratamientos','', null, null, toMilliseconds(2), 0, 'acabados'],
        ['embarques','Embarques','tratamientos',null,null,toMilliseconds(2),0, 'tratamientos'],
      ]);

      var ancho =0;

      var size = window.innerWidth ;

      var options = {

        height: 400,//valor de alto
        //width: size, 
        gantt: {
          defaultStartDateMillis: new Date(2015, 3, 28)
        }
      };

      var chart = new google.visualization.Gantt(document.getElementById('chart_divDos'));

      chart.draw(otherData, options);
    }

