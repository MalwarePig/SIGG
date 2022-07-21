//=========================================== EVENTO CLIC SOBRE BOTON EN FORMULARIO PARA CREAR LA NOTA DE SALIDA =================================================//
function CrearNotas() {
    var Producto = document.getElementById("Producto").value; //Obtiene el valor de Clave
    var Cantidad = document.getElementById("cantidad").value; //Obtiene el valor de Clave
    var Estado = document.getElementById("Estado").value; //Obtiene el valor de Clave   
    var Empleado = document.getElementById("Nombre").value; //Obtiene el valor de Clave
    var Comentario = document.getElementById("Comentario").value; //Obtiene el valor de Clave

    var Arreglo = [Producto, Cantidad, Estado, Empleado, Comentario];

    var Condicion = true; //para campos vacios
    for (var a in Arreglo) { //recorrer arreglo en busca de campos vacios
        if (Arreglo[a].length == 0) {
            Condicion = false; //si algun campo esta vacio cambia a falso
        }
    }

    if (Condicion == true) { //si todos los campos estan llenos avanza
        var TablaAlmacen = document.getElementById('Almacen').getElementsByTagName('tbody')[0];
        // inserta una fila al final de la tabla
        var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
        let indice = (TablaAlmacen.rows.length );
        newRow.setAttribute("id", "fila" + indice); //se asigna id al incrementar cada fila +1 para contar el encabezado
        for (var x = 0; x < Arreglo.length; x++) {

            // inserta una celda en el indice 0
            var newCell = newRow.insertCell(x);
            // adjuntar el texto al nodo
            var newText = document.createTextNode(Arreglo[x]);
            newCell.appendChild(newText);
            if (x == 4) { //Si termina de registrar datos crear el boton
                var newCell = newRow.insertCell(5); //CREAR CELDA onclick="CrearNota()"
                newCell.innerHTML = '<button id="' + x + '" class="btn btn-danger" name="btn" onclick="EliminarFilaNota(' + indice + ')"> Eliminar </button>';
            }
        }

        //document.getElementById("RegistroSalida").reset();
        document.getElementById("Producto").value = "";
        document.getElementById("cantidad").value = "";
        document.getElementById("Comentario").value = "N/A";
    }
}
//=========================================== CONSULTAR HERRAMIENTAS -- BOTON BUSCAR  =================================================//
function GETPRODUCTS() {
    var Herramientas = Tranformer(document.getElementById("BHerramienta").value);
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
                var Clave = Herramientas[i].Clave;
                var Producto = Herramientas[i].Producto;
                var Stock = Herramientas[i].Stock;
                var StockUsado = Herramientas[i].StockUsado;
                var Ubicacion = Herramientas[i].Ubicacion;
                var Almacen = Herramientas[i].Almacen;
                //Eliminar variable dentro del For
                Arreglo = [Clave, Producto, Stock, StockUsado, Ubicacion,Almacen]
                var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);

                    if (x == 5) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(6); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (i + 1) + ')> Selección </button>';
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
} //Evento clic

//=========================================== BUSCAR TRABAJADORES POR NUMERO DE NOMINA =================================================//
function Nombres(e) {
    if (e.keyCode == 13) {
        $.ajax({
            url: '/Num_Nomina',
            success: function (empleados) {
                let Nomina = document.getElementById("Empleado").value;
                for (var i = 0; i < empleados.length; i++) {
                    if (Nomina == empleados[i].Nomina) {
                        document.getElementById("Nombre").value = empleados[i].Nombre;
                    }
                }
            } //Funcion success
        }); //Ajax 
        return false;
    }
}

//=========================================== BUSCAR TRABAJADORES POR NUMERO DE NOMINA =================================================//
function runScript(e) {
    if (e.keyCode == 13) {
        GETPRODUCTS();
    }
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

//=========================================== EVENTO CLIC SOBRE LA TABLA DE BUSQUEDA PARA SELECCIONAR HERRAMIENTA =================================================//
function Seleccion(variable) {
    Registro = document.getElementById("Herr_Encontradas");

    var Clave = Registro.rows[variable].cells[0].childNodes[0].nodeValue; //Obtiene el valor de Clave
    var Producto = Registro.rows[variable].cells[1].childNodes[0].nodeValue; //Obtiene el valor de Producto
    var Stock = Registro.rows[variable].cells[2].childNodes[0].nodeValue; //Obtiene el valor de Stock
    var StockUsado = Registro.rows[variable].cells[3].childNodes[0].nodeValue; //Obtiene el valor de StockUsado
    var Ubicacion = Registro.rows[variable].cells[4].childNodes[0].nodeValue; //Obtiene el valor de Ubicacion

    document.RegistroSalida.Sal_Herramienta.value = Producto;
}

//=========================================== Guardar elementos de la nota =================================================//
function GuardarNota() {
    var tabla = document.getElementById("Almacen");
    var total = tabla.rows.length //Total de filas

    var Arreglo = [];
    for (var j = 1; j <= total - 1; j++) { //filas

        var Producto = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Cantidad = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Estado = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Empleado = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var Comentario = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var ObjetoTabla = [Producto, Cantidad, Estado, Empleado, Comentario];
        Arreglo.push(ObjetoTabla);
    } //fin filas
    $.post("/CrearIntercambio", // url
        {
            Arreglo
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });
    PDF();
    //Limpiar tabla 
    var TablaAlmacen = document.getElementById('Almacen').getElementsByTagName('tbody')[0];
    var limite = TablaAlmacen.rows.length;
    for (var i = 0; i <= limite; i++) {
        $("#fila" + (i + 1)).remove(); //elimina los elementos con id Rows
    }
    document.getElementById("RegistroSalida").reset();
}

/*=================================================================================================================================================================================
====================================================================================== TAB 2 ======================================================================================
=================================================================================================================================================================================*/

//=========================================== CONSULTAR HERRAMIENTAS A INTERCAMBIO =================================================//
function MostrarIntercambio() {
    var Herramientas = Tranformer(document.getElementById("BHerramienta").value);
    $.ajax({
        url: '/MostrarIntercambio/',
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('Herr_Pendiente').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i <= limite; i++) {
                $("#Rows"+i).remove(); //elimina los elementos con id Rows
            }
            if (Herramientas.length == 0) {
                $("#Vacio").modal();
            }
            for (var i = 0; i < Herramientas.length; i++) {
                var Producto = Herramientas[i].Producto;
                var Cantidad = Herramientas[i].Cantidad;
                var Estado = Herramientas[i].Estado;
                var Empleado = Herramientas[i].Empleado;
                var Comentario = Herramientas[i].Comentario;
                var Fecha = moment(Herramientas[i].Fecha).format("DD/MM/YYYY") || '-';
                
                //Eliminar variable dentro del For
                Arreglo = [Producto, Cantidad, Estado, Empleado, Comentario, Fecha]
                var TablaAlmacen = document.getElementById('Herr_Pendiente').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + (i + 1)); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);

                    if (x == 5) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(6); //CREAR CELDA
                        newCell.innerHTML = '<input  type="checkbox" id="Check' + (i + 1) + '">';
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
} //Evento clic

//=========================================== Guardar producto a recolectar =================================================//
function Recolectar() {
    var tabla = document.getElementById("Herr_Pendiente");
    var total = tabla.rows.length //Total de filas
    var EliminarFila = [];
    var Arreglo = [];
    for (var i = 1; i < total; i++) {
        var FilaCheck = document.getElementById("Check" + i);

        if (FilaCheck.checked == true) {
            var Producto = tabla.rows[i].cells[0].childNodes[0].nodeValue;
            var Cantidad = tabla.rows[i].cells[1].childNodes[0].nodeValue;
            var Estado = tabla.rows[i].cells[2].childNodes[0].nodeValue;
            var ObjetoTabla = [Producto,Cantidad,Estado];

            
            $.post("/GuardarIntercambio", // url
            {
                ObjetoTabla
            }, // data to be submit
            function (objeto, estatus) { // success callback
               /*  setTimeout(() => {
                    EliminarFilas(EliminarFila);
                }, 2000); */
            });
            Arreglo.push(ObjetoTabla);
            EliminarFila.push(i);
        }
    }
    
   
    console.log("Me sali del for");

    
}


//Cambia el estado de auditoria del turno y reedirecciona a modulo de despacho
function EliminarFilas(variable) {
    $("#AsignadoExito").modal();
    for (var j = 0; j < variable.length; j++) {
        console.log(j);
        $("#Rows" + variable[j]).remove(); //elimina los elementos con id Rows
        if (j == (variable.length - 1)) {
            var pagina = "/wh_Intercambio";
            location.href = pagina;
        }
    }

}


//=========================================== CONSULTAR HERRAMIENTAS A INTERCAMBIO =================================================//
function MostrarCancelacion() {
    var Herramientas = Tranformer(document.getElementById("BHerramienta").value);
    $.ajax({
        url: '/MostrarCancelacion/',
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('Herr_Cancelar').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i <= limite; i++) {
                $("#RowsC"+i).remove(); //elimina los elementos con id Rows
            }
            if (Herramientas.length == 0) {
                $("#Vacio").modal();
            }
            for (var i = 0; i < Herramientas.length; i++) {
                var Producto = Herramientas[i].Producto;
                var Cantidad = Herramientas[i].Cantidad;
                var Estado = Herramientas[i].Estado;
                var Empleado = Herramientas[i].Empleado;
                var Comentario = Herramientas[i].Comentario;
                var Fecha = moment(Herramientas[i].Fecha).format("DD/MM/YYYY") || '-';
                //Eliminar variable dentro del For
                Arreglo = [Producto, Cantidad, Estado, Empleado, Comentario, Fecha]
                var TablaAlmacen = document.getElementById('Herr_Cancelar').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "RowsC" + (i)); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);

                    if (x == 5) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(6); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + x + '" class="btn btn-danger" name="btn" onclick="EliminarFila(' + (i) + ')"> Eliminar </button>';
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
} //Evento clic

//=========================================== ELIMINAR FILA DE REGISTRO EN NOTAS =================================================//
function EliminarFila(index) {
    var tabla = document.getElementById("Herr_Cancelar");
    var Producto = Tranformer(tabla.rows[(index+1)].cells[0].childNodes[0].nodeValue);
    $.ajax({
        url: '/CancelarIntercambio/' + Producto,
        success: function (Herramientas) {
            var pagina = "/wh_Intercambio";
            location.href = pagina;
        } //Funcion success
    }); //Ajax
}

function EliminarFilaNota(index) {
    var tabla = document.getElementById("Almacen");
    $("#fila" + index).remove();
}


function FuncionFecha(variable) {
    var Fecha = new Date(variable)
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
    return today;
}

 

function PDF() {
 
    var doc = new jsPDF();
    // Add texto
    //doc.setFontSize(15);
    //doc.text(20, 20, 'Hola mundo');
    //doc.text(20, 30, 'Vamos a generar un pdf desde el lado del cliente');
    //doc.addPage();
    //Parametro X: Total 200
    //Parametro Y: Total 300
 
    doc.setFontSize(15);
    doc.setTextColor(100);
    doc.text("Orden de salida", 170, 20);
    doc.setFontSize(10);
    doc.text("Folio M-00001", 180, 25);
    var date = new Date();
    doc.setTextColor(100);
    doc.text(FuncionFecha(date), 180, 30);

    /*doc.setLineWidth(0.1);
    doc.setDrawColor(0, 0, 0);*/

    //doc.line(20, 20, 200, 20); // horizontal line

    var tabla = document.getElementById("Almacen");
    var total = tabla.rows.length //Total de filas

    var columns = ["Articulo", "Cantidad", "Estado", "Comentario"];
    var data = [];
    for (var i = 1; i < total; i++) {
        var Producto = tabla.rows[i].cells[0].childNodes[0].nodeValue;
        var Cantidad = tabla.rows[i].cells[1].childNodes[0].nodeValue;
        var Estado = tabla.rows[i].cells[2].childNodes[0].nodeValue;
        var Empleado = tabla.rows[i].cells[3].childNodes[0].nodeValue;
        var Comentario = tabla.rows[i].cells[4].childNodes[0].nodeValue;
        var array = [Producto, Cantidad, Estado, Comentario];
        data.push(array);
    }
    doc.autoTable(columns, data, {
        styles: {
            fillColor: [158, 184, 193], //Columnas
            fontSize: number = 8
        },
        columnStyles: { //Filas
            0: {
                halign: 'center',
                fillColor: [255, 255, 255],
                fontSize: number = 8
            }
        }, // Cells in first column centered and green
        margin: {
            top: 35
        }
    });

    doc.line(20, 280, 80, 280); // horizontal line (Eje X, Punto Y,Eje X,Punto Y)
    doc.text(Empleado, 30, 285);
    doc.text("Almacen Morelos", 30, 290);


    doc.line(120, 280, 195, 280); // horizontal line (Eje X, Punto Y,Eje X,Punto Y)
    doc.text("Autoriza", 155, 285);

    /*Add HTML
    var elementHTML = $('#Content').html();
    var specialElementHandlers = {
        '#elementH': function (element, renderer) {
            return true;
        }
    };

    doc.fromHTML(elementHTML, 5, 5, {
        'width': 100,
        'elementHandlers': specialElementHandlers
    });*/

    // Save the PDF
    doc.save('documento.pdf');

}