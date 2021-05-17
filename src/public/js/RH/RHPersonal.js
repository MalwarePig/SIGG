//CONSULTAR Personal -- BOTON BUSCAR    
function MostrarPersonal() {
    var variable = document.getElementById("Planta").value;
    $.ajax({
        url: '/ListarPersonal/' + variable,
        success: function (Personal) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('TablaPersonal').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
            }
            for (var i = 0; i < Personal.length; i++) {
                var id = Personal[i].id;
                var Nombre = Personal[i].Nombre;
                var Nomina = Personal[i].Nomina;
                var Planta = Personal[i].CURP;
                var Correo = Personal[i].correo;

                //Eliminar variable dentro del For
                Arreglo = [id, Nombre, Nomina, Planta, Correo]

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
                            newCell.innerHTML = '<input required type="text" id="Nombre' + i + '" class="form-control"  value="' + Arreglo[x] + '"></input>';
                            break;
                        case 2:
                            newCell.innerHTML = '<input type="text" id="Nomina' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break;
                        case 3:
                            newCell.innerHTML = '<input type="text" id="CURP' + i + '" class="form-control" value="' + Arreglo[x] + '" ></input>';
                            break;
                        case 4:
                            newCell.innerHTML = '<input type="text" id="Correo' + i + '" class="form-control" value="' + Arreglo[x] + '" ></input>';
                            break;
                        default:
                            break;
                            // code block
                    }

                    if (x == 4) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(5); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (i + 1) + ')> Actualizar </button>';
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

    var id = document.getElementById("id" + indice).value; //Obtiene el valor de id
    var Nombre = document.getElementById("Nombre" + indice).value; //Obtiene el valor de Clave
    var Nomina = document.getElementById("Nomina" + indice).value; //Obtiene el valor de Clave
    var CURP = document.getElementById("CURP" + indice).value; //Obtiene el valor de Producto
    var Correo = document.getElementById("Correo" + indice).value; //Obtiene el valor de Producto

    var ObjetoTabla = {
        id: id,
        Nombre: Nombre,
        Nomina: Nomina,
        CURP: CURP,
        Correo: Correo
    }

    console.table(ObjetoTabla)

    $.post("/EditarPersonal", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            console.log("objeto: " + objeto + " Estatus: " + estatus + typeof (objeto));
            if (objeto == true) {
                $("#ModalEditarEmpleado").modal();
            }
        });
}


//=========================================== Registar nuevo Empleado =================================================//
function RegistraEmeplado() {
    let Nombre = document.getElementById("RNombre").value;
    let Nomina = document.getElementById("RNomina").value;
    let Correo = document.getElementById("RCorreo").value;
    let Curp = document.getElementById("RCurp").value;
    let Planta = document.getElementById("RPlanta").value;
    let Condicion;
    if (Planta == 'Morelos') {
        Condicion = "M"
    } else {
        Condicion = "B";
    }
    var ObjetoTabla = {
        Nombre: Nombre,
        Nomina: Condicion + Nomina,
        CURP: Curp,
        Correo: Correo,
        Planta: Planta
    }

    $.post("/RegistraEmeplado", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            console.log("objeto: " + objeto + "Estatus: " + estatus);
            if (objeto == true) {
                $("#ModalCrearEmpleado").modal();
                document.getElementById("RNombre").value = "";
                document.getElementById("RNomina").value = "";
                document.getElementById("RCorreo").value = "";
                document.getElementById("RCurp").value = "";
            }
        });
}

var PersonalSucces;
//CONSULTAR Personal -- BOTON BUSCAR    
function PrepararEnvio() {
    var variable = document.getElementById("Planta").value;
    $.ajax({
        url: '/PrepararEnvio/' + variable,
        success: function (Personal) {
            PersonalSucces = Personal;

            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('TablaPersonal').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
            }
            for (var i = 0; i < Personal.length; i++) {
                var id = Personal[i].id;
                var Nombre = Personal[i].Nombre;
                var Nomina = Personal[i].Nomina;
                var CURP = Personal[i].CURP;
                var Correo = Personal[i].correo;

                //Eliminar variable dentro del For
                Arreglo = [id, Nombre, Nomina,CURP, Correo]

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
                            newCell.innerHTML = '<input required type="text" id="Nombre' + i + '" class="form-control"  value="' + Arreglo[x] + '"></input>';
                            break;
                        case 2:
                            newCell.innerHTML = '<input type="text" id="Nomina' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break;
                        case 3:
                            newCell.innerHTML = '<input type="text" id="CURP' + i + '" class="form-control" value="' + Arreglo[x] + '" ></input>';
                            break;
                        case 4:
                            newCell.innerHTML = '<input type="text" id="Correo' + i + '" class="form-control" value="' + Arreglo[x] + '" ></input>';
                            break;
                        default:
                            break;
                            // code block
                    }

                    if (x == 3) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(4); //CREAR CELDA
                        newCell.innerHTML = '<input type="text" id="Estado' + i + '" class="form-control" value="' + "Estado: " + '" ></input>';
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
} //Evento clic


var Indice = 0;

function EnviarCorreo() {
    var TotalCorreos = PersonalSucces.length
    console.table(PersonalSucces)

    var intervalor = setInterval(function () {
        console.log("TotalCorreos : " + TotalCorreos)
        if (Indice < TotalCorreos) {

            if (Indice % 2 == 0 && Indice != 0) {
                console.log("Pausando servicios");
                clearInterval(intervalor);
                setTimeout(function () {
                    console.log("Reanudando");

                    console.log("Enviando tmb: " + Indice);
                    EjecutarEnvio();
                    EnviarCorreo();
                }, 10000);
                console.log(Indice)
            } else {
                console.log("else: " + Indice)
                EjecutarEnvio();
                // async..await is not allowed in global scope, must use a wrapper
            }
        }
    }, 8000);
}

function EjecutarEnvio() {
 
    let correo = PersonalSucces[Indice].correo;
    let nombre = PersonalSucces[Indice].Nombre;
    let nomina = PersonalSucces[Indice].Nomina;
    let planta = PersonalSucces[Indice].Planta;
    let curp = PersonalSucces[Indice].CURP;
    let IndicePlanta = "";
    ( planta === 'Morelos' ) ? IndicePlanta = "E2" : IndicePlanta = "E1";

    let ObjetoTabla = {
        Nombre: nombre,
        Correo: correo,
        Nomina: nomina,
        Curp: curp,
        Planta: IndicePlanta,
        Semana: document.getElementById("Semana").value
    }

    console.log("Nombre: " + nombre + " Correo: " + correo)
    $.post("/EnviarNomina", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            console.log("objeto: " + objeto + "Estatus: " + estatus);
            if (objeto == true) {
                var elementoSeleccionado = document.getElementById("Estado" + Indice); //default
                elementoSeleccionado.style.backgroundColor = "#c0ef63";
                document.getElementById("Estado" + Indice).value = "Estado: Enviado..."
                Indice++;

            } else {
                var elementoSeleccionado = document.getElementById("Estado" + Indice); //default
                elementoSeleccionado.style.backgroundColor = "#f94c5f";
                document.getElementById("Estado" + Indice).value = "Estado: Error..."
                Indice++;

            }
        });
}