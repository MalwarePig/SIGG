//Mostrar Modal - Nuevo Articulo
function modal() {
    console.log("alerta")
    $("#ModalProveedor").modal();
}

//=========================================== Registrar Proveedor =================================================//
function RegistroProveedor() { 
    var Proveedor = document.getElementById("Proveedor").value;
    var ObjetoTabla = {
        Proveedor: Proveedor 
    }

    $.post("/RegistroProveedor", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            if (objeto == true) {
                //alert("Cambios realizados")
                $("#Cambios").modal();
                CargarProveedorSec()

            }
        });
}

function CargarProveedorSec() { 
    $.ajax({
        url: '/getProveedores',
        success: function (data) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('TablaProveedores').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
            }
            if (data.length == 0) {
                $("#Vacio").modal();
            }
            for (var i = 0; i < data.length; i++) {
                var Nombre = data[i].Nombre; 
                //Eliminar variable dentro del For
                Arreglo = [Nombre]
                var TablaAlmacen = document.getElementById('TablaProveedores').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);

                    if (x == 0) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(1); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-danger btn-sm" name="btn" onclick=EliminarProveedor(' + (data[i].id) + ')><i class="fas fa-trash"></i></button>';
                    }
                } //fin de for de columnas
            } //fin de for de filas  
        } //Funcion success
    }); //Ajax 
}

//=========================================== Actualizar Seleccion =================================================//
function EliminarProveedor(indice) {
  
    var ObjetoTabla = {
        id: indice 
    }

    $.post("/EliminarProveedor", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            if (objeto == true) {
                //alert("Cambios realizados")
                $("#ModalProveedorEliminado").modal();
                CargarProveedorSec()

            }
        });
}
