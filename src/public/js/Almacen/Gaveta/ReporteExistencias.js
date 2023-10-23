
function ExistenciasGaveta() {
    var miModal = new bootstrap.Modal(document.getElementById('loading')); 
    miModal.show();
    
    //$("#loading").modal();
    Consulta()
    setTimeout(() => { 
        miModal.hide();
    }, 2500);
}

function Consulta() {
    LimpiarTabla()
    $.ajax({
        url: '/ExistenciasGaveta/',
        success: function (Herramientas) {

            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
            }
            if (Herramientas.length == 0) {
                $("#Vacio").modal();
            }
            for (var i = 0; i < Herramientas.length; i++) {
                var Clave = Herramientas[i].Clave;
                var Familia = Herramientas[i].Familia;
                var Planta = Herramientas[i].Planta;
                var Marca = Herramientas[i].Marca;
                var Grado = Herramientas[i].Grado;
                var Tipo = Herramientas[i].Tipo;
                var Descripcion = Herramientas[i].Descripcion;
                var MedidaDiametro = Herramientas[i].MedidaDiametro;
                var Parte = Herramientas[i].Parte;
                var Ubicacion = Herramientas[i].Ubicacion;
                var Cantidad = Herramientas[i].Cantidad;
                var CantidadUsados = Herramientas[i].CantidadUsados;
                var Comentarios = Herramientas[i].Comentarios;
                var Link = Herramientas[i].Link;
                var Precio = Herramientas[i].Precio || "0";
                var Arreglo = [Clave, Familia, Planta, Marca, Grado, Tipo, Descripcion, MedidaDiametro, Parte, Ubicacion, Cantidad, CantidadUsados, Comentarios, Precio,Link]
                var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);

                    /* if (x == 4) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(5); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (i + 1) + ')> Selección </button>';
                    } */
                } //fin de for de columnas
            } //fin de for de filas


            TablaInteligente('TablaReporte'); 

        } //Funcion success
    }); //Ajax    
}

function ExportarExistenciaGavetas() {
    console.log(Herramientas)
    var TotalFilas = Herramientas.length //Total de filas
    var sheet_1_data = [];

    var Encabezado = ["Clave", "Familia", "Planta", "Marca", "Grado", "Tipo", "Descripción", "Medida Diametro", "Parte", "Ubicación", "Cantidad Nuevo", "Cantidad Usados", "Comentarios", "Link", "Precios"]
    sheet_1_data.push(Encabezado);

    for (var i = 0; i < TotalFilas; i++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue; 
        var Clave = Herramientas[i].Clave;
        var Familia = Herramientas[i].Familia;
        var Planta = Herramientas[i].Planta;
        var Marca = Herramientas[i].Marca;
        var Grado = Herramientas[i].Grado;
        var Tipo = Herramientas[i].Tipo;
        var Descripcion = Herramientas[i].Descripcion;
        var MedidaDiametro = Herramientas[i].MedidaDiametro;
        var Parte = Herramientas[i].Parte;
        var Ubicacion = Herramientas[i].Ubicacion;
        var Cantidad = Herramientas[i].Cantidad;
        var CantidadUsados = Herramientas[i].CantidadUsados;
        var Comentarios = Herramientas[i].Comentarios;
        var Link = Herramientas[i].Link;
        var Precio = Herramientas[i].Precio || "0";
        var Fila = [Clave, Familia, Planta, Marca, Grado, Tipo, Descripcion, MedidaDiametro, Parte, Ubicacion, Cantidad, CantidadUsados, Comentarios, Link, Precio]
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Sheet One',
        header: true
    }];
    //var result = alasql('SELECT * INTO XLSX("Existencias Gaveta '+moment().add(1, 'days').calendar()+' .xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}

function TablaInteligente(params) {
    $("#" + params).dataTable().fnDestroy();
    setTimeout(function () {
        $('#' + params).DataTable({
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
    },1700);

}


function LimpiarTabla() {
    $("#TablaReporte").dataTable().fnDestroy();
}