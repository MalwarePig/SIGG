
//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
function GETPRODUCTS() {
    var variable = Tranformer(document.getElementById("BHerramienta").value); //Cambia el simbolo '/'
    $.ajax({
        url: '/BuscarHerramental/' + variable,
        success: function (Herramientas) {
            console.log(Herramientas)
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
            }
            if (Herramientas.length == 0) {
                var myModal = new bootstrap.Modal(document.getElementById('Vacio'), {
                    keyboard: false
                })

                myModal.show()
            }
            /* Clave,Familia,Marca, Grado, Tipo, Descripcion, MedidaDiametro, Parte, Ubicacion, Link, Comentario */
            /* Clave,Planta,Familia,Marca, Grado, MedidaDiametro, Tipo */
            for (var i = 0; i < Herramientas.length; i++) {
                var id = Herramientas[i].id;
                var Clave = Herramientas[i].Clave || '-';
                var Descripcion = Herramientas[i].Descripcion
                var Planta = Herramientas[i].Planta || '-';
                var Diametro = Herramientas[i].Diametro || '-';
                var Caracteristicas = Herramientas[i].Caracteristicas || '-';
                var Codigo = Herramientas[i].Codigo || '-';
                var Inserto = Herramientas[i].Inserto || '-';
                var Marca = Herramientas[i].Marca || '-';
                //Eliminar variable dentro del For
                Arreglo = [id, Clave, Descripcion, Planta, Diametro, Caracteristicas, Codigo, Inserto, Marca]
                var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado 
                    switch (x) {
                        case 0:
                            newCell.innerHTML = '<input required type="text" id="id' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                            break;
                        case 1:
                            newCell.innerHTML = '<input required type="text" id="Clave' + i + '" class="form-control"  value="' + Arreglo[x] + '" readonly></input>';
                            break;
                        case 2:
                            newCell.innerHTML = '<input type="text" id="Descripcion' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly></input>';
                            break;
                        case 3:
                            newCell.innerHTML = '<input type="text" id="Planta' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly></input>';
                            break;
                        case 4:
                            newCell.innerHTML = '<input required type="text" id="Diametro' + i + '" class="form-control" placeholder="Precio.." value="' + Arreglo[x] + '" readonly></input>';
                            break;
                        case 5:
                            newCell.innerHTML = '<input required type="text" id="Caracteristicas' + i + '" class="form-control" placeholder="E5C9..." value="' + Arreglo[x] + '" readonly></input>';
                            break;
                        case 6:
                            newCell.innerHTML = '<input required type="text" id="Codigo' + i + '" class="form-control" placeholder="E5C9..." value="' + Arreglo[x] + '" readonly></input>';
                            break;
                        case 7:
                            newCell.innerHTML = '<input required type="text" id="Inserto' + i + '" class="form-control" placeholder="E5C9..." value="' + Arreglo[x] + '" readonly></input>';
                            break;
                        case 8:
                            newCell.innerHTML = '<input required type="text" id="Marca' + i + '" class="form-control" placeholder="E5C9..." value="' + Arreglo[x] + '" readonly></input>';
                            break;

                        default:
                            break;
                        // code block
                    }
                    if (x == 8) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(9); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + i + ')> Ver </button>';
                    }
                } //fin de for de columnas
            } //fin de for de filas  
        } //Funcion success
    }); //Ajax
} //Evento clic

//=========================================== Buscar con evento Enter =================================================//
function runScript(e) {
    if (e.keyCode == 13) {
        GETPRODUCTS();
    }
}
//=========================================== Actualizar Seleccion =================================================//
function Seleccion(variable) {
    var id = document.getElementById("id" + variable).value;
    $.ajax({
        url: '/BuscarHerramentalID/' + id,
        success: function (Herramientas) {
            ModalFormulario()
            console.log(Herramientas)
            /*Clave,Familia,Marca, Grado, Tipo, Descripcion, MedidaDiametro, Parte, Ubicacion, Link, Comentario */
            var id = Herramientas[0].id;
            var Clave = Herramientas[0].Clave || '-';
            var Descripcion = Herramientas[0].Descripcion
            var Planta = Herramientas[0].Planta || '-';
            var Diametro = Herramientas[0].Diametro || '-';
            var Caracteristicas = Herramientas[0].Caracteristicas || '-';
            var Codigo = Herramientas[0].Codigo || '-';
            var Inserto = Herramientas[0].Inserto || '-';
            var Marca = Herramientas[0].Marca || '-';
            var Seat = Herramientas[0].Seat || '-';
            var Clamp = Herramientas[0].Clamp || '-';
            var Screw = Herramientas[0].Screw || '-';
            var Comentario = Herramientas[0].Comentario || '-';

            document.getElementById("E_id").value = id;
            document.getElementById("E_Clave").value = Clave;
            document.getElementById("E_Descripcion").value = Descripcion;
            document.getElementById("E_Planta").value = Planta;
            document.getElementById("E_Diametro").value = Diametro;
            document.getElementById("E_Caracteristicas").value = Caracteristicas;
            document.getElementById("E_Codigo").value = Codigo;
            document.getElementById("E_Inserto").value = Inserto;
            document.getElementById("E_Marca").value = Marca;
            document.getElementById("E_Seat").value = Seat;
            document.getElementById("E_Clamp").value = Clamp;
            document.getElementById("E_Screw").value = Screw;
            document.getElementById("E_Comentario").value = Comentario;
        } //Funcion success
    }); //Ajax
}

//Intercambiar el diagonal por otro simbolo para no tener problemas con el url
function Tranformer(variable) {
    var Herramienta = "";
    for (var q = 0; q < variable.length; q++) {
        if (variable.charAt(q) == '/') {
            Herramienta += '|';
        } else {
            Herramienta += variable.charAt(q);
        }
    }
    return Herramienta;
}

function ModalFormulario() {
    var myModal = new bootstrap.Modal(document.getElementById('ModalFormulario'), {
        keyboard: false
    })

    myModal.show()
}

function GuardarCambiosGaveta() {
    var ObjetoTabla = {
        id: document.getElementById("E_id").value,
        Clave: document.getElementById("E_Clave").value,
        Descripcion: document.getElementById("E_Descripcion").value,
        Planta: document.getElementById("E_Planta").value,
        Diametro: document.getElementById("E_Diametro").value,
        Caracteristicas: document.getElementById("E_Caracteristicas").value,
        Codigo: document.getElementById("E_Codigo").value,
        Inserto: document.getElementById("E_Inserto").value,
        Marca: document.getElementById("E_Marca").value,
        Seat: document.getElementById("E_Seat").value,
        Clamp: document.getElementById("E_Clamp").value,
        Screw: document.getElementById("E_Screw").value,
        Comentario: document.getElementById("E_Comentario").value
    }

    $.post("/GuardarCambiosHerramental", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            if (objeto == true) {
                //alert("Cambios realizados")
                var myModal = new bootstrap.Modal(document.getElementById('Cambios'), {
                    keyboard: false
                })
                myModal.show()

                GETPRODUCTS()
            }
        });
}

function GuardarNuevoHerramental() {
    var ObjetoTabla = {
        Clave: document.getElementById("New_Clave").value,
        Descripcion: document.getElementById("New_Descripcion").value,
        Planta: document.getElementById("New_Planta").value,
        Diametro: document.getElementById("New_Diametro").value,
        Caracteristicas: document.getElementById("New_Caracteristicas").value,
        Codigo: document.getElementById("New_Codigo").value,
        Inserto: document.getElementById("New_Inserto").value,
        Marca: document.getElementById("New_Marca").value,
        Seat: document.getElementById("New_Seat").value,
        Clamp: document.getElementById("New_Clamp").value,
        Screw: document.getElementById("New_Screw").value,
        Comentario: document.getElementById("New_Comentario").value
    }

    $.post("/GuardarNuevoHerramental", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            if (objeto == true) {
                var miModal = new bootstrap.Modal(document.getElementById('Cambios'));
                miModal.show();
            } else {
                var miModal = new bootstrap.Modal(document.getElementById('ErrorGuardar'));
                miModal.show();
            }
        });
}

var idEliminarGaveta = ""
function TomarIdEliminar() {
    idEliminarGaveta = document.getElementById("E_id").value;
}

function EliminarHerramental() {
    var ObjetoTabla = {
        id: idEliminarGaveta,
    }

    $.post("/EliminarHerramental", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            if (objeto == true) {
                //alert("Cambios realizados") 
                var myModal = new bootstrap.Modal(document.getElementById('ModalEliminar'), {
                    keyboard: false
                })

                myModal.hide()
                GETPRODUCTS()
            }
        });
}