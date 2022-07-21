//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
function getInspectors() {
    var BInspector = document.getElementById("BInspector").value;
    $.ajax({
        url: '/ListarPersonalCalidad/' + BInspector,
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('TablaInspectores').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
            }
            if (Herramientas.length == 0) {
                $("#Vacio").modal();
            }
            for (var i = 0; i < Herramientas.length; i++) {
                var Nombre = Herramientas[i].Nombre;
                var Nomina = Herramientas[i].Nomina;
                var Planta = Herramientas[i].Planta;
                var Puesto = Herramientas[i].Puesto;

                //Eliminar variable dentro del For
                Arreglo = [Nombre, Nomina, Planta, Puesto]
                var TablaAlmacen = document.getElementById('TablaInspectores').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);

                    if (x == 3) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(4); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-warning" name="btn" onclick= EliminarInspector("' + Arreglo[1] + '")> <i class="fas fa-user-slash"></i></button>' +
                            '<button id="' + i + '" class="btn btn-success" name="btn" onclick= ActivarInspector("' + Arreglo[1] + '")> <i class="fas fa-user-plus"></i> </button>';
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
} //Evento clic

function runScript(e) {
    if (e.keyCode == 13) {
        getInspectors();
    }
}

function ActivarInspector(Nomina) {
    $.ajax({
        url: '/ActivarInspector/' + Nomina,
        success: function (data) {
            getInspectors()
        } //Funcion success
    }); //Ajax
}

function EliminarInspector(Nomina) {
    $.ajax({
        url: '/EliminarInspector/' + Nomina,
        success: function (data) {
            getInspectors()
        } //Funcion success
    }); //Ajax
}


