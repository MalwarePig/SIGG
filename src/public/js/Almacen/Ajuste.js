//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
function GETPRODUCTS() {
    var Herramientas = Tranformer(document.getElementById("BHerramienta").value);
    var Planta = document.querySelector('input[name="inlineRadioOptions"]:checked').value;
    $.ajax({
        url: '/BuscarHerramientasAjuste/' + Herramientas + '|' + Planta,
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows" + i).remove(); //elimina los elementos con id Rows
            }
            if (Herramientas.length == 0) {
                var myModal = new bootstrap.Modal(document.getElementById('Vacio'), {
                    keyboard: false
                })

                myModal.show()
            }
            for (var i = 0; i < Herramientas.length; i++) {
                var id = Herramientas[i].id;
                var Clave = Herramientas[i].Clave;
                var Producto = Herramientas[i].Producto;
                var Planta = Herramientas[i].Almacen;
                var StockNuevo = Herramientas[i].Stock;
                var StockUsado = Herramientas[i].StockUsado;
                var StockMinimo = Herramientas[i].StockMin;
                var StockMaximo = Herramientas[i].StockMax;
                var StockAfilado = Herramientas[i].StockAfilado;
                var Categoria = Herramientas[i].Categoria;
                var Familia = Herramientas[i].Familia;
                //Eliminar variable dentro del For

                Arreglo = [id, Clave, Producto, Planta, StockNuevo, StockUsado, StockMinimo, StockMaximo, StockAfilado, Categoria, Familia]
                var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {

                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado

                    switch (x) {
                        case 0:
                            newCell.innerHTML = '<input required type="text" id="id' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                            break;
                        case 1:
                            newCell.innerHTML = '<input  type="text" id="Clave' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break;
                        case 2:
                            console.log(Arreglo[x])
                            newCell.innerHTML = '<input type="text" id="Producto' + i + '" class="form-control"  readonly></input>';
                            const Campo = document.getElementById('Producto' + i); //se renombra el id de la parte colapsador 
                            Campo.value = Arreglo[x];
                            break;
                        case 3:
                            var Almacen = "";
                            if (Arreglo[x] == "Almacen Morelos") {
                                Almacen = "Morelos";
                            } else if (Arreglo[x] == "Almacen Bravo") {
                                Almacen = "Bravo";
                            } else {
                                Almacen = "Gaveta";
                            }
                            newCell.innerHTML = '<input  type="text" id="Almacen' + i + '" class="form-control" value="' + Almacen + '" readonly></input>';
                            break;
                        case 4:
                            newCell.innerHTML = '<input  type="text" readonly id="StockNuevo' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break;
                        case 5:
                            newCell.innerHTML = '<input  type="text" id="StockUsado' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break;
                        case 6:
                            newCell.innerHTML = '<input  type="text" id="StockMinimo' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break;
                        case 7:
                            newCell.innerHTML = '<input  type="text" id="StockMaximo' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break;
                        case 8:
                            newCell.innerHTML = '<input  type="text" id="StockAfilado' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break;
                        case 9:
                            // newCell.innerHTML = '<input  type="text" id="Categoria' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            let cat = Arreglo[x] || '-';
                            newCell.innerHTML = '<select required id="Categoria' + i + '" class="form-select" onFocus=CargarCategorias(' + i + ')>' +
                                '<option value="' + cat + '" selected disabled>' + Arreglo[x] + '</option></select>';
                            break;
                        case 10:
                            var fam = Arreglo[x] || '-';
                            newCell.innerHTML = '<select required id="Familia' + i + '" class="form-select" onFocus="CargarFamilias(' + i + ')">' +
                                '<option value="' + fam + '" selected disabled>' + Arreglo[x] + '</option></select>';
                            break;
                    }

                    if (x == 4) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(
                            
                        ); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-danger" name="btn" onclick=Eliminar(' + (i + 1) + ') data-toggle="tooltip" data-placement="top" title="Eliminar producto"> <i class="fas fa-trash-alt"></i> </button>';

                        var newCell = newRow.insertCell(6); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-info" name="btn" onclick=ModalAjuste(' + (i + 1) + ') data-toggle="tooltip" data-placement="top" title="Actualizar producto"> <i class="fas fa-edit"></i> </button>';

                        var newCell = newRow.insertCell(7); //CREAR CELDA
                        newCell.innerHTML = '<button id="ActualizarUsados' + i + '" class="btn btn-success" name="btn" onclick=AjustarUsados(' + (i) + ') data-toggle="tooltip" data-placement="top" title="Actualizar campos"> <i class="fas fa-pen"></i></button>';
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
} //Evento click

//=========================================== Buscar con evento Enter =================================================//
function runScript(e) {
    if (e.keyCode == 13) {
        GETPRODUCTS();
    }
}


function ModalAjuste(variable) {
    var myModal = new bootstrap.Modal(document.getElementById('ModalAjuste'), {
        keyboard: false
    })

    myModal.show()
    document.getElementById("FilaAjuste").value = variable;
}



//=========================================== Actualizar Seleccion =================================================//
function Seleccion() {
    var indice = document.getElementById("FilaAjuste").value - 1;
    Registro = document.getElementById("Herr_Encontradas");

    var id = document.getElementById("id" + indice).value; //Obtiene el valor de id
    var Clave = document.getElementById("Clave" + indice).value; //Obtiene el valor de Clave
    var Producto = document.getElementById("Producto" + indice).value; //Obtiene el valor de Producto
    var StockNuevo = document.getElementById("StockNuevo" + indice).value; //Obtiene el valor de Producto
    var StockUsado = document.getElementById("StockUsado" + indice).value; //Obtiene el valor de Producto
    var StockMinimo = document.getElementById("StockMinimo" + indice).value; //Obtiene el valor de Producto
    var StockMaximo = document.getElementById("StockMaximo" + indice).value; //Obtiene el valor de Producto
    var Categoria = document.getElementById("Categoria" + indice).value; //Obtiene el valor de Producto
    var Familia = document.getElementById("Familia" + indice).value; //Obtiene el valor de Producto
    var Motivo = document.getElementById("Motivo").value;
    var NuevaCantidad = document.getElementById("NuevaCantidad").value;

    //var Ubicacion = document.getElementById("Ubicacion"+indice).value; //Obtiene el valor de Ubicacion

    var ObjetoTabla = {
        id: id,
        Clave: Clave,
        Producto: Producto,
        StockNuevo: StockNuevo,
        StockUsado: StockUsado,
        StockMinimo: StockMinimo,
        StockMaximo: StockMaximo,
        Categoria: Categoria,
        Familia: Familia,
        Motivo: Motivo,
        Nombre: localStorage.getItem("Nombre"),
        NuevaCantidad: NuevaCantidad,
        Planta: localStorage.getItem("PlantaGeneral")

    }

    console.table(ObjetoTabla);
    $.post("/ActualizarProducto", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            console.log("objeto: " + objeto + "Estatus: " + estatus);
            if (objeto == true) {
                var myModal = new bootstrap.Modal(document.getElementById('ModalAjuste'), {
                    keyboard: false
                })

                myModal.hide()
                document.getElementById("Motivo").value = "";
                document.getElementById("NuevaCantidad").value = "";
            }
        });
    alert("Listo");
}

//=========================================== Actualizar Seleccion Usado =================================================//
function AjustarUsados(variable) {

    var id = document.getElementById("id" + variable).value; //Obtiene el valor de id 
    var StockUsado = document.getElementById("StockUsado" + variable).value; //Obtiene el valor de Producto 
    var StockMinimo = document.getElementById("StockMinimo" + variable).value; //Obtiene el valor de Producto 
    var StockMaximo = document.getElementById("StockMaximo" + variable).value; //Obtiene el valor de Producto 
    var StockAfilado = document.getElementById("StockAfilado" + variable).value; //Obtiene el valor de Producto 

    //var Ubicacion = document.getElementById("Ubicacion"+indice).value; //Obtiene el valor de Ubicacion

    var ObjetoTabla = {
        id: id,
        StockUsado: StockUsado,
        StockMinimo: StockMinimo,
        StockMaximo: StockMaximo,
        StockAfilado: StockAfilado 
    }

    console.table(ObjetoTabla);
    $.post("/ActualizarProductoUsado", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            console.log("objeto: " + objeto + "Estatus: " + estatus);
            if (objeto == true) {
                GETPRODUCTS()
            }
        });
    alert("Listo");
}

//=========================================== Modal de confirmacion =================================================//
function Eliminar(variable) {
    //Se guarda fila para 
    localStorage.setItem('fila', (variable - 1));
    var fila = localStorage.getItem('fila');
    //id de producto a eliminar
    localStorage.setItem('idEliminar', document.getElementById("id" + fila).value);

    var Producto = document.getElementById("Producto" + fila).value; //Obtiene el valor de Producto
    //Se obtiene el nodo
    var Nodo = document.getElementById("ProductoSpan");
    //se crea texto para el nodo
    var newText = document.createTextNode(Producto);
    //se inserta el valor al nodo

    Nodo.appendChild(newText);

    var myModal = new bootstrap.Modal(document.getElementById('ConfirmarEliminar'), {
        keyboard: false
    })

    myModal.show()

}

//=========================================== Eliminar Selección =================================================//
function ConfirmarEliminacion() {
    var ObjetoTabla = {
        id: localStorage.getItem('idEliminar')
    }
    console.table(ObjetoTabla);
    $.post("/EliminarProducto", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });
    var fila = localStorage.getItem('fila');
    $("#Rows" + fila).remove();
    var Nodo = document.getElementById("ProductoSpan");
    Nodo.removeChild(Nodo.firstChild)
    localStorage.clear();
}

function CargarCategorias(indice) {
    var listCategoria = document.getElementById("Categoria" + indice);
    let Categorias = ['A', 'B', 'C'];
    for (let i = listCategoria.options.length; i >= 0; i--) { //Borrar elementos option de select
        listCategoria.remove(i);
    }

    for (var i = 0; i < Categorias.length; i++) { //Agregar nuevos options del select

        var option = document.createElement("option");
        option.text = Categorias[i];
        listCategoria.add(option);
    }
}

function CargarFamilias(indice) {
    var listFamilia = document.getElementById("Familia" + indice);
    let FamiliasMorelos = ['Torno', 'Centro maquinado', 'Endmills', 'Machuelos', 'Rimas', 'Brocas', 'Produccion', 'Seguridad', 'Embarque', 'Acabado', 'Mantenimiento', 'ULINE', 'Otros']
    let FamiliasBravo = ['John Deere', 'Nidec', 'Nidec ACEM', 'Tornos Ch ACME', 'Tornos', 'Centro maquinado', 'Machuelos', 'Endmills', 'Rimas', 'Brocas', 'Produccion', 'Embarque', 'Seguridad', 'Acabado', 'Mantenimiento']
    let PlantaSeleccionada = "";
    document.getElementById("radMorelos").checked == true ? PlantaSeleccionada = "Morelos" : PlantaSeleccionada = "Bravo";

    $.ajax({
        url: '/getFamiliasAlmacenPlanta/' + PlantaSeleccionada,
        success: function (data) {
            console.log(data)
            for (let i = listFamilia.options.length; i >= 0; i--) { //Borrar elementos option de select
                listFamilia.remove(i);
            }

            for (var i = 0; i < data.length; i++) { //Agregar nuevos options del select 
                var option = document.createElement("option");
                option.text = PlantaSeleccionada == 'Morelos' ? data[i].Nombre : data[i].Nombre;
                listFamilia.add(option);
            }
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

//Intercambiar el diagonal por otro simbolo para no tener problemas con el url
function EscaparComillas(variable) {
    var Herramienta = "";
    for (var q = 0; q < variable.length; q++) {
        if (variable.charAt(q) == '"') {
            Herramienta += '\"'
        } else {
            Herramienta += variable.charAt(q);
        }
    }
    return Herramienta;
}
