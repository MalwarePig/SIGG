//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
function GETPRODUCTS() {
    var variable = Tranformer(document.getElementById("BHerramienta").value); //Cambia el simbolo '/'
    //var Planta = document.querySelector('input[name="inlineRadioOptions"]:checked').value; 
    $.ajax({
        url: '/BuscarHerramientasEditar/' + variable,
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
            }
            if (Herramientas.length == 0) {
                $("#Vacio").modal();
            }
            for (var i = 0; i < Herramientas.length; i++) {
                var id = Herramientas[i].id;
                var Clave = Herramientas[i].Clave;
                var Producto = Herramientas[i].Producto;
                var Precio = Herramientas[i].Precio;
                var Ubicacion = Herramientas[i].Ubicacion;
                var Proveedor = Herramientas[i].Proveedor;
                var ProveedorSec = Herramientas[i].ProveedorSec || '-';
                var Familia = Herramientas[i].Familia || '-';
                //Eliminar variable dentro del For
                Arreglo = [id, Clave, Producto, Herramientas[i].Almacen, Precio, Ubicacion, Proveedor, ProveedorSec, Familia]
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
                            newCell.innerHTML = '<input required type="text" id="Clave' + i + '" class="form-control"  value="' + Arreglo[x] + '"></input>';
                            break;
                        case 2:
                            newCell.innerHTML = '<input type="text" id="Producto' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break;
                        case 3:
                            newCell.innerHTML = '<input type="text" id="Almacen' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly></input>';
                            break;
                        case 4:
                            newCell.innerHTML = '<input required type="text" id="Precio' + i + '" class="form-control" placeholder="Precio.." value="' + Arreglo[x] + '"></input>';
                            break;
                        case 5:
                            newCell.innerHTML = '<input required type="text" id="Ubicacion' + i + '" class="form-control" placeholder="E5C9..." value="' + Arreglo[x] + '"></input>';
                            break;
                        case 6:
                            var Prov = Arreglo[x] || '-';
                            newCell.innerHTML = '<select required id="Proveedor' + i + '" class="form-control" onFocus="CargarProveedor(' + i + ')">' +
                                '<option value="' + Prov + '" selected disabled>' + Prov + '</option></select>';
                            break;
                        case 7:
                            var ProvSec = Arreglo[x];
                            newCell.innerHTML = '<select required id="ProveedorSec' + i + '" class="form-control" onFocus="CargarProveedorSec(' + i + ')">' +
                                '<option value="' + ProvSec + '" selected disabled>' + ProvSec + '</option></select>';
                            break;

                        case 8:
                            var Familia = Arreglo[x];
                            newCell.innerHTML = '<select required id="Familia' + i + '" class="form-control" onFocus="CargarFamilias(' + i + ')">' +
                                '<option value="' + Familia + '" selected disabled>' + Familia + '</option></select>';
                            break;

                        default:
                            break;
                        // code block
                    }
                    if (x == 8) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(9); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (i + 1) + ')> <i class="fa-solid fa-pen-to-square"></i></button>';
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
    var indice = variable - 1;
    Registro = document.getElementById("Herr_Encontradas");
    var id = document.getElementById("id" + indice).value; //Obtiene el valor de id
    var Clave = document.getElementById("Clave" + indice).value; //Obtiene el valor de Clave
    var Producto = document.getElementById("Producto" + indice).value; //Obtiene el valor de Producto
    var Ubicacion = document.getElementById("Ubicacion" + indice).value; //Obtiene el valor de Ubicacion
    var Proveedor = document.getElementById("Proveedor" + indice).value; //Obtiene el valor de Proveedor
    var ProveedorSec = document.getElementById("ProveedorSec" + indice).value; //Obtiene el valor de Proveedor
    var Precio = document.getElementById("Precio" + indice).value; //Obtiene el valor de Precio
    var Familia = document.getElementById("Familia" + indice).value; //Obtiene el valor de Precio

    var ObjetoTabla = {
        id: id,
        Clave: Clave,
        Producto: Producto,
        Ubicacion: Ubicacion,
        Proveedor: Proveedor,
        ProveedorSec: ProveedorSec,
        Precio: Precio,
        Familia: Familia
    }

    $.post("/EditarProducto", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            if (objeto == true) {
                //alert("Cambios realizados")
                GETPRODUCTS()

                var miModal = new bootstrap.Modal(document.getElementById('Cambios'));
                miModal.show();
                //$("#Cambios").modal();
            }
        });
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



//=========================================== BUSCAR MAQUINAS POR TIPO DE FAMILIA =================================================//
function CargarFamilias(indice) {
    var listMaquina = document.getElementById("Familia" + indice);
    $.ajax({
        url: '/ListaFamilias/',
        success: function (maquinas) {
            console.log(maquinas)
            for (let i = listMaquina.options.length; i >= 1; i--) { //Borrar elementos option de select
                listMaquina.remove(i);
            }
            for (var i = 0; i < maquinas.length; i++) { //Agregar nuevos options del select

                var option = document.createElement("option");
                option.text = maquinas[i].Familia;
                listMaquina.add(option);
            }
        } //Funcion success
    }); //Ajax
}