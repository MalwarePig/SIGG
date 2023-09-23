//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
function BuscarHerramental() {
    var Clave = document.getElementById("BHerramienta").value;
    $.ajax({
        url: '/BuscarHerramental/' + Clave,
        success: function (Herramientas) {

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
                var id = Herramientas[i].id
                var Planta = Herramientas[i].Planta
                var Clave = Herramientas[i].Clave
                var Descripción = Herramientas[i].Descripcion
                var Diametro = Herramientas[i].Diametro
                var Caracteristicas = Herramientas[i].Caracteristicas
                var Código = Herramientas[i].Codigo
                var Comentario = Herramientas[i].Comentario
                var Cantidad = Herramientas[i].Cantidad
                //Eliminar variable dentro del For 
                Arreglo = [id, Planta, Clave, Descripción, Diametro, Caracteristicas, Código, Comentario, Cantidad];

                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    if (x < 8) {//Evitar el ultimo valor del arreglo
                        // inserta una celda en el indice 0
                        var newCell = newRow.insertCell(x);
                        newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);

                        if (Arreglo[8] == 1) {//Colorear
                            newCell.style.backgroundColor = "#b7efb2 "
                        } else {
                            newCell.style.backgroundColor = "#ff5e5e"
                        }

                        if (x == 7 && (Arreglo[8] == 1)) { //Si termina de registrar datos crear el boton
                            var newCell = newRow.insertCell(8); //CREAR CELDA
                            newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (i + 1) + ')> <i class="fa-solid fa-hand-pointer"></i> </button>';
                        } else if (x == 7 && (Arreglo[8] == 0)) {
                            var newCell = newRow.insertCell(8); //CREAR CELDA
                            newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark"  data-bs-toggle="modal" data-bs-target="#ModalRetorno" name="btn" onclick= ModalRetorno(' + Arreglo[0] + ')> <i class="fa-solid fa-circle-exclamation"></i> </button>';
                        }
                    }

                } //fin de for de columnas
            } //fin de for de filas

        } //Funcion success
    }); //Ajax
} //Evento clic


function runScript(e) {
    if (e.keyCode == 13) {
        BuscarHerramental();
    }
}





//=========================================== EVENTO CLIC SOBRE LA TABLA DE BUSQUEDA PARA SELECCIONAR HERRAMIENTA =================================================//
function Seleccion(variable) {
    Registro = document.getElementById("Herr_Encontradas");

    document.getElementById("id").value = Registro.rows[variable].cells[0].childNodes[0].nodeValue;
    document.getElementById("Planta").value = Registro.rows[variable].cells[1].childNodes[0].nodeValue;
    document.getElementById("Clave").value = Registro.rows[variable].cells[2].childNodes[0].nodeValue;
    document.getElementById("Descripcion").value = Registro.rows[variable].cells[3].childNodes[0].nodeValue;
    document.getElementById("Diametro").value = Registro.rows[variable].cells[4].childNodes[0].nodeValue;
    document.getElementById("Caracteristicas").value = Registro.rows[variable].cells[5].childNodes[0].nodeValue;
    document.getElementById("Codigo").value = Registro.rows[variable].cells[6].childNodes[0].nodeValue;
    document.getElementById("N_Notas").value = Registro.rows[variable].cells[7].childNodes[0].nodeValue || '-';

    document.getElementById("Estado").focus();

}



//=========================================== BUSCAR TRABAJADORES POR NUMERO DE NOMINA =================================================//
function Nombres(e, Nom, param) {
    if (e.keyCode == 13) {
        $.ajax({
            url: '/Num_Nomina',
            success: function (empleados) {
                let Nomina = document.getElementById(Nom).value.toUpperCase();
                for (var i = 0; i < empleados.length; i++) {
                    if (Nomina == empleados[i].Nomina) {
                        document.getElementById(param).value = empleados[i].Nombre;
                    }
                }
            } //Funcion success
        }); //Ajax 
        return false;
    }
}

//=========================================== BUSCAR MAQUINAS POR TIPO DE FAMILIA =================================================//
function Familias() {
    var listMaquina = document.getElementById("Familia");
    $.ajax({
        url: '/ListaFamilias/',
        success: function (maquinas) {
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


//=========================================== BUSCAR MAQUINAS POR TIPO DE FAMILIA =================================================//
function Maquinas() {
    let familia = document.getElementById("Familia").value;
    var listMaquina = document.getElementById("Maquina");
    $.ajax({
        url: '/listaMaquinas/' + familia + '',
        success: function (maquinas) {
            for (let i = listMaquina.options.length; i >= 0; i--) { //Borrar elementos option de select
                listMaquina.remove(i);
            }
            for (var i = 0; i < maquinas.length; i++) { //Agregar nuevos options del select

                var option = document.createElement("option");
                option.text = maquinas[i].Nombre;
                listMaquina.add(option);
            }
        } //Funcion success
    }); //Ajax
}


//=========================================== EVENTO CLIC SOBRE BOTON EN FORMULARIO PARA CREAR LA NOTA DE SALIDA =================================================//
function CrearNota() {
    let tabla = document.getElementById("TablaNota");
    let total = tabla.rows.length //Total de filas

    var id = document.getElementById("id").value
    var Planta = document.getElementById("Planta").value
    var Clave = document.getElementById("Clave").value
    var Estado = document.getElementById("Estado").value
    var OT = document.getElementById("OT").value
    var Nomina = document.getElementById("Nomina").value
    var Empleado = document.getElementById("Empleado").value
    var Familia = document.getElementById("Familia").value
    var Maquina = document.getElementById("Maquina").value
    var Comentario = document.getElementById("N_Notas").value

    var Arreglo = [id, Planta, Clave, Estado, OT, Nomina, Empleado, Familia, Maquina, Comentario];

    var Condicion = true; //para campos vacios
    for (var a in Arreglo) { //recorrer arreglo en busca de campos vacios
        if (Arreglo[a].length == 0) {
            Condicion = false; //si algun campo esta vacio cambia a falso
        }
    }

    if (Condicion == true) { //si todos los campos estan llenos avanza
        var TablaAlmacen = document.getElementById('TablaNota').getElementsByTagName('tbody')[0];
        // inserta una fila al final de la tabla
        var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
        let indice = (TablaAlmacen.rows.length + 1);
        newRow.setAttribute("id", "fila" + indice); //se asigna id al incrementar cada fila +1 para contar el encabezado
        for (var x = 0; x < Arreglo.length; x++) {

            // inserta una celda en el indice 0
            var newCell = newRow.insertCell(x);
            // adjuntar el texto al nodo
            var newText = document.createTextNode(Arreglo[x]);
            newCell.appendChild(newText);
            if (x == 7) { //Si termina de registrar datos crear el boton
                var newCell = newRow.insertCell(8); //CREAR CELDA onclick="CrearNota()"
                newCell.innerHTML = '<button id="' + x + '" class="btn btn-danger" name="btn" onclick="EliminarFila(' + indice + ')"> <i class="far fa-minus-square"></i> </button>';
            }
        }
    }
}

//=========================================== ELIMINAR FILA DE REGISTRO EN NOTAS =================================================//
function EliminarFila(index) {
    $("#fila" + index).remove();
}

function GuardarNota() {
    var tabla = document.getElementById("TablaNota");
    var total = tabla.rows.length //Total de filas

    var Arreglo = [];

    for (var j = 1; j <= total - 1; j++) { //filas

        var id = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Planta = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Clave = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Estado = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Nomina = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Empleado = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Familia = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Maquina = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Comentario = tabla.rows[j].cells[9].childNodes[0].nodeValue;
        var Tabla = [id, Planta, Clave, Estado, OT, Nomina, Empleado, Familia, Maquina, Comentario];
        Arreglo.push(Tabla);
    } //fin filas

    $.post("/GuardarNotaHerramienta", // url
        {
            Arreglo
        }, // data to be submit
        function (objeto, estatus) { // success callback
            if (objeto == true) {
                BuscarHerramental()
                var myModal = new bootstrap.Modal(document.getElementById('ModalExito'), {
                    keyboard: false
                })
                myModal.show()
            } else {
                BuscarHerramental()
                var myModal = new bootstrap.Modal(document.getElementById('ModaFallo'), {
                    keyboard: false
                })
                myModal.hide()
            }
        });

    //Limpiar tabla 
    var TablaAlmacen = document.getElementById('TablaNota').getElementsByTagName('tbody')[0];
    var limite = TablaAlmacen.rows.length;
    for (var i = 0; i <= limite; i++) {
        $("#fila" + (i + 1)).remove(); //elimina los elementos con id Rows
    }
    document.getElementById("RegistroSalida").reset();
}





function CerrarModal(param) {
    var myModal = new bootstrap.Modal(document.getElementById(param), {
        keyboard: false
    })

    myModal.hide()

    //$("#AsignadoExito").modal(); 
}


function MostrarModal(param) {
    var myModal = new bootstrap.Modal(document.getElementById(param));

    myModal.show()

    //$("#AsignadoExito").modal(); 
}

//CONSULTAR HERRAMIENTAS A RETORNAR-- BOTON BUSCAR    
function ModalRetorno(param) {

    $.ajax({
        url: '/BuscarDespachoUnico/' + param,
        success: function (Herramientas) {

            //Obtener Fecha exacta sacando minutos
            let fecha = new Date(Herramientas[0].Fecha)
            fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset())

            document.getElementById("R_id").value = param
            document.getElementById("R_Planta").value = Herramientas[0].Planta
            document.getElementById("R_Clave").value = Herramientas[0].Clave
            document.getElementById("R_OT").value = Herramientas[0].OT
            document.getElementById("R_Maquina").value = Herramientas[0].Maquina
            document.getElementById("R_Fecha").value = moment(fecha).format('DD-MM-YYYY');
            document.getElementById("R_Estado").value = Herramientas[0].Estado
            document.getElementById("R_Nomina").value = Herramientas[0].Nomina
            document.getElementById("R_Empleado").value = Herramientas[0].Empleado
            document.getElementById("R_Comentario").value = Herramientas[0].Comentario
        } //Funcion success
    }); //Ajax
} //Evento clic

function RetornarHerramienta() {
    let R_id = document.getElementById("R_id").value
    let R_Planta = document.getElementById("R_Planta").value
    let R_Clave = document.getElementById("R_Clave").value
    let R_OT = document.getElementById("R_OT").value
    let R_Maquina = document.getElementById("R_Maquina").value
    let R_Fecha = document.getElementById("R_Fecha").value
    let R_Estado = document.getElementById("R_Estado").value
    let R_Nomina = document.getElementById("R_Nomina").value
    let R_Empleado = document.getElementById("R_Empleado").value
    let R_Comentario = document.getElementById("R_Comentario").value
    let Tabla = [R_id, R_Planta, R_Clave, R_OT, R_Maquina, R_Fecha, R_Estado, R_Nomina, R_Empleado, R_Comentario]

    var Arreglo = [];
    Arreglo.push(Tabla)

    $.post("/GuardarRetornoHerramienta", // url
        {
            Arreglo
        }, // data to be submit
        function (objeto, estatus) { // success callback
            if (objeto == true) {
                BuscarHerramental()
                var myModal = new bootstrap.Modal(document.getElementById('ModalExitoRetorno'), {
                    keyboard: false
                })
                myModal.show()
            } else {
                BuscarHerramental()
                var myModal = new bootstrap.Modal(document.getElementById('ModalFallo'), {
                    keyboard: false
                })
                myModal.hide()
            }
        });
}




