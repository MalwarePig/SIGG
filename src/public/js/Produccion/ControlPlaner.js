

function saveVistaPlanta() {
    var tabla = document.getElementsByTagName("table")[0];

    var total = tabla.rows.length//Total de filas


    for (j = 1; j <= total - 1; j++) {//filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
        var id = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Clave = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Producto = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Almacen = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var Stock = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var StockMin = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var StockMax = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var StockUsado = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Ubicacion = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Estado = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var Categoria = tabla.rows[j].cells[10].childNodes[0].nodeValue;
        var Familia = tabla.rows[j].cells[11].childNodes[0].nodeValue;
        var Ordenado = tabla.rows[j].cells[12].childNodes[0].nodeValue;
        var Cotizado = tabla.rows[j].cells[13].childNodes[0].nodeValue;
        var VISIBLE = tabla.rows[j].cells[14].childNodes[0].nodeValue;
        var Proveedor = tabla.rows[j].cells[15].childNodes[0].nodeValue;
        var ProveedorSec = tabla.rows[j].cells[16].childNodes[0].nodeValue;
        var Precio = tabla.rows[j].cells[17].childNodes[0].nodeValue;
        var TiempoEntrega = tabla.rows[j].cells[18].childNodes[0].nodeValue;
        var Moneda = tabla.rows[j].cells[19].childNodes[0].nodeValue;
        var OC = tabla.rows[j].cells[20].childNodes[0].nodeValue;
        var FechaCreacion = tabla.rows[j].cells[21].childNodes[0].nodeValue;
        var Creador = tabla.rows[j].cells[22].childNodes[0].nodeValue;
        var Stockafilado = tabla.rows[j].cells[23].childNodes[0].nodeValue;
        //alert(total);
        console.log(Clave);
        ///////////////////////// INSERTAR DATOS ///////////////////////var date_format = new Date(date_input).toDateString("yyyy-MM-dd");
        //TECNO FON NPRONMEOL
    }
}

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
    return today
}


function ImportarExcel() {
    var i = 0;//Contador para brincar la cabaezera y usar la referencia de indice
    var Tabla = [];
    $('#wrapper tr').each(function () {//leer una tabla html   
        if (i > 0 && ($(this).find("td").eq(1).html() !== '')) {//Iniciar despues de cabezera de tabla y OT sea diferente de Null
            var indice = Object.keys(Tabla).length;//Cantidad de elementos dentro del objeto
            //console.log('indice' + i + " Producto " +  Producto);
            Tabla.push({//CREAR UN OBJETO MATRIS
                id: $(this).find("td").eq(0).html(),
                Clave: $(this).find("td").eq(1).html(),//LEER LA TABLA
                Producto: $(this).find("td").eq(2).html(),
                Almacen: $(this).find("td").eq(3).html(),
                Stock: $(this).find("td").eq(4).html(),
                StockMin: $(this).find("td").eq(5).html(),
                StockMax: $(this).find("td").eq(6).html(),
                StockUsado: $(this).find("td").eq(7).html(),
                Ubicacion: $(this).find("td").eq(8).html(),
                Estado: $(this).find("td").eq(9).html(),
                Categoria: $(this).find("td").eq(10).html(),
                Familia: $(this).find("td").eq(11).html(),
                Ordenado: $(this).find("td").eq(12).html(),
                Cotizado: $(this).find("td").eq(13).html(),
                VISIBLE: $(this).find("td").eq(14).html(),
                Proveedor: $(this).find("td").eq(15).html(),
                ProveedorSec: $(this).find("td").eq(16).html(),
                Precio: $(this).find("td").eq(17).html(),
                TiempoEntrega: $(this).find("td").eq(18).html(),
                Moneda: $(this).find("td").eq(19).html(),
                OC: $(this).find("td").eq(20).html(),
                FechaCreacion: $(this).find("td").eq(21).html(),
                Creador: $(this).find("td").eq(22).html(),
                Stockafilado: $(this).find("td").eq(23).html(), 
            })//fin de objeto})  
        }
        i++;
 
    });//each para recorrer tabla
    console.log(Tabla)

    $.post("/postCplaner", // url
            { Tabla }, // data to be submit
            function (Tabla, status) {// success callback
                console.log(Tabla);
            }) 
    var elemento = document.getElementById("wrapper");
    document.body.removeChild(elemento);
    alert("Registrado en BD"); 
}