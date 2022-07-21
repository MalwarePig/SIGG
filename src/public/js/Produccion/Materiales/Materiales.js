function Carga() {
    var Planta = document.getElementById("Planta").value;
    var fechaInicio = document.getElementById("Inicio").value;
    var fechafin = document.getElementById("Fin").value;
    $.ajax({
        url: '/ConsultaMateriales/' + Planta + '|' + fechaInicio + '|' + fechafin,
        success: function (Lineas) {
            var Arreglo = [];
            //Limpiar tabla 
            var Tabla = document.getElementById('Tabla').getElementsByTagName('tbody')[0];
            var limite = Tabla.rows.length;

            if (Lineas.length == 0) {
                $("#Vacio").modal();
            }

            $("#CuerpoTabla tr").remove();
            for (var i = 0; i < Lineas.length; i++) {
                var id = Lineas[i].id;
                var Inicio = Lineas[i].FechaRegistro;
                var OT = Lineas[i].OT;
                var Maquina = Lineas[i].Maquina || 'N/A';
                var CantOt = Lineas[i].CantOt;
                var Recibido = Lineas[i].Recibido + (Lineas[i].Extra || 0);
                var Entrega = Lineas[i].Materialista || 'Sin datos';
                var Recibe = Lineas[i].Recibe || 'Sin datos';
                var Comentarios = Lineas[i].Parte;

                Arreglo = [id, Inicio, OT, Maquina, CantOt, Recibido, Entrega, Recibe, Comentarios];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                for (var x = 0; x < Arreglo.length+1; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "RowsFlujo" + id); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    newRow.setAttribute("data-Indexdb" + id, id)//se asigna id de la ot a los atributos de la fila

                    // adjuntar el texto al nodo
                    if (x == 0) {
                        newCell.innerHTML = '<input required type="text" id="id' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    } else if (x == 1) {
                        var newText = document.createTextNode(moment(Arreglo[x]).format('YYYY/MM/DD'));
                        newCell.appendChild(newText);
                    } else if (x == 8) {
                        newCell.innerHTML = '<input required type="text" id="Comentarios' + i + '" class="form-control" value="' + Arreglo[x] + '" ></input>';
                    } else if (x == 9) {
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-info" name="btn" onclick=ActualizarMaterial(' + (i) + ') data-toggle="tooltip" data-placement="top" title="Actualizar"> <i class="fas fa-edit"></i> </button>';
                    } else {
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                    }
                } //fin de for de columnas
            } //fin de for de filas
            // Contadores(Lineas);
        } //Funcion success
    }); //Ajax
    
    $("#Tabla").dataTable().fnDestroy();
    setTimeout(function () {
        $('#Tabla').DataTable({
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
}



function Iniciar() {
    document.getElementById("Inicio").defaultValue = FormatoFechas(new Date(), 0); //+0 para no incrementar dias
    document.getElementById("Fin").defaultValue = FormatoFechas(new Date(), 1); //+1 para incrementar 1 dia
}

function FormatoFechas(fecha, AgregarDia) {
    var today = new Date(fecha);
    var dd = today.getDate() + AgregarDia;
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


//=========================================== Actualizar Seleccion =================================================//
function ActualizarMaterial(variable) {
 
    tabla = document.getElementById("Tabla");

    let idMaterial = document.getElementById("id"+variable).value;
    let Fecha = tabla.rows[(variable+1)].cells[1].childNodes[0].nodeValue;
    let OT = tabla.rows[(variable+1)].cells[2].childNodes[0].nodeValue;
    let Maquina = tabla.rows[(variable+1)].cells[3].childNodes[0].nodeValue;
    let CantidadOT = document.getElementById("Cantidad"+variable).value;
    let CantidadEntregado = tabla.rows[(variable+1)].cells[5].childNodes[0].nodeValue;
    let Colada = document.getElementById("Colada"+variable).value;
    let Entrega = tabla.rows[(variable+1)].cells[6].childNodes[0].nodeValue;
    let Recibe = document.getElementById("Recibe"+variable).value;
    let Comentarios = document.getElementById("Comentarios"+variable).value;

    var ObjetoTabla = {
        idMaterial: idMaterial,
        Fecha: Fecha,
        OT: OT,
        Maquina: Maquina,
        CantidadOT: CantidadOT,
        CantidadEntregado: CantidadEntregado,
        Colada: Colada,
        Entrega: Entrega,
        Recibe: Recibe,
        Comentarios: Comentarios
    }

    console.table(ObjetoTabla)
    $.post("/ActualizarMateriales", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });
    alert("Listo");
}


function ActualizarMaterial(fila) {
    Registro = document.getElementById("Tabla");
 
    let idRegistro = document.getElementById("id" + fila).value;
    let Comentarios = document.getElementById("Comentarios" + fila).value;
 
    data = {
        id: idRegistro,
        : Comentarios
    }
    $.post("/ActualizarMaterial", // url
        {
            data
        }, // data to be submit
        function (Estado, status) { // success callback
            console.log(Estado + status);
            if (Estado == true) {
                var parrafo = document.getElementById("wrapper");
                while (parrafo.firstChild) {
                    //The list is LIVE so it will re-index each call
                    parrafo.removeChild(parrafo.firstChild);
                }
            }
        })
}
