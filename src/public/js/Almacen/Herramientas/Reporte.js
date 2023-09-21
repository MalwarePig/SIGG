
function MostrarReporte() {
    var Almacen = document.getElementById("Almacen").value;
    var categoria = document.getElementById("Categoria").value;
    //alert(fechaInicio);
    $.ajax({
        url: '/EstadoActualHerramental/' + Almacen + '|' + categoria,
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            var TotalHerramientas = Herramientas.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove(); //elimina los elementos con id Rows
            }
            for (var i = 0; i < TotalHerramientas; i++) {
                var Planta = Herramientas[i].Planta;
                var Clave = Herramientas[i].Clave;
                var Descripcion = Herramientas[i].Descripcion || "-";
                var Diametro = Herramientas[i].Diametro || "-";
                var Caracteristicas = Herramientas[i].Caracteristicas || "-";
                var Codigo = Herramientas[i].Codigo || "-";
                var Inserto = Herramientas[i].Inserto || "-";
                var Marca = Herramientas[i].Marca || "-";
                var Seat = Herramientas[i].Seat || "-";
                var Clamp = Herramientas[i].Clamp || "-";
                var Screw = Herramientas[i].Screw || "-";
                var Estado = Herramientas[i].Estado || "-";
                var Comentario = Herramientas[i].Comentario || "-";
                var Empleado = Herramientas[i].Empleado || "-";
                var Maquina = Herramientas[i].Maquina || "-";
                var Cantidad = Herramientas[i].Cantidad || "-";

                Arreglo = [Planta, Clave, Descripcion, Diametro, Caracteristicas, Codigo, Inserto, Marca, Seat, Clamp, Screw, Estado, Comentario, Empleado, Maquina, Cantidad];

                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    if (x < 15) {//Evitar el ultimo valor del arreglo
                        // inserta una celda en el indice 0
                        var newCell = newRow.insertCell(x);
                        newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);

                        if (Arreglo[15] == 1) {//Colorear
                            newCell.style.backgroundColor = "#b7efb2 "
                        } else {
                            newCell.style.backgroundColor = "#ff5e5e"
                        }
                    }

                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
}


function ExcelReporte() {
    var tabla = document.getElementById("TablaReporte");
    var total = tabla.rows.length //Total de filas

    var sheet_1_data = [];
    for (var j = 0; j <= total - 1; j++) { //filas

        var Planta = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Clave = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Estado = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var Nomina = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Empleado = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Familia = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Maquina = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Comentario = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Fecha = tabla.rows[j].cells[9].childNodes[0].nodeValue;

        var Fila = [Planta, Clave, Estado, OT, Nomina, Empleado, Familia, Maquina, Comentario, Fecha]
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Hoja1',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("Reporte.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}




function Contar() {
    // Obtener una referencia a la tabla
    var tabla = document.getElementById("TablaReporte");
    // Acceder a la primera fila de la tabla (fila de encabezado)
    var filaEncabezado = tabla.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0];
    // Contar el número de columnas
    var numeroDeColumnas = filaEncabezado.getElementsByTagName("th").length;
    // Mostrar el número de columnas en la consola
    console.log("Número de columnas: " + numeroDeColumnas + " - " + filaEncabezado.getElementsByTagName("th")[0].innerText);

    let Encabezado = []
    let Doc = []
    var Fila = []
    for (let index = 0; index < numeroDeColumnas; index++) {
        Encabezado.push(filaEncabezado.getElementsByTagName("th")[index].innerText)
    }
   //Doc.push(Encabezado)

    for (let Fil = 0; Fil < numeroDeColumnas; Fil++) { 
        Fila = []
        for (var Col = 0;Col < numeroDeColumnas; Col++) { //filas 
            Fila.push(tabla.rows[Fil].cells[Col].childNodes[0].nodeValue);
        }
        Doc.push(Fila);
    }
     


    console.log(Encabezado);

    console.log(Doc);

}

function ExcelReporteAvanzado() {
    // Obtener una referencia a la tabla
    var tabla = document.getElementById("TablaReporte");
    //Total de filas
    var totalFilas = tabla.rows.length; 
    // Acceder a la primera fila de la tabla (fila de encabezado)
    var filaEncabezado = tabla.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0];
    // Contar el número de columnas
    var numeroDeColumnas = filaEncabezado.getElementsByTagName("th").length;
 
    let Doc = []
    var Fila = [] 

    for (let Fil = 0; Fil < totalFilas; Fil++) { 
        Fila = []
        for (var Col = 0;Col < numeroDeColumnas; Col++) { //filas 
            Fila.push(tabla.rows[Fil].cells[Col].childNodes[0].nodeValue);
        }
        Doc.push(Fila);
    }

    var opts = [{
        sheetid: 'Hoja1',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("Reporte.xlsx",?) FROM ?', [opts, [Doc]]);
}