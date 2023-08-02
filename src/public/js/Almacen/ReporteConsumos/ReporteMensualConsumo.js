var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function ListarMeses() {
    ReporteConsumos()
    const AnioActual = new Date();
  
     //alert(AnioActual.getFullYear())
     var calendario = [(AnioActual.getFullYear() - 2), (AnioActual.getFullYear() - 1), (AnioActual.getFullYear())]
     var Componente = document.getElementById("Año");
     for (let i = Componente.options.length; i >= 1; i--) { //Borrar elementos option de select
         Componente.remove(i);
     }

     for (var i = 0; i < calendario.length; i++) { //Agregar nuevos options del select 
         var option = document.createElement("option");
         option.text = calendario[i];
         if (i == 2) {
             option.selected = true;
         }
         Componente.add(option);
     }
}

var Tabla = []
var ResultadoLista;
var TablaConsumos = []
var FechaInicio = 0;
var FechaFin = 0;
var TotalMeses = 0;


function ListadoDespacho() {//Obtiene la lista de productos despachados
    ModalAjuste()
    //Meses del 0 - 11 JS & MSQL 1 - 12
    Mes = parseInt(document.getElementById("FechaInicio").value);
    FechaFin = FechaInicio + 1; 
    let Año = document.getElementById("Año").value; 
    let Planta = document.getElementById("Planta").value; 
    var Pivote = FechaInicio;
    var sheet_1_data = [];
    sheet_1_data.push(['Clave', 'Producto', 'Almacen', 'Stock', 'StockMin', 'StockMax', 'Utilizado','Entregado']);
         $.ajax({
            url: '/ListadoDespacho/' + Mes + '|' + Año + '|' + Planta,
            success: function (Herramientas) {
                console.log(Herramientas[0])
                for (var j = 0; j < Herramientas[0].length; j++) { //filas 
                    var Clave = Herramientas[0][j].Clave
                    var Producto = Herramientas[0][j].Producto
                    var Almacen = Herramientas[0][j].Almacen
                    //var Salida = moment(Herramientas[0][j].Salida).format('DD-MM-YYYY'); 
                    var Stock = Herramientas[0][j].Stock
                    var StockMin = Herramientas[0][j].StockMin
                    var StockMax = Herramientas[0][j].StockMax
                    var Utilizado = Herramientas[0][j].Utilizado
                    var Entregado = Herramientas[0][j].Entregado
                    var Fila = [Clave, Producto, Almacen, Stock, StockMin, StockMax, Utilizado,Entregado]
                    sheet_1_data.push(Fila);
                } //fin filas   
                var opts = [{
                    sheetid: 'Hoja1',
                    header: true
                }];
                var result = alasql('SELECT * INTO XLSX("Reporte.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
                redireccionar()
            } //Funcion success
        }); //Ajax 
    



}

function redireccionar() {
    var pagina = "/ReporteConsumos";
    location.href = pagina;
}


function ReporteConsumos() {
    $("#ReporteConsumos").modal();
}

function ModalAjuste() {
    $("#loading").modal();
}
