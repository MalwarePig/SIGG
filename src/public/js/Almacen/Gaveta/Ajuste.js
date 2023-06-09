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
                $("#Vacio").modal();
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
                            newCell.innerHTML = '<input required type="text" id="id' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly style="display: none"></input>';
                            break;
                        case 1:
                            newCell.innerHTML = '<input  type="text" id="Clave' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
                            break; 
                        case 2:
                            newCell.innerHTML = '<input  type="text" id="Planta' + i + '" class="form-control" value="' + Arreglo[x] + '"></input>';
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
                        newCell.innerHTML = '<button id="ActualizarUsados' + i + '" class="btn btn-success" name="btn" onclick=AjustarGaveta(' + (i) + ') data-toggle="tooltip" data-placement="top" title="Actualiza stock usados"> <i class="fas fa-pen"></i></button>';     
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
 
    var ObjetoTabla = {
        id: id, 
        Cantidad: Cantidad, 
        CantidadUsados: CantidadUsados, 
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
    $("#ConfirmarEliminar").modal();  
}
