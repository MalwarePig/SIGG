//=========================================== BUSCAR MAQUINAS POR TIPO DE FAMILIA =================================================//
function Maquinas() {
    let familia = document.getElementById("Familia").value;
    var listMaquina = document.getElementById("ListMaquina");
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



function VistaPlanta() {
    $.ajax({
        url: '/AlimentarVistaPlanta',
        success: function (Lineas) {
            alert("S")
        } //Funcion success
    }); //Ajax
}


function Foco(indice) {
    //75852 
    var table = document.getElementById('OTRegistros').getElementsByTagName('tbody')[0];
    var LimiteFilas = table.rows.length;
    var index = 0;


    var Registro = document.getElementById("OTRegistros");
    for (index; index < LimiteFilas; index++) {

        var row = table.rows[index];
        var identificador = 'Rows' + indice;
        //console.log("id fila: " + row.id + " identificador: " + identificador);
        if (identificador == row.id) { //Fila seleccionada  
            document.getElementById("id").value = Registro.rows[(index + 1)].cells[0].childNodes[0].nodeValue;
            document.getElementById("ot").value = Registro.rows[(index + 1)].cells[1].childNodes[0].nodeValue;
            document.getElementById("numPart").value = Registro.rows[(index + 1)].cells[2].childNodes[0].nodeValue;
            document.getElementById("cantidad").value = Registro.rows[(index + 1)].cells[5].childNodes[0].nodeValue;
            document.getElementById("ot").focus();

            let Planta = Registro.rows[(index + 1)].cells[3].childNodes[0].nodeValue;
            let Maquina = Registro.rows[(index + 1)].cells[6].childNodes[0].nodeValue;

            //Cargar Planta
            if (Planta == 'Bravo') {
                document.getElementById('Planta').selectedIndex = 1;
            } else if (Planta == 'Morelos') {
                document.getElementById('Planta').selectedIndex = 2;
            } else {
                $("#Planta").val($("#PlantaDefault").data("default-value"));//Resetear select list
            }


            //Cargar Maquina
            if(Maquina != 'n/a'){
                var listMaquina = document.getElementById("ListMaquina");
                for (let i = listMaquina.options.length; i >= 0; i--) { //Borrar elementos option de select
                    listMaquina.remove(i);
                }


                var option = document.createElement("option");
                option.text = Maquina;
                option.value = Maquina
                listMaquina.add(option);
            }else{
                $("#ListMaquina").val($("#PlantaDefault").data("default-value"));//Resetear select list
            }
           
 
        }
    }
}


function FormatoFechas(fecha) {
    var today = new Date(fecha);
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = yyyy + '-' + mm + '-' + dd;
    return today;
}

function ActualizarOT() {

    let id = document.getElementById("id").value;
    let OT = document.getElementById("ot").value;
    let Parte = document.getElementById("numPart").value;
    let Cantidad = document.getElementById("cantidad").value;
    let Planta = document.getElementById("Planta").value;
    let Maquina = document.getElementById("ListMaquina").value;
    Arreglo = [id, OT, Parte, Cantidad, Planta, Maquina]

    $.post("/ActualizarOT", // url
        {
            Arreglo
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });
}





//Funcion Funcional
function Carga() {
    var Planta = localStorage.getItem('PlantaGeneral');
    var ListArea = 'controlplaner';
    $.ajax({
        url: '/CargarTodoOT/',
        success: function (Lineas) {
            var Arreglo = [];
            //Limpiar tabla 
            var Tabla = document.getElementById('OTRegistros').getElementsByTagName('tbody')[0];
            var limite = Tabla.rows.length;

            if (Lineas.length == 0) {
                $("#Vacio").modal();
            }

            $("#CuerpoTabla tr").remove();

            for (var i = 0; i < Lineas.length; i++) {
                var id = Lineas[i].id;
                var Ot = Lineas[i].OT;
                var Parte = Lineas[i].Parte;
                var Planta = Lineas[i].Planta;
                var Estatus = Lineas[i].Estatus;
                var Cantidad = Lineas[i].CantOt;
                var Maquina = Lineas[i].Maquina;
                var FechaInicio = Lineas[i].FechaInicio;

                var FechaVenc = Lineas[i].FechaVenc;
                //Eliminar variable dentro del For
                Arreglo = [id, Ot, Parte, Planta, Estatus, Cantidad, Maquina, FechaInicio, FechaVenc];

                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    newRow.setAttribute('onclick', 'Foco(' + i + ')');
                    // adjuntar el texto al nodo

                    if (x == 7) {
                        if (Arreglo[x]) {
                            var newText = document.createTextNode(FormatoFechas(Arreglo[x]));
                            newCell.appendChild(newText);
                        } else {
                            var newText = document.createTextNode("Sin fecha");
                            newCell.appendChild(newText);
                        }
                    }
                    else if (x == 8) { //Si termina de registrar datos crear el boton
                        if (Arreglo[x]) {
                            var newText = document.createTextNode(FormatoFechas(Arreglo[x]));
                            newCell.appendChild(newText);
                        } else {
                            var newText = document.createTextNode("Sin fecha");
                            newCell.appendChild(newText);
                        }
                        var newCell = newRow.insertCell(9); //CREAR CELDA onclick="Editar()"
                        newCell.innerHTML = '<a href="/delete/' + id + '>" class="btn btn-danger">Eliminar</a>';
                        //newCell.innerHTML = '<a href="/update/' + id + '>" class="btn btn-info">Editar</a> <a href="/delete/' + id + '>" class="btn btn-danger">Eliminar</a>';
                        // var newCell = newRow.insertCell(8); //CREAR CELDA onclick="Eliminar()"
                        //newCell.innerHTML = '<a href="/delete/'+id+'>" class="btn btn-danger">Editar</a>';
                    } else {
                        var newText = document.createTextNode(Arreglo[x] || "n/a");
                        newCell.appendChild(newText);
                    }
                } //fin de for de columnas
            } //fin de for de filas
            // Contadores(Lineas);
        } //Funcion success
    }); //Ajax

    $("#OTRegistros").dataTable().fnDestroy();
    setTimeout(function () {
        $('#OTRegistros').DataTable({
            language: {
                processing: "Tratamiento en curso...",
                search: "Buscar&nbsp;:",
                lengthMenu: "Agrupar por _MENU_  ",
                info: "Mostrando del item _START_ al _END_ de un total de _TOTAL_ items",
                infoEmpty: "No existen datos.",
                infoFiltered: "(filtrado de _MAX_ elementos en total)",
                infoPostFix: "",
                loadingRecords: "Cargando...",
                zeroRecords: "No se encontraron datos con tu busqueda",
                emptyTable: "No hay datos disponibles en la tabla.",
                paginate: {
                    first: "Primero",
                    previous: "Anterior",
                    next: "Siguiente",
                    last: "Ultimo"
                },
                aria: {
                    sortAscending: ": active para ordenar la columna en orden ascendente",
                    sortDescending: ": active para ordenar la columna en orden descendente"
                }
            },
            scrollY: 400,
            lengthMenu: [
                [10, 25, -1],
                [10, 25, "All"]
            ],
        });
    }, 1000);
    Familias()
}




//=========================================== BUSCAR MAQUINAS POR TIPO DE FAMILIA =================================================//
function Familias() {
    var listFamilias = document.getElementById("List_Familia");
    $.ajax({
        url: '/MaquinasFamilias/',
        success: function (maquinas) {
            console.table(maquinas)
            for (let i = listFamilias.options.length; i >= 0; i--) { //Borrar elementos option de select
                listFamilias.remove(i);
            }

            var option = document.createElement("option");
            option.text = "Familias...";
            option.value = "Familias...";

            listFamilias.add(option);
            for (var i = 0; i < maquinas.length; i++) { //Agregar nuevos options del select

                var option = document.createElement("option");
                option.text = maquinas[i].Familia;
                option.value = maquinas[i].Familia;
                listFamilias.add(option);
            } //
        } //Funcion success
    }); //Ajax
}

//=========================================== BUSCAR MAQUINAS POR TIPO DE FAMILIA =================================================//
function Maquinas() {
    let familia = document.getElementById("List_Familia").value;
    var listMaquina = document.getElementById("ListMaquina");

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