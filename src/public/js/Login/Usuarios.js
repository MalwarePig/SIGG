function GETPRODUCTS() {
    $.ajax({
        url: '/listarUsuarios/',
        success: function (data) {
            
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('TablaUsuarios').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
            }
            if (data.length == 0) {
                $("#Vacio").modal();
            }
            for (var i = 0; i < data.length; i++) {
                var id = data[i].id;
                var Nombre = data[i].Nombre;
                var usuario = data[i].usuario;
                var pass = data[i].pass;
                var Planta = data[i].Planta;
                var Area = data[i].Area;
                var Nivel = data[i].Nivel;
                var Turno = data[i].Turno;
                //Eliminar variable dentro del For
                Arreglo = [id, Nombre, usuario, pass, Planta, Area, Nivel, Turno]
                var TablaAlmacen = document.getElementById('TablaUsuarios').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);

                    if (x == 4) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(5); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-danger" name="btn" onclick=Eliminar(' + Arreglo[0] + ')><i class="fa-solid fa-user-xmark"></i></button>';
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
} //Evento clic



function Eliminar(id) {
    var data = {
        id: id
    }
    console.log(data);
    $.post("/EliminarUsuario", // url
        {
            data
        }, // data to be submit
        function (Estado, status) { // success callback
            console.log(Estado + status);
            if (Estado == true) {
                var myModal = new bootstrap.Modal(document.getElementById('Cambios'), {
                    keyboard: false
                  })
                  myModal.show()
          
                  setTimeout(() => {
                    myModal.hide();
                  }, 1500);
                GETPRODUCTS()
            }else{
                var myModal = new bootstrap.Modal(document.getElementById('Error'), {
                    keyboard: false
                  })
                  myModal.show()
          
                  setTimeout(() => {
                    myModal.hide();
                  }, 1500);
            }
        })
}