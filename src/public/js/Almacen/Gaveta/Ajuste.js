//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
function GETPRODUCTS() {
    var Herramienta = Tranformer(document.getElementById("BHerramienta").value);
    var Planta =  document.querySelector('input[name="inlineRadioOptions"]:checked').value
     
    $.ajax({
        url: '/BuscarHerramientasGavPlanta/' + Herramienta + '|' + Planta ,
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows" + i).remove(); //elimina los elementos con id Rows
            }
            if (Herramientas.length == 0) { 
                var myModal = new bootstrap.Modal(document.getElementById('Vacio'), {
                    keyboard: false
                  })
                  myModal.show()
            }
            for (var i = 0; i < Herramientas.length; i++) {
                var id = Herramientas[i].id;
                var Clave = Herramientas[i].Clave; 
                var Planta = Herramientas[i].Planta;
                var Grado = Herramientas[i].Grado; 
                var Cantidad = Herramientas[i].Cantidad;
                var CantidadUsados = Herramientas[i].CantidadUsados;  
               
                //Eliminar variable dentro del For

                Arreglo = [id, Clave,Planta, Grado, Cantidad,CantidadUsados]
                var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {

                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado

                    switch (x) {
                        case 0:
                            newCell.innerHTML = '<input required type="text" readonly id="id' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                            break;
                        case 1:
                            newCell.innerHTML = '<input  type="text" readonly id="Clave' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break; 
                        case 2:
                            newCell.innerHTML = '<input  type="text" readonly id="Planta' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break; 
                        case 3:
                            newCell.innerHTML = '<input  type="text" readonly id="Grado' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break;
                        case 4:
                            newCell.innerHTML = '<input  type="text" id="Cantidad' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break;
                        case 5:
                            newCell.innerHTML = '<input  type="text" id="CantidadUsados' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break; 
                    }

                    if (x == 5) { //Si termina de registrar datos crear el boton 
                        var newCell = newRow.insertCell(6); //CREAR CELDA
                        newCell.innerHTML = '<button id="ActualizarUsados' + i + '" class="btn btn-success" name="btn" onclick=AjustarGaveta(' + (i) + ') data-toggle="tooltip" data-placement="top" title="Actualiza stock de gaveta"> <i class="fas fa-pen"></i></button>';     
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
} //Evento click

//=========================================== Buscar con evento Enter =================================================//
function runScript(e) {
    if (e.keyCode == 13) {
        GETPRODUCTS();
    }
}

  
//=========================================== Actualizar Seleccion Usado =================================================//
function AjustarGaveta(variable) {
    var id = document.getElementById("id" + variable).value; //Obtiene el valor de id 
    var Cantidad = document.getElementById("Cantidad" + variable).value; //Obtiene el valor de Producto 
    var CantidadUsados = document.getElementById("CantidadUsados" + variable).value; //Obtiene el valor de Producto 
    var Clave = document.getElementById("Clave" + variable).value; //Obtiene el valor de Producto  
    var Grado = document.getElementById("Grado" + variable).value; //Obtiene el valor de Producto 
 
 
    var ObjetoTabla = {
        id: id, 
        Cantidad: Cantidad, 
        CantidadUsados: CantidadUsados, 
        Clave: Clave,
        Grado: Grado
    }

    console.table(ObjetoTabla);
    $.post("/postAjusteGaveta", // url
        {
            ObjetoTabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            console.log("objeto: " + objeto + "Estatus: " + estatus);
            if(objeto == true){
                ModalAjuste() 
                GETPRODUCTS()
            }
        }); 
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

//Intercambiar el diagonal por otro simbolo para no tener problemas con el url
function EscaparComillas(variable) {
    var Herramienta = "";
    for (var q = 0; q < variable.length; q++) {
        if (variable.charAt(q) == '"') {
            Herramienta += '\"'
        } else {
            Herramienta += variable.charAt(q);
        }
    }
    return Herramienta;
}



function ModalAjuste() {
    var myModal = new bootstrap.Modal(document.getElementById('ConfirmarEliminar'), {
        keyboard: false
      })
      myModal.show()
 
}




function MostrarReporte() {
    
    var Almacen = document.getElementById("Almacen").value;
    var fechaInicio = document.getElementById("inicio").value;
    var fechafin = document.getElementById("fin").value;
    //alert(fechaInicio);
    $.ajax({
        url: '/reporteAjustesGaveta/' + fechaInicio + '|' + fechafin + '|' + Almacen,
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
                var Producto = Herramientas[i].Producto;
                var Grado = Herramientas[i].Grado;
                var Planta = Herramientas[i].Almacen;
                var Responsable = Herramientas[i].Responsable; 
                var CantidadActualNuevo = Herramientas[i].CantidadActual;
                var CantidadNuevoAnterior = Herramientas[i].CantidadAnterior;
                var CantidadActualUsado = Herramientas[i].CantidadUsadoActual;
                var CantidadUsadoAnterior = Herramientas[i].CantidadUsadoAnterior;  
                var FechaAjuste = moment(Herramientas[i].FechaAjuste).format('DD-MM-YYYY') ;
 
                //Eliminar variable dentro del For
                Arreglo = [Producto,Grado,Planta,Responsable,CantidadActualNuevo,CantidadNuevoAnterior,CantidadActualUsado,CantidadUsadoAnterior,FechaAjuste];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);
                    if (x == 4 || x == 6) {
                        newCell.style.backgroundColor="#cbfc9d" 
                    }else if(x == 5 || x == 7){
                        newCell.style.backgroundColor="#ffa8a8"
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
}

function InicarFechas() {
    let fechaInicial = new Date()
    //fechaInicial.setDate(fechaInicial.getDate() - 1);
    document.getElementById("inicio").value= moment(fechaInicial).format('YYYY-MM-DD');

    let fechaFinal = new Date()
    fechaFinal.setDate(fechaFinal.getDate() + 1);
    document.getElementById("fin").value= moment(fechaFinal).format('YYYY-MM-DD');
       
}


function ExcelReporte() {
    var tabla = document.getElementById("TablaReporte");
    var total = tabla.rows.length //Total de filas


    var sheet_1_data = [];
    for (var j = 0; j <= total - 1; j++) { //filas
        //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;

 

        var Producto = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Grado = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Planta = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var Responsable = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var CantidadActualNuevo = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var CantidadNuevoAnterior = tabla.rows[j].cells[5].childNodes[0].nodeValue; 
        var CantidadActualUsado = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var CantidadUsadoAnterior = tabla.rows[j].cells[7].childNodes[0].nodeValue; 
        var FechaAjuste = tabla.rows[j].cells[8].childNodes[0].nodeValue; 
        var Fila = [Producto,Grado,Planta,Responsable,CantidadActualNuevo,CantidadNuevoAnterior,CantidadActualUsado,CantidadUsadoAnterior,FechaAjuste]
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Hoja1',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("Rep ajuste gaveta '+moment().format('L')+'.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}