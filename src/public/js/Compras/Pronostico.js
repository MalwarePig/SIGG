function MostrarOTs(Producto) {
    $.ajax({
        url: '/ResumenPronosticos/' + Producto,
        success: function (Herramientas) {
            var Arreglo = [];

            // Eliminando todos los hijos de un elemento
            var element = document.getElementById("list-OT");
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            var Total = Herramientas[0].Stock;
            for (var i = 0; i < Herramientas.length; i++) {
                var item = document.createElement('a');
                item.setAttribute("id", Herramientas[i].Producto);
                item.setAttribute("class", "list-group-item list-group-item-action");
                item.innerHTML = "Item: [" + Herramientas[i].Producto + "] OT: [" + Herramientas[i].OT + "] Ordenado: [" + Herramientas[i].Cantidad + "] Stock: [" + Herramientas[i].Stock + "]";
                document.getElementById('list-OT').appendChild(item);
                $("#Modal").modal();
            }
            var item = document.createElement('a');
            item.setAttribute("id", Herramientas[0].Producto);
            item.setAttribute("class", "list-group-item list-group-item-action");
            item.innerHTML = Herramientas[0].Producto + " " + Total + " Sobrante";
            document.getElementById('list-OT').appendChild(item);
            $("#Modal").modal();

        } //Funcion success
    }); //Ajax 
}

//=========================================== Guardar elementos de la nota =================================================//
function CrearNota() {
    var tabla = document.getElementById("OTRegistros");
    var total = tabla.rows.length //Total de filas
    var Arreglo = [];
    for (var j = 1; j <= total - 1; j++) { //Recorer filas
        var Check = document.getElementById(j); //Obtener filas seleccionadas
        if (Check.checked == true) {
            var identificador = "Button" + j; //Traer el valor del boton que es el nombre de la herramienta

            ObjetoTabla = {
                Folio: "GEMCOM-00001",
                Producto: document.getElementById(identificador).value,
                Solicitado: tabla.rows[j].cells[3].childNodes[0].nodeValue,
                OTs: tabla.rows[j].cells[5].childNodes[0].nodeValue
            }
            Arreglo.push(ObjetoTabla);
        }
    }
  
//Crear Tabla para modal
    var limite = Arreglo.length;
    alert("Limite: " + limite + " " + Arreglo[1].Producto);
    for (var i = 0; i < limite; i++) {
        alert("Limite: " + limite + " indice: " + i +  " " + Arreglo[i].Producto);
        var N_Folio = Arreglo[i].Folio;
        var N_Producto = Arreglo[i].Producto;
        var N_Solicitado = Arreglo[i].Solicitado;
        var N_OT = Arreglo[i].OTs;

        //Eliminar variable dentro del For
        ArregloFinal = [N_Folio, N_Producto, N_Solicitado, N_OT];
        var TablaAlmacen = document.getElementById('TablaRequisicion').getElementsByTagName('tbody')[0];
        // inserta una fila al final de la tabla
        var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
        for (var x = 0; x < ArregloFinal.length; x++) {
            // inserta una celda en el indice 0
            var newCell = newRow.insertCell(x);
            newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
            // adjuntar el texto al nodo
            var newText = document.createTextNode(ArregloFinal[x]);
            newCell.appendChild(newText);
        } //fin de for de columnas
    } //fin de for de filas




     $("#ModalNota").modal();

}