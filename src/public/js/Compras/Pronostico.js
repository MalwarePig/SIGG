let N_Folio = "";
let N_Producto = "";
let N_Solicitado = "";
let N_Comentario = "";
let N_OT = "";
let N_Estatus = "Revision";

function MostrarOTs(Producto) {
    var Herramienta = Tranformer(Producto);
    $.ajax({
        url: '/RPronosticos/' + Herramienta,
        success: function (Herramientas) {
            if(Herramientas.length > 0){
                var Arreglo = [];

                // Eliminando todos los hijos de un elemento
                var element = document.getElementById("list-OT");
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
                var Total = Herramientas[0].Stock;
                var MaterialApartado = 0;
                for (var i = 0; i < Herramientas.length; i++) {
                    var item = document.createElement('a');
                    item.setAttribute("id", Herramientas[i].Producto);
                    item.setAttribute("class", "list-group-item list-group-item-action");
                    item.innerHTML = "Item: [" + Herramientas[i].Producto + "] OT: [" + Herramientas[i].OT + "] Ordenado: [" + Herramientas[i].Cantidad + "]";
                    MaterialApartado = MaterialApartado + Herramientas[i].Cantidad;
                    document.getElementById('list-OT').appendChild(item);
                    $("#Modal").modal();
                }
                var item = document.createElement('a');
                item.setAttribute("id", Herramientas[0].Producto);
                item.setAttribute("class", "list-group-item list-group-item-action");
                item.innerHTML = Herramientas[0].Producto + " " + (Total-MaterialApartado) + " Sobrante";
                document.getElementById('list-OT').appendChild(item);
                $("#Modal").modal();
            }
            
        } //Funcion success
    }); //Ajax 
}

//=========================================== Guardar elementos de la nota =================================================//
function CrearNota() {
    var tabla = document.getElementById("OTRegistros");
    var total = tabla.rows.length //Total de filas
    var Arreglo = [];
    var ObjetoTabla = {};//Para guardar los elementos seleccionados de la tabla

    // Eliminando todos los hijos de un elemento
    var element = document.getElementById("CuerpoNota");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    for (var j = 1; j <= total-1; j++) { //Recorer filas
        var Check = document.getElementById((j-1)); //Obtener filas seleccionada
        if (Check.checked == true) {
            var identificador = "Button" + (j-1); //Traer el valor del boton que es el nombre de la herramienta

            ObjetoTabla = {
                Folio: "GEMCOM-00001",
                Clave: tabla.rows[j].cells[1].childNodes[0].nodeValue,
                Producto: document.getElementById(identificador).value,
                Solicitado: tabla.rows[j].cells[3].childNodes[0].nodeValue,
                OTs: tabla.rows[j].cells[5].childNodes[0].nodeValue,
                Comentario: tabla.rows[j].cells[6].childNodes[0].nodeValue
            }
            Arreglo.push(ObjetoTabla);
        }
    }

    //Crear Tabla para modal
    var limite = Arreglo.length;
    for (var i = 0; i < limite; i++) {
        N_Folio = Arreglo[i].Folio;
        N_Clave = Arreglo[i].Clave;
        N_Producto = Arreglo[i].Producto;
        N_Solicitado = Arreglo[i].Solicitado;
        N_OT = Arreglo[i].OTs;
        N_Comentario = Arreglo[i].Comentario;

        //Eliminar variable dentro del For
        ArregloFinal = [N_Folio,N_Clave, N_Producto, N_Solicitado, N_OT,N_Comentario];
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

//=========================================== Guardar elementos de la nota =================================================//
function GuardarNota() {
    var tabla = document.getElementById("TablaRequisicion");
    var total = tabla.rows.length//Total de filas
    for (var j = 1; j <= total - 1; j++) {//filas

        var ObjetoTabla = {
            Folio: tabla.rows[j].cells[0].childNodes[0].nodeValue,
            Clave: tabla.rows[j].cells[1].childNodes[0].nodeValue,
            Producto: tabla.rows[j].cells[2].childNodes[0].nodeValue,
            Solicitado: tabla.rows[j].cells[3].childNodes[0].nodeValue,
            OT: tabla.rows[j].cells[4].childNodes[0].nodeValue,
            Comentario:tabla.rows[j].cells[5].childNodes[0].nodeValue
        }

        console.log(ObjetoTabla);
        $.post("/GuardarNotaCompras", // url
            {
                ObjetoTabla
            }, // data to be submit
            function (objeto, estatus) { // success callback
                //console.log("objeto: " + objeto + "Estatus: " + estatus);
            });
    }
    $("#Listo").modal();
setTimeout ("redireccionar()", 2000);//Tiempo para reedireccionar
}

function redireccionar() {
    location.reload();
}

//=========================================== Fromato Fechas =================================================//

function Fecha() {
    var tabla = document.getElementById('OTRegistros').getElementsByTagName('tbody')[0];
    var total = tabla.rows.length//Total de filasa
    for (var j = 0; j < total; j++) {//filas
        var Fecha =  new Date(tabla.rows[j].cells[9].childNodes[0].nodeValue);
        var dd = Fecha.getDate();
        var mm = Fecha.getMonth() + 1;
        var yyyy = Fecha.getFullYear();
        var HH = Fecha.getHours();
        var mi = Fecha.getMinutes();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '/' + mm + '/' + yyyy;
        document.getElementById("Fecha_solicitado"+j).innerHTML = today;
    }//fin filas
}



//Intercambiar el diagonal por otro simbolo para no tener problemas con el url
function Tranformer (variable){
    var Herramienta = "";
    for(var q = 0; q< variable.length;q++){
       if(variable.charAt(q) == '/'){
           Herramienta += '|';
       }else{
        Herramienta += variable.charAt(q);
       }
    }
    return Herramienta;
}