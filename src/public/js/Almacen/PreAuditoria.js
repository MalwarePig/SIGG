function Modal() {
    $("#ModalAuditoria").modal();
}

function Aplicar() {
    /////////////////////////////////// = GUARDAR LOS REGISTROS FALTANTES= /////////////////////////////////////////////////////
    var aceptar = document.getElementById("Confirmacion");
    if (aceptar.checked == true) { //confirmacion de apcetar la auditoria
        var tabla = document.getElementById("Registros");
        var total = tabla.rows.length //Total de filas

        var Arreglo = [];
        var ObjetoTabla = {};
        for (var j = 1; j <= total - 1; j++) { //Recorer filas
            var Check = document.getElementById(j - 1); //Obtener filas seleccionadas
            if (Check.checked == true) {
                ObjetoTabla = {
                    Producto: tabla.rows[j].cells[1].childNodes[0].nodeValue,
                    Cantidad: tabla.rows[j].cells[2].childNodes[0].nodeValue,
                    Nota: '-'
                }
                Arreglo.push(ObjetoTabla);
            }
        }
        var Nota = document.getElementById("Nota").value;
        if (Nota) {
            ObjetoTabla = {
                Producto: '-',
                Cantidad: 0,
                Nota: Nota
            }
            Arreglo.push(ObjetoTabla);
        }

        for (var i = 0; i < Arreglo.length; i++) { //Envia los datos checkeados
            var Datos = {
                Producto: Arreglo[i].Producto,
                Cantidad: Arreglo[i].Cantidad,
                Nota: Arreglo[i].Nota
            }
            $.post("/CheckAuditoria", // url
                {
                    Datos
                }, // data to be submit
                function (objeto, estatus) { // success callback

                });
        }
        /////////////////////////////////// = CREAR SEGUNDO MODAL = /////////////////////////////////////////////////////
        //Limpiar tabla 
        var TablaAlmacen = document.getElementById('Auditoria').getElementsByTagName('tbody')[0];
        var limiteAuditoria = TablaAlmacen.rows.length;
        for (var i = 0; i < limiteAuditoria; i++) {
            // $("#Rows").remove(); //elimina los elementos con id Rows
        }

        //Toma los registros de la tabla y se guardan en un arreglo
        Registro = document.getElementById("Registros").getElementsByTagName('tbody')[0];
        var limitesRegistros = Registro.rows.length;
        var ListaTabla = [];
        for (var j = 0; j < limitesRegistros; j++) {
            ListaTabla.push(Registro.rows[j].cells[1].childNodes[0].nodeValue); //Obtiene el valor de Producto
        }

        //se pasan a una lista para ser auditados de manera aleatoria si son 5 se toman al alazar o si son menos se toma los que existan
        if (ListaTabla.length >= 5) {
            //Funcion random aleatorios del 1-5 sin repetirse
            var ListaAuditoria = [];
            var myArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            myArray.length = ListaTabla.length;
            var i, j, k;
            for (i = myArray.length; i; i--) {
                j = Math.floor(Math.random() * i);
                k = myArray[i - 1];
                myArray[i - 1] = myArray[j];
                myArray[j] = k;
                ListaAuditoria.push(ListaTabla[k]);
            }
            ListaAuditoria.length = 5;
        } else {
            //Funcion random aleatorios del 1-5 sin repetirse
            var ListaAuditoria = [];
            var myArray = ['0', '1', '2', '3', '4'];
            myArray.length = ListaTabla.length;
            var i, j, k;
            for (i = myArray.length; i; i--) {
                j = Math.floor(Math.random() * i);
                k = myArray[i - 1];
                myArray[i - 1] = myArray[j];
                myArray[j] = k;
                ListaAuditoria.push(ListaTabla[k]);
            }
        }

        //Creacion de las celdas
        TablaAlmacen = document.getElementById('Auditoria').getElementsByTagName('tbody')[0];
        for (var fila = 1; fila <= ListaAuditoria.length; fila++) {
            // inserta una fila al final de la tabla
            var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
            let indice = (TablaAlmacen.rows.length + 1);
            newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
            for (var x = 0; x < 2; x++) { //Limite = 1 porque solo se ocupa un dato
                if (x == 1) { //Si termina de registrar datos crear el boton
                    var newCell = newRow.insertCell(1); //CREAR CELDA onclick="CrearNota()"
                    newCell.innerHTML = '<input type="text" id="Producto' + fila + '" class="form-control"></input>';
                } else {
                    var newCell = newRow.insertCell(x);

                    var newText = document.createTextNode(ListaAuditoria[fila - 1]);
                    newCell.appendChild(newText);
                }
            } //For celdas
        } //For Filas
        $("#ModalAuditoriaDos").modal();

        
    } else { //no acepto confirmar informacion
        alert("Debes confirmar la auditoria");
    }
}

//Cambia el estado de audotria del turno y reedirecciona a modulo de despacho
function redireccionar() {
    var objeto = { //objeto vacio
        estatus: true
    }
    $.post("/EstatusAudi", // url
        {
            objeto
        }, // data to be submit
        function (objeto, estatus) { // success callback
            var pagina = "/wh_Salidas";
            location.href = pagina;
        });
}

function SaveAuditoriaCiclica() {
    //Toma los registros de la tabla y se guardan en un arreglo
    Registro = document.getElementById("Auditoria");
    var limiteRegistros = Registro.rows.length;
    for (var j = 1; j < limiteRegistros; j++) {
        var Producto = Tranformer(Registro.rows[(j)].cells[0].childNodes[0].nodeValue);
        RegistroCiclico(Producto,j);
    }
    setTimeout ("redireccionar()", 1000);//Tiempo para reedireccionar

}

function RegistroCiclico(Producto,j){
    var Producto = Tranformer(Registro.rows[(j)].cells[0].childNodes[0].nodeValue);
    $.ajax({
        url: '/StockActual/' + Producto,
        success: function (Consulta) {
            var ObjetoTabla = {
                Producto:  Consulta[0].Producto,
                Supuesto: document.getElementById("Producto" + j).value,
                Actual: Consulta[0].Stock
            }

            $.post("/AudiCiclica", // url
                {
                    ObjetoTabla
                }, // data to be submit
                function (objeto, estatus) { // success callback
                    //console.log("objeto: " + objeto + "Estatus: " + estatus);
                });
        } //Funcion success
    }); //Ajax
}

//Intercambiar el diagonal por otro simbolo para no tener problemas con el url
function Tranformer(variable) {
    var Herramienta = "";
    for (var q = 0; q < variable.length; q++) {
        if (variable.charAt(q) == '/') {
            Herramienta += '|';
        } else {
            Herramienta += variable.charAt(q);
        }
    }
    return Herramienta;
}