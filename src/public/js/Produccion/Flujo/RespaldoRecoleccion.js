
//=========================================== Asignar fecha de inicio de operaciones =================================================//
function Recolectar() {
    var LocalArea = localStorage.getItem('Area');
    if (LocalArea != 'Producción') { //Si el area es diferente de produccion alimentar tabla de pendientes{
        var tabla = document.getElementById("TablaNotaOT").getElementsByTagName('tbody')[0];
        var total = tabla.rows.length //Total de filas
        var EliminarFila = [];
        var Tabla = [];
        for (var i = 0; i < total; i++) {

            var id = document.getElementById("idOTActual").value;
            var Producto = tabla.rows[i].cells[1].childNodes[0].nodeValue;
            var Parte = tabla.rows[i].cells[2].childNodes[0].nodeValue;
            var Cantidad = document.getElementById("Nomina" + i).value;
            var Fila = [id, Producto, Parte, Cantidad];
            console.table(Fila);
            Tabla.push(Fila);
            EliminarFila.push(i);
        }

        $.post("/IniciarProdFlujo", // inicia la lista de ot en el flujo de produccion
            {
                Tabla
            }, // data to be submit
            function (objeto, estatus) { // success callback
                if (objeto == true) {
                    Pendientes();
                }
            });

        document.getElementById("OTBuscar").value = "";

        for (var j = 0; j < EliminarFila.length; j++) {
            $("#RowsF" + EliminarFila[j]).remove(); //elimina los elementos con id Rows
        }
    } else { //Recoleccion para el area de Produccion solamente
        var tabla = document.getElementById("TablaRecoleccion");
        var total = tabla.rows.length //Total de filas
        var EliminarFila = [];
        var Tabla = [];

        for (var i = 1; i < total; i++) {
            var FilaCheck = document.getElementById("CheckPendiente" + (i - 1));
            if (FilaCheck.checked == true) {
                var Origen = document.getElementById("AreaOrigen" + (i - 1)).value;
                var id = tabla.rows[i].cells[0].childNodes[0].nodeValue;
                var Producto = tabla.rows[i].cells[1].childNodes[0].nodeValue;
                var Cantidad = tabla.rows[i].cells[2].childNodes[0].nodeValue;
                var Inicial = document.getElementById("Inicial" + (i - 1)).value;
                var Extra = document.getElementById("Extra" + (i - 1)).value;
                var Maquina = document.getElementById("ListMaquina").value;

                var Fila = [id, Producto, Inicial, Extra, Maquina];
                Tabla.push(Fila);
                EliminarFila.push(i);
                if ((Origen == 'N/A') || (Origen == 'Origen')) {
                    $.post("/AsignarCola", // inicia la lista de ot en el flujo de produccion
                        {
                            Tabla
                        }, // data to be submit
                        function (objeto, estatus) { // success callback
                            console.log(objeto)
                            if (objeto == true) {
                                Pendientes();
                            }
                        });
                } else {
                    $.post("/IniciarProdFlujo", // inicia la lista de ot en el flujo de produccion
                        {
                            Tabla
                        }, // data to be submit
                        function (objeto, estatus) { // success callback
                            console.log(objeto)
                            if (objeto == true) {
                                Pendientes();
                            }
                        });
                }
            }
        }

        console.table(Tabla);

        document.getElementById("OTBuscar").value = "";
        $("#RowsF").remove(); //elimina los elementos con id Rows
        // setTimeout("redireccionar()",10000); //Tiempo para reedireccionar
    } //Fin de else
}