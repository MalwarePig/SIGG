//CONSULTAR Lineas -- BOTON BUSCAR    
function Carga() {
    var Planta = document.getElementById("Planta").value;
    var Area = document.getElementById("Area").value;
    $.ajax({
        url: '/ConsultaFlujo/' + Planta + " " + Area,
        success: function (Lineas) {
            console.table(Lineas);
            var Arreglo = [];
            //Limpiar tabla 
            var Tabla = document.getElementById('Tabla').getElementsByTagName('tbody')[0];
            var limite = Tabla.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows"+i).remove(); //elimina los elementos con id Rows
            }
            if (Lineas.length == 0) {
                $("#Vacio").modal();
            }
            for (var i = 0; i < Lineas.length; i++) {
                var id = Lineas[i].id;
                var OT = Lineas[i].OT;
                var Parte = Lineas[i].Parte;
                var Cantidad = Lineas[i].CantOt;
                var Planta = Lineas[i].Planta;
                var Area = Lineas[i].Fisico;
                var Inicio = Lineas[i].FechaInicio;
                var Vencimiento = Lineas[i].FechaVenc;
                //Eliminar variable dentro del For
                Arreglo = [id,OT,Parte,Cantidad, Planta, Area,Inicio,Vencimiento];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"+i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    newRow.setAttribute("onclick","Ejemplos("+Lineas[i].OT+")"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
} //Evento clic


function Ejemplos(x){
    alert(x);
}


