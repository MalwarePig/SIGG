//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
function GETPRODUCTS() {
    var Herramientas = Transformer(document.getElementById("BHerramienta").value);
    $.ajax({
        url: '/BuscarHerramientas/' + Herramientas,
        success: function (Herramientas) {
            var Arreglo = [];
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
                var id = Herramientas[i].id;
                var Clave = Herramientas[i].Clave;
                var Producto = Herramientas[i].Producto;
                var Planta = Herramientas[i].Almacen;

                var Stock = Herramientas[i].Stock;
                var StockUsado = Herramientas[i].StockUsado;
                var StockMin = Herramientas[i].StockMin;
                var StockMax = Herramientas[i].StockMax;
                var Categoria = Herramientas[i].Categoria;
                var Familia = Herramientas[i].Familia;
                //Eliminar variable dentro del For
                Arreglo = [id, Clave, Producto, Planta, Stock, StockUsado, StockMin, StockMax, Categoria, Familia]
                var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado

                    if (x == 0) {
                        newCell.innerHTML = '<input required type="text" id="id' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                    } else if (x == 9) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(10); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=ModalEficiencia(' + (i + 1) + ')> <i class="fas fa-record-vinyl"></i> </button>';
                    } else {
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
} //Evento clic

//Intercambiar el diagonal por otro simbolo para no tener problemas con el url
function Transformer(variable) {
    var Herramienta = "";
    for (var q = 0; q < variable.length; q++) {
        if (variable.charAt(q) == '/') {
            Herramienta += '@';
        } else {
            Herramienta += variable.charAt(q);
        }
    }
    return Herramienta;
}

//Evento enter
function runScript(e) {
    if (e.keyCode == 13) {
        GETPRODUCTS();
    }
}



let CantidadActual = 0;

function ModalEficiencia(fila) {

    console.clear();
    let indice = document.getElementById("id" + (fila - 1)).value;

    var tabla = document.getElementById("Herr_Encontradas");
    let Clave = tabla.rows[fila].cells[1].childNodes[0].nodeValue;
    let Producto = tabla.rows[fila].cells[2].childNodes[0].nodeValue;
    let Planta = tabla.rows[fila].cells[3].childNodes[0].nodeValue;
    let Cantidad = tabla.rows[fila].cells[4].childNodes[0].nodeValue;
    CantidadActual = Cantidad;

    document.getElementById("Mod_Clave").value = Clave;
    document.getElementById("Mod_Producto").value = Producto;
    document.getElementById("Mod_Almacen").value = Planta;
    document.getElementById("Mod_Cantidad").value = Cantidad;
    document.getElementById("Mod_indice").value = indice;
    localStorage.setItem("CantidadAnterior", Cantidad);


    $("#ModalAjusteBasico").modal();
}

function AbrirHistorial() {
    console.log("git")
    $("#ModalHistorialAjusteBasico").modal();
}

function ActualizarCantidad() {

    let CantidadAnterior = localStorage.getItem("CantidadAnterior")

    if (parseInt(document.getElementById("Mod_Cantidad").value) <= parseInt(CantidadAnterior)) {
        alert("No se permite menor cantidad");
    } else {

        var ObjetoTabla = {
            Clave: document.getElementById("Mod_Clave").value,
            Producto: document.getElementById("Mod_Producto").value,
            Planta: localStorage.getItem("PlantaGeneral"),
            Cantidad: document.getElementById("Mod_Cantidad").value,
            indice: document.getElementById("Mod_indice").value,
            Nombre: localStorage.getItem("Nombre"),
            CantidadAnterior: CantidadAnterior
        }
        console.table(ObjetoTabla);
        $.post("/AjusteBasico", // url
            {
                ObjetoTabla
            }, // data to be submit
            function (objeto, estatus) { // success callback
                //console.log("objeto: " + objeto + "Estatus: " + estatus);
            });

        $('#FormularioAjuste')[0].reset();
        $('#ModalEficiencia').modal('toggle');
        GETPRODUCTS();
    }
}


/**REPORTE AJUSTE BASICO */



function MostrarReporteAjusteBasico() {

    var BHerramienta = document.getElementById("RHerramienta").value;
    var Almacen = document.getElementById("Planta").value;
    var fechaInicio = document.getElementById("inicio").value;
    var fechafin = document.getElementById("fin").value;
    if (fechaInicio == null || fechaInicio == '') {
        alert("Fecha no valida")
    }else{
        
        $.ajax({
            url: '/reporteAjustesBasico/' + fechaInicio + '|' + fechafin + '|' + Almacen + '|' + BHerramienta,
            success: function (Herramientas) {
                if (Herramientas.length > 0) {
                    console.table(Herramientas)
                    var total = Herramientas.length //Total de filas 
                    var sheet_1_data = [];
        
                    sheet_1_data[0] = ["Responsable", "Producto", "Cantidad Actual", "Cantidad Anterior", "Fecha de ajuste"]
                    for (var j = 0; j < total; j++) { //filas
                        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
        
                        var Responsable = Herramientas[j].Responsable;
                        var Producto = Herramientas[j].Producto;
                        var Actual = Herramientas[j].CantidadActual;
                        var Anterior = Herramientas[j].CantidadAnterior;
                        var Fecha = moment(Herramientas[j].FechaAjuste).format('DD-MM-YYYY');
                        var Fila = [Responsable, Producto, Actual, Anterior, Fecha]
                        sheet_1_data.push(Fila);
                    } //fin filas
        
                    var opts = [{
                        sheetid: 'Hoja1',
                        header: false
                    }];
                    var result = alasql('SELECT * INTO XLSX("Reporte- '+moment().format("L")+'.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
                }else{
                    alert("No hay registros")
                }
            } //Funcion success
        }); //Ajax
    }
    
}






