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


function CargarOT() {
    $.ajax({
        url: '/CargarTodoOT/',
        success: function (Registros) {
            var Arreglo = [];
            //Limpiar tabla 
            var Tabla = document.getElementById('OTRegistros').getElementsByTagName('tbody')[0];
            var limite = Tabla.rows.length;

            for (var i = 0; i < Registros.length; i++) {
                var id = Registros[i].id;
                var Ot = Registros[i].OT;
                var Parte = Registros[i].Parte;
                var Planta = Registros[i].Planta;
                var Estatus = Registros[i].Estatus;
                var Cantidad = Registros[i].CantOt;
                var Maquina = Registros[i].Maquina;
                var FechaInicio = Registros[i].FechaInicio;

                var FechaVenc = Registros[i].FechaVenc;
                //Eliminar variable dentro del For
                Arreglo = [id, Ot, Parte,Planta, Estatus, Cantidad, Maquina, FechaInicio, FechaVenc];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    newRow.setAttribute('onclick', 'Foco(' + i + ')');
                    // adjuntar el texto al nodo
                    
                    if(x == 7){
                        if(Arreglo[x]){
                            var newText = document.createTextNode(FormatoFechas(Arreglo[x]));
                            newCell.appendChild(newText);
                        }else{
                            var newText = document.createTextNode("Sin fecha");
                        newCell.appendChild(newText);
                        }
                    }
                    else if (x == 8) { //Si termina de registrar datos crear el boton
                        if(Arreglo[x]){
                            var newText = document.createTextNode(FormatoFechas(Arreglo[x]));
                            newCell.appendChild(newText);
                        }else{
                            var newText = document.createTextNode("Sin fecha");
                        newCell.appendChild(newText);
                        }
                        var newCell = newRow.insertCell(9); //CREAR CELDA onclick="Editar()"
                        newCell.innerHTML = '<a href="/delete/' + id + '>" class="btn btn-danger">Eliminar</a>';
                        //newCell.innerHTML = '<a href="/update/' + id + '>" class="btn btn-info">Editar</a> <a href="/delete/' + id + '>" class="btn btn-danger">Eliminar</a>';
                        // var newCell = newRow.insertCell(8); //CREAR CELDA onclick="Eliminar()"
                        //newCell.innerHTML = '<a href="/delete/'+id+'>" class="btn btn-danger">Editar</a>';
                    }else{
                        var newText = document.createTextNode(Arreglo[x] || "n/a");
                        newCell.appendChild(newText);
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax


    setTimeout(function () {
        $('#OTRegistros').DataTable({
            language: {
                processing: "Tratamiento en curso...",
                search: "Buscar&nbsp;:",
                lengthMenu: "Agrupar de _MENU_ items",
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
    }, 300);
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
    var Registro = document.getElementById("OTRegistros");
    document.getElementById("ot").value = Registro.rows[(indice + 1)].cells[1].childNodes[0].nodeValue;
    document.getElementById("numPart").value = Registro.rows[(indice + 1)].cells[2].childNodes[0].nodeValue
    document.getElementById("cantidad").value = Registro.rows[(indice + 1)].cells[5].childNodes[0].nodeValue
    document.getElementById("Planta").value = Registro.rows[(indice + 1)].cells[3].childNodes[0].nodeValue
    document.getElementById("horas").value = 0;
    document.getElementById("vencimiento").defaultValue = Registro.rows[(indice + 1)].cells[8].childNodes[0].nodeValue;
    document.getElementById("inicio").defaultValue = FormatoFechas(new Date());
    document.getElementById("ot").focus();
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

  function ActualizarOT(){
 
    let OT = document.getElementById("ot").value;
    let Parte = document.getElementById("numPart").value;
    let Estatus = document.getElementById("estatus").value;
    let Cantidad = document.getElementById("cantidad").value;
    let Horas = document.getElementById("horas").value;
    let vencimiento = document.getElementById("vencimiento").value;
    let Planta = document.getElementById("Planta").value;
    let Maquina = document.getElementById("ListMaquina").value;
    Arreglo = [OT,Parte,Estatus,Cantidad,Horas,vencimiento,Planta,Maquina]

   
    $.post("/ActualizarOT", // url
        {
            Arreglo
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });
  }