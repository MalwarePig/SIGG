function Modal() {
 
    $("#ModalAuditoria").modal();
}

function Aplicar() {
    var tabla = document.getElementById("Registros");
    var total = tabla.rows.length //Total de filas

    var Arreglo = [];
    var ObjetoTabla = {};
    for (var j = 1; j <= total - 1; j++) { //Recorer filas
        var Check = document.getElementById(j); //Obtener filas seleccionadas
        if (Check.checked == true) {
            ObjetoTabla = {
                Producto: tabla.rows[j].cells[1].childNodes[0].nodeValue,
                Cantidad: tabla.rows[j].cells[2].childNodes[0].nodeValue,
            }
            Arreglo.push(ObjetoTabla);
        }
    }

    for (var i = 0; i < Arreglo.length; i++) {
        var Datos = {
            Producto: Arreglo[i].Producto,
            Cantidad: Arreglo[i].Cantidad
        }
        $.post("/CheckAuditoria", // url
            {
                Datos
            }, // data to be submit
            function (objeto, estatus) { // success callback
                console.log( estatus);
            });
    }
	setTimeout ("redireccionar()", 1500);
}
 

function redireccionar() {
    var objeto = {//objeto vacio
        estatus : true
    }

    $.post("/EstatusAudi", // url
    {
        objeto
    }, // data to be submit
    function (objeto, estatus) { // success callback
    });
   /* var pagina="/wh_Salidas";
    location.href=pagina*/
}