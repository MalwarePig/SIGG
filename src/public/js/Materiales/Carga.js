function GuardarRecepcion() { //Ejecutar codigo al dar click en boton
    var i = 0; //Contador para brincar la cabaezera y suar la referencia de indice
    var Arreglo = [];

    $('#wrapper tr').each(function () { //leer una tabla html    
        if (i > 0 && ($(this).find("td").eq(1).html() !== '')) { //Iniciar despues de cabezera de tabla y OT sea diferente de Null

            var OT = $(this).find("td").eq(0).html();
            var NoParte = $(this).find("td").eq(1).html(); //LEER LA TABL;
            var Proveedor = $(this).find("td").eq(2).html();
            var Colada = $(this).find("td").eq(3).html();
            var OD = $(this).find("td").eq(4).html();
            var ID = $(this).find("td").eq(5).html();
            var LG = $(this).find("td").eq(6).html();
            var QTY = $(this).find("td").eq(7).html();
            var SPEC = $(this).find("td").eq(8).html();
            var Ubicacion = $(this).find("td").eq(9).html();
            var PESO = $(this).find("td").eq(10).html();
            var Entrada = $(this).find("td").eq(11).html();
            var Salida = $(this).find("td").eq(12).html();
            var Entregado = $(this).find("td").eq(13).html();
            var Status = $(this).find("td").eq(14).html();
            var Sobran = $(this).find("td").eq(15).html();
            var Usado = $(this).find("td").eq(16).html();
            var Notas = $(this).find("td").eq(17).html();
            var Tabla = [OT, NoParte, Proveedor, Colada, OD, ID, LG, QTY, SPEC, Ubicacion, PESO, Entrada, Salida, Entregado, Status, Sobran, Usado, Notas];
            Arreglo.push(Tabla);
        }

        i++;
    }); //each para recorrer tabla
    console.table(Arreglo);
    $.post("/CargaMaterial", // url
        {
            Arreglo
        }, // data to be submit
        function (Tablas, status) { // success callback
            console.log(Tablas + status);
        })

    var elemento = document.getElementById("wrapper");
    document.body.removeChild(elemento);
    setTimeout("Barra()", 1000); //Tiempo para reedireccionar

    /*var elemento = document.getElementById("wrapper");
    document.body.removeChild(elemento);
    alert("Registrado en BD");*/
}


function Barra() {
    $("#ModalBarra").modal(); 
    var n = 0;   
    window.setInterval(function () {
        $('#Barra').width(n + "%").attr('aria-valuenow', n);
        n += 20;
        if(n === 120){
            setTimeout("Recargar()", 1000); //Tiempo para reedireccionar
        }
    }, 2000);
}

function Recargar(){
    location.reload();
}