var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function ListarMeses() {

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

            for (var i = 0; i < meses.length; i++) { //Agregar nuevos options del select 
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
async function ListadoDespacho() {//Obtiene la lista de productos despachados
    //Meses del 0 - 11 JS & MSQL 1 - 12
    FechaInicio = parseInt(document.getElementById("FechaInicio").value) + 1;
    FechaFin = parseInt(document.getElementById("FechaFin").value) + 2;
    TotalMeses = (FechaFin) - FechaInicio;

    alert("Primer Mes " + FechaInicio + " - " + FechaFin + " total = " + TotalMeses)

    let myPromise = new Promise(function (resolve, reject) {

        let Año = document.getElementById("Año").value;
        let ParametroInicio = Año + '-0' + (FechaInicio) + '-01'
        let ParametroFin = Año + '-0' + (FechaFin) + '-01'
        /*  alert("Alert: " + ParametroInicio + " - " + ParametroFin) */
        /*********************************° Estructura °*********************************/

        $.ajax({
            url: '/ListadoDespacho/' + ParametroInicio + '|' + ParametroFin,
            success: function (Herramientas) {
                /*     console.table(Herramientas) */
                ResultadoLista = Herramientas;

                resolve(Herramientas);

            } //Funcion success
        }); //Ajax 
    });

    var ResultadosPromesa = await myPromise;
    let SegundaPromesa = new Promise(function (resolve, reject) {
        for (let h = 0; h < ResultadosPromesa.length; h++) {//For por cada Herramienta
            var Producto = ResultadosPromesa[h].Producto;
            var Almacen = ResultadosPromesa[h].Almacen;
            let RespuestaConsumos = ConsumoMensual(Producto, Almacen)
            Tabla.push(RespuestaConsumos);
        }//For de herramientas
        resolve(Tabla);
    });

    Promise.all(Tabla)//Esperar la tabla de promesas
        .then(resultados => {
            // `resultados` es un arreglo que contiene los resultados de cada promesa
            // console.log(Object(resultados[])[5]); 
            TablaConsumos = resultados;

            console.log(resultados);
            DetalleHerramienta()
        })
        .catch(error => {
            // Manejo de errores si alguna de las promesas se rechaza
            console.error(error);
        });
}


async function ConsumoMensual(Producto, Almacen) {
    //Meses del 0 - 11 JS & MSQL 1 - 12  
    var Fila = []

    let Promesa = new Promise(function (resolve, reject) {
        Fila.push(Producto);
        Fila.push(Almacen);

        for (let index = FechaInicio; index <= FechaFin; index++) {//For por cada mes
            //lert("Producto: " + Producto + " Mes: " + index)
            $.ajax({
                url: '/SumaMensual/' + Producto + '|' + index + '|' + Almacen,//Lista de herramientas y su almacen
                success: function (data) {
                    Resultado = data[0].Utilizado || 0
                    Fila.push(Resultado.toString());
                }//Funcion success
            });//Ajax
        }
        setTimeout(() => {
            resolve(Fila)
        }, "1000");
    });
    let FilaCompleta = await Promesa;
    return FilaCompleta
}

async function DetalleHerramienta() {
    console.log("Enntre a detalles")
    for (let index = 0; index < TablaConsumos.length; index++) {
        let Herramienta = TablaConsumos[index][0];
        let Planta = TablaConsumos[index][1];
        let Promesa = new Promise(function (resolve, reject) {
            $.ajax({
                url: '/DetalleHerramienta/' + Herramienta + '|' + Planta,//Lista de herramientas y su almacen
                success: function (data) {
                    resolve(data)

                }//Funcion success
            });//Ajax
        });

        var ResultadosPromesa = await Promesa;
        TablaConsumos[index].push(ResultadosPromesa[0].Clave)
        TablaConsumos[index].push(ResultadosPromesa[0].Producto)
        TablaConsumos[index].push(ResultadosPromesa[0].Almacen)
        TablaConsumos[index].push(ResultadosPromesa[0].Stock)
        TablaConsumos[index].push(ResultadosPromesa[0].StockMin)
        TablaConsumos[index].push(ResultadosPromesa[0].StockMax)
        TablaConsumos[index].push(ResultadosPromesa[0].Familia)
        TablaConsumos[index].push(ResultadosPromesa[0].Precio)
        TablaConsumos[index].push(ResultadosPromesa[0].Moneda)
        TablaConsumos[index].push(ResultadosPromesa[0].Proveedor)


    }
    setTimeout(() => {
        //console.log(TablaConsumos)
        ExcelArticulo()
    }, "4000");
}




function ExcelArticulo() {
    var total = TablaConsumos.length //Total de filas 
    var sheet_1_data = [];
    var columnasDinamicas = TotalMeses + 3;//Determina cuantas columnas ocupan los meses

    var Encabezado = ['Descripción', 'Almacen']
    for (var index = 0; index < total; index++) { //filas
        var indiceDinamico = columnasDinamicas + 10; //Columnas restantes, tabla de detalles de almacen
        //let Clave = TablaConsumos[index][0]

        let Producto = TablaConsumos[index][0]
        let Planta = TablaConsumos[index][1]
        var Fila = [Producto, Planta]
        var MesIndice = FechaInicio

        for (let j = 2; j < (columnasDinamicas - 1); j++) { //Valores de despacho mensuales 
            //Meses del 0 - 11 JS 
            if (index == 0) {
                Encabezado.push(meses[(MesIndice - 1)])
            }

            /*  console.log(meses[(MesIndice-1)]) */
            MesIndice++
            Fila.push(TablaConsumos[index][j])
        }

        for (let d = columnasDinamicas; d <= indiceDinamico; d++) {//Valores de detalles 
            Fila.push(TablaConsumos[index][d])
        }

        if (index == 0) {
            Encabezado.push('Clave', 'Producto', 'Almacen', 'Stock', 'StockMin', 'StockMax', 'Familia', 'Precio', 'Moneda', 'Proveedor')
            sheet_1_data.push(Encabezado);
        }

        /* let Stock = TablaConsumos[index][13]
        let StockMin = TablaConsumos[index][14]
        let StockMax = TablaConsumos[index][15]
        let Familia = TablaConsumos[index][16]
        let Precio = TablaConsumos[index][17]
        let Moneda = TablaConsumos[index][18]
        let Proveedor = TablaConsumos[index][19]
        var Fila = [Clave, Producto, Almacen, Stock, StockMin, StockMax, Familia, Precio, Moneda, Proveedor] */
        sheet_1_data.push(Fila);
    } //fin filas 


    var opts = [{
        sheetid: 'Sheet One',
        header: true
    }];

    var result = alasql('SELECT * INTO XLSX("ReporteArticulo.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}




function name() {
 
    $.ajax({
        url: '/TodoDespachos/',//Lista de herramientas y su almacen
        success: function (data) {
            resolve(data)
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                
            } 
        }//Funcion success
    });//Ajax 
}