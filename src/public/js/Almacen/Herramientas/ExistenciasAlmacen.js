var Herramientas = []
function MostrarReporte() {
    var Almacen = document.getElementById("Almacen").value;
    /* console.log("Categoria" + Categoria + " Almacen" + Almacen + " Familia" + Familia) */

    $.ajax({
        url: '/ExistenciaTotalHerramientas/' + Almacen,
        success: function (Data) {
            Herramientas = Data
            HerramientasConsultadas = Herramientas;

            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            var TotalHerramientas = Herramientas.length;

            for (var i = 0; i < limite; i++) {
                $("#Rows" + i).remove(); //elimina los elementos con id Rows
            }

            for (var i = 0; i < Herramientas.length; i++) {
                var Clave = Herramientas[i].Clave;
                var Descripcion = Herramientas[i].Descripcion;
                var Planta = Herramientas[i].Planta;
                var Diametro = Herramientas[i].Diametro;
                var Caracteristicas = Herramientas[i].Caracteristicas;
                var Codigo = Herramientas[i].Codigo;
                var Inserto = Herramientas[i].Inserto;
                var Marca = Herramientas[i].Marca;
                var Seat = Herramientas[i].Seat;
                var Clamp = Herramientas[i].Clamp;
                var Screw = Herramientas[i].Screw;
                var Comentario = Herramientas[i].Comentario;

                //Eliminar variable dentro del For

                Arreglo = [Clave, Descripcion, Planta, Diametro, Caracteristicas, Codigo, Inserto, Marca, Seat, Clamp, Screw, Comentario]
                var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {

                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado

                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);


                } //fin de for de columnas
            } //fin de for de filas

        } //Funcion success
    }); //Ajax 
}






function ExportarExistencia() {
    console.log(Herramientas)
    var TotalFilas = Herramientas.length //Total de filas
    var sheet_1_data = [];

    var Encabezado = ['Clave','Descripcion','Planta','Diametro','Caracteristicas','Codigo','Inserto','Marca','Seat','Clamp','Screw','Comentario']
    sheet_1_data.push(Encabezado);

    for (var i = 0; i < TotalFilas; i++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue; 
        var Clave = Herramientas[i].Clave;
        var Descripcion = Herramientas[i].Descripcion;
        var Planta = Herramientas[i].Planta;
        var Diametro = Herramientas[i].Diametro;
        var Caracteristicas = Herramientas[i].Caracteristicas;
        var Codigo = Herramientas[i].Codigo;
        var Inserto = Herramientas[i].Inserto;
        var Marca = Herramientas[i].Marca;
        var Seat = Herramientas[i].Seat;
        var Clamp = Herramientas[i].Clamp;
        var Screw = Herramientas[i].Screw;
        var Comentario = Herramientas[i].Comentario;
        var Fila = [Clave,Descripcion,Planta,Diametro,Caracteristicas,Codigo,Inserto,Marca,Seat,Clamp,Screw,Comentario]
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Sheet One',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("Existencias Herramental ' + moment().add(1, 'days').calendar() + ' .xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}