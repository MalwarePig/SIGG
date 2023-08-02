var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function ListarMeses() {
    ReporteConsumos()
    const AnioActual = new Date();
    let Componentes = ['FechaInicio', 'FechaFin', 'Año'];

    for (let c = 0; c < Componentes.length; c++) {//Recorre los componentes

        if (c == 2) {//Obtener años en componente 3

            //alert(AnioActual.getFullYear())
            var calendario = [(AnioActual.getFullYear() - 2), (AnioActual.getFullYear() - 1), (AnioActual.getFullYear())]
            var Componente = document.getElementById(Componentes[c]);
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

        } else {
            var Componente = document.getElementById(Componentes[c]);

            for (let i = Componente.options.length; i >= 1; i--) { //Borrar elementos option de select
                Componente.remove(i);
            }

            for (var i = 0; i < meses.length; i++) {//Agregar nuevos options del select 
                var option = document.createElement("option");
                option.text = meses[i];
                option.value = i;
                if (c == 1 && (i == AnioActual.getMonth())) {//Identificar si es le mes actual
                    //alert((AnioActual.getMonth()+1))// meses del 0 a 11
                    option.selected = true;
                }
                Componente.add(option);
            }
        }
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
    FechaInicio = parseInt(document.getElementById("FechaInicio").value) + 1;
    FechaFin = parseInt(document.getElementById("FechaFin").value) + 2;
    TotalMeses = (FechaFin) - FechaInicio;

    let Año = document.getElementById("Año").value;
    let ParametroInicio = Año + '-0' + (FechaInicio) + '-01'
    let ParametroFin = Año + '-0' + (FechaFin) + '-01'
    var Pivote = FechaInicio;
    var sheet_1_data = [];
    sheet_1_data.push(['Clave', 'Producto', 'Almacen', 'Salida', 'Stock', 'StockMin', 'StockMax', 'Utilizado']);
    for (let Mes = FechaInicio; Mes < FechaFin; Mes++) {

         $.ajax({
            url: '/ConsultaPrueba/' + ParametroInicio + '|' + ParametroFin + '|' + Mes,
            success: function (Herramientas) {
                for (var j = 0; j < Herramientas[0].length; j++) { //filas 
                    var Clave = Herramientas[0][j].Clave
                    var Producto = Herramientas[0][j].Producto
                    var Almacen = Herramientas[0][j].Almacen
                    var Salida = Herramientas[0][j].Salida
                    var Stock = Herramientas[0][j].Stock
                    var StockMin = Herramientas[0][j].StockMin
                    var StockMax = Herramientas[0][j].StockMax
                    var Utilizado = Herramientas[0][j].Utilizado
                    var Fila = [Clave, Producto, Almacen, Salida, Stock, StockMin, StockMax, Utilizado]

                } //fin filas  

                //Registrar primera corrida
                console.log(Mes +" "+ Pivote)
                if (Pivote == Mes) {
                    console.log(Mes +" Entre "+ Pivote)
                    sheet_1_data.push(Fila);
                    console.log(sheet_1_data);
                } else {
                    console.log("Dentro del else")
                    console.log(sheet_1_data);
                    // Valor que deseas encontrar
                    const valorBuscado = 'Prueba';
                    // Utilizando el método find()
                    const arregloEncontrado = sheet_1_data.find(arr => arr.includes(valorBuscado));
                    // Verificando si se encontró el arreglo
                    if (arregloEncontrado) {
                        console.log('Se encontró el arreglo:', arregloEncontrado);
                    } else {
                        console.log('No se encontró el arreglo con el valor buscado.');
                    }
                } 

                var opts = [{
                    sheetid: 'Hoja1',
                    header: true
                }];
                //var result = alasql('SELECT * INTO XLSX("Reporte.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
            } //Funcion success
        }); //Ajax 
    }



}



function ReporteConsumos() {
    $("#ReporteConsumos").modal();
}

function ModalAjuste() {
    $("#loading").modal();
}
