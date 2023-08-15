
//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
function GETPRODUCTS() {
    var variable = Tranformer(document.getElementById("BHerramienta").value); //Cambia el simbolo '/'
    $.ajax({
        url: '/BuscarHerramientasGav/' + variable,
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
                var Planta = Herramientas[i].Planta
                var Familia = Herramientas[i].Familia || '-';

                var Marca = Herramientas[i].Marca || '-';
                var Grado = Herramientas[i].Grado || '-';
                var MedidaDiametro = Herramientas[i].MedidaDiametro || '-';
                var Tipo = Herramientas[i].Tipo || '-';
                //Eliminar variable dentro del For
                Arreglo = [id, Clave, Planta, Familia, Marca, Grado, MedidaDiametro, Tipo]
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
                            newCell.innerHTML = '<input type="text" id="Planta' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly></input>';
                            break;
                        case 3:
                            newCell.innerHTML = '<input type="text" id="Familia' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly></input>';
                            break;
                        case 4:
                            newCell.innerHTML = '<input required type="text" id="Marca' + i + '" class="form-control" placeholder="Precio.." value="' + Arreglo[x] + '" readonly></input>';
                            break;
                        case 5:
                            newCell.innerHTML = '<input required type="text" id="Grado' + i + '" class="form-control" placeholder="E5C9..." value="' + Arreglo[x] + '" readonly></input>';
                            break;
                        case 6:
                            newCell.innerHTML = '<input required type="text" id="MedidaDiametro' + i + '" class="form-control" placeholder="E5C9..." value="' + Arreglo[x] + '" readonly></input>';
                            break;
                        case 7:
                            newCell.innerHTML = '<input required type="text" id="Tipo' + i + '" class="form-control" placeholder="E5C9..." value="' + Arreglo[x] + '" readonly></input>';
                            break;

                        default:
                            break;
                        // code block
                    }
                    if (x == 7) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(8); //CREAR CELDA
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
        url: '/BuscarGavetaId/' + id,
        success: function (Herramientas) {
            ModalFormulario()
            console.log(Herramientas)
            /*Clave,Familia,Marca, Grado, Tipo, Descripcion, MedidaDiametro, Parte, Ubicacion, Link, Comentario */
            var Clave = Herramientas[0].Clave || '-';
            var Planta = Herramientas[0].Planta
            var Familia = Herramientas[0].Familia || '-';
            SeleccionarFamiliaDefault(Familia);
            var Marca = Herramientas[0].Marca || '-';
            var Grado = Herramientas[0].Grado || '-';
            var MedidaDiametro = Herramientas[0].MedidaDiametro || '-';
            var Tipo = Herramientas[0].Tipo || '-';
            var Descripcion = Herramientas[0].Descripcion || '-';
            var Parte = Herramientas[0].Parte || '-';
            var Ubicacion = Herramientas[0].Ubicacion || '-';
            var Link = Herramientas[0].Link || '-';
            var Comentario = Herramientas[0].Comentarios || '-';
            var Precio = Herramientas[0].Precio || '-';

            document.getElementById("N_id").value = id;
            document.getElementById("N_Clave").value = Clave;
            document.getElementById("N_Planta").value = Planta;
            document.getElementById("N_Marca").value = Marca;
            document.getElementById("N_Grado").value = Grado;
            document.getElementById("N_Diametro").value = MedidaDiametro;
            document.getElementById("N_Tipo").value = Tipo;
            document.getElementById("N_Descripcion").value = Descripcion;
            document.getElementById("N_Parte").value = Parte;
            document.getElementById("N_Ubicacion").value = Ubicacion;
            document.getElementById("N_Link").value = Link;
            document.getElementById("N_Comentarios").value = Comentario;
            document.getElementById("N_Precio").value = Precio;
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


function CargarProveedor(indice) {
    console.log("lista usada " + indice)
    var listProveedor = document.getElementById("Proveedor" + indice);

    $.ajax({
        url: '/getProveedores',
        success: function (data) {
            console.log(data)
            for (let i = listProveedor.options.length; i >= 0; i--) { //Borrar elementos option de select
                listProveedor.remove(i);
            }

            for (var i = 0; i < data.length; i++) { //Agregar nuevos options del select 
                var option = document.createElement("option");
                option.text = data[i].Nombre;
                option.value = data[i].Nombre;
                listProveedor.add(option);
            }
        } //Funcion success
    }); //Ajax
}

function CargarProveedorSec(indice) {
    console.log("lista usada " + indice)
    var listProveedor = document.getElementById("ProveedorSec" + indice);

    $.ajax({
        url: '/getProveedores',
        success: function (data) {
            for (let i = listProveedor.options.length; i >= 0; i--) { //Borrar elementos option de select
                listProveedor.remove(i);
            }

            for (var i = 0; i < data.length; i++) { //Agregar nuevos options del select 
                var option = document.createElement("option");
                option.text = data[i].Nombre;
                option.value = data[i].Nombre;
                listProveedor.add(option);
            }
        } //Funcion success
    }); //Ajax
}



//=========================================== BUSCAR MAQUINAS POR TIPO DE FAMILIA =================================================//
function CargarFamilias() {
    var listFamilia = document.getElementById("N_Familia");
    var listMaquinaNew = document.getElementById("New_Familia");
    $.ajax({
        url: '/ListaFamiliasGaveta/',
        success: function (Familia) {
            console.log(Familia)
            for (let i = listFamilia.options.length; i >= 1; i--) { //Borrar elementos option de select
                listFamilia.remove(i);
                listMaquinaNew.remove(i);
            }
            for (var i = 0; i < Familia.length; i++) { //Agregar nuevos options del select
                var option = document.createElement("option");
                option.text = Familia[i].Familia;
                listFamilia.add(option);
                // listMaquinaNew.add(option);
            }
            for (var i = 0; i < Familia.length; i++) { //Agregar nuevos options del select 
                var option = document.createElement("option");
                option.text = Familia[i].Familia;
                listMaquinaNew.add(option);
            }
        } //Funcion success
    }); //Ajax
}


function ModalFormulario() { 
    var myModal = new bootstrap.Modal(document.getElementById('ModalFormulario'), {
        keyboard: false
    })

    myModal.show()
}

function SeleccionarFamiliaDefault(data) {
    var listFamilia = document.getElementById("N_Familia");
    for (var i = 0; i < listFamilia.length; i++) { //Agregar nuevos options del select  
        if (data == listFamilia.options[i].value) {
            listFamilia.options[i].selected = true
        }
    }
}

function GuardarCambiosGaveta() {
    id = document.getElementById("N_id").value;
    Clave = document.getElementById("N_Clave").value;
    Planta = document.getElementById("N_Planta").value;
    Familia = document.getElementById("N_Familia").value;
    Marca = document.getElementById("N_Marca").value;
    Grado = document.getElementById("N_Grado").value;
    MedidaDiametro = document.getElementById("N_Diametro").value;
    Tipo = document.getElementById("N_Tipo").value;
    Descripcion = document.getElementById("N_Descripcion").value;
    Parte = document.getElementById("N_Parte").value;
    Ubicacion = document.getElementById("N_Ubicacion").value;
    Link = document.getElementById("N_Link").value;
    Comentario = document.getElementById("N_Comentarios").value;
    Precio = document.getElementById("N_Precio").value;

    var ObjetoTabla = {
        id: id,
        Clave: Clave,
        Planta: Planta,
        Familia: Familia,
        Marca: Marca,
        Grado: Grado,
        MedidaDiametro: MedidaDiametro,
        Tipo: Tipo,
        Descripcion: Descripcion,
        Parte: Parte,
        Ubicacion: Ubicacion,
        Link: Link,
        Comentario: Comentario,
        Precio: Precio
    }

    $.post("/GuardarCambiosGaveta", // url
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

                var myModal = new bootstrap.Modal(document.getElementById('ModalFormulario'), {
                    keyboard: false
                })
            
                myModal.hide() 
 
            }
        });
}


function GuardarNuevoGaveta() {
    console.log(1)
    Clave = document.getElementById("New_Clave").value;
    Familia = document.getElementById("New_Familia").value;
    Planta = document.getElementById("New_Planta").value;
    Marca = document.getElementById("New_Marca").value;
    Grado = document.getElementById("New_Grado").value;
    MedidaDiametro = document.getElementById("New_Diametro").value;
    Tipo = document.getElementById("New_Tipo").value;
    Descripcion = document.getElementById("New_Descripcion").value;
    Parte = document.getElementById("New_Parte").value;
    Ubicacion = document.getElementById("New_Ubicacion").value;
    Link = document.getElementById("New_Link").value;
    Comentario = document.getElementById("New_Comentarios").value;
    Precio = document.getElementById("New_Precio").value;
    Nuevo = document.getElementById("New_Nuevo").value || 0;
    Usado = document.getElementById("New_Usados").value || 0;

    var ObjetoTabla = {
        Clave: Clave,
        Planta: Planta,
        Familia: Familia,
        Marca: Marca,
        Grado: Grado,
        MedidaDiametro: MedidaDiametro,
        Tipo: Tipo,
        Descripcion: Descripcion,
        Parte: Parte,
        Ubicacion: Ubicacion,
        Link: Link,
        Comentario: Comentario,
        Precio: Precio,
        Nuevo: Nuevo,
        Usado: Usado
    }

    $.post("/GuardarNuevoGaveta", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            if (objeto == true) {
                var miModal = new bootstrap.Modal(document.getElementById('Cambios'));
                miModal.show();


                /* 
                
                                $("#Cambios").modal();
                                $('#ModalFormularioNuevo').modal('hide') */
            }
        });
}

function CerrarModal() {

    var miModals = new bootstrap.Modal(document.getElementById('ModalFormularioNuevo'));
    miModals.hide();
}

var idEliminarGaveta = ""
function TomarIdEliminar() {
    idEliminarGaveta = document.getElementById("N_id").value;
}

function EliminarGaveta() {
    var ObjetoTabla = {
        id: idEliminarGaveta,
    }

    $.post("/EliminarGaveta", // url
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