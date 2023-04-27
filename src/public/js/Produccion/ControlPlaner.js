

function saveVistaPlanta() {
    var tabla = document.getElementsByTagName("table")[0];

    var total = tabla.rows.length//Total de filas



    for (j = 1; j <= total - 1; j++) {//filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var nPart = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Cantidad = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Maquina = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var Inicio = tabla.rows[j].cells[10].childNodes[0].nodeValue;
        var Vencimiento = tabla.rows[j].cells[10].childNodes[0].nodeValue;
        //alert(total);
        alert("OT: " + OT + " nPart: " + nPart + " Cantidad: " + Cantidad + " Maquina: " + Maquina + " Inicio: " + Inicio + " Vencimiento: " + Vencimiento);
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
                Clave: $(this).find("td").eq(0).html(),
                Producto: $(this).find("td").eq(1).html(),//LEER LA TABLA
                Almacen: $(this).find("td").eq(2).html(),
                Min: $(this).find("td").eq(4).html(),
                Max: $(this).find("td").eq(5).html(),
                Proveedor: $(this).find("td").eq(8).html(),
                Precio: $(this).find("td").eq(9).html(),
                Moneda: $(this).find("td").eq(10).html(),
                tEntrega: $(this).find("td").eq(11).html(),
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