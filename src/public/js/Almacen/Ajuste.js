//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
function GETPRODUCTS() {
    $.ajax({
        url: '/BuscarHerramientas/' + document.getElementById("BHerramienta").value + '',
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows").remove();//elimina los elementos con id Rows
            }
            if(Herramientas.length == 0){
                $("#Vacio").modal();
            }
            for (var i = 0; i < Herramientas.length; i++) {
                var id = Herramientas[i].id;
                var Clave = Herramientas[i].Clave;
                var Producto = Herramientas[i].Producto;
                var Planta = Herramientas[i].Almacen;
                var StockNuevo = Herramientas[i].Stock;
                var StockUsado = Herramientas[i].StockUsado;
                var StockMinimo = Herramientas[i].StockMin;
                var StockMaximo = Herramientas[i].StockMax;
                //Eliminar variable dentro del For
            
                Arreglo = [id, Clave, Producto, Herramientas[i].Almacen, StockNuevo,StockUsado, StockMinimo,StockMaximo]
                var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {

                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows");//se asigna id al incrementar cada fila +1 para contar el encabezado
 
                    switch(x){
                        case 0: newCell.innerHTML = '<input required type="text" id="id'+i+'" class="form-control" value="'+ Arreglo[x] +'" readonly></input>';
                        break;
                        case 1: newCell.innerHTML = '<input  type="text" id="Clave'+i+'" class="form-control" value="'+ Arreglo[x] +'"></input>';
                        break;
                        case 2: newCell.innerHTML = '<input  type="text" id="Producto'+i+'" class="form-control" value="'+ Arreglo[x] +'"></input>';
                        break;
                        case 3: newCell.innerHTML = '<input  type="text" id="Almacen'+i+'" class="form-control" value="'+ Arreglo[x] +'"></input>';
                        break;
                        case 4: newCell.innerHTML = '<input  type="text" id="StockNuevo'+i+'" class="form-control" value="'+ Arreglo[x] +'"></input>';
                        break;
                        case 5: newCell.innerHTML = '<input  type="text" id="StockUsado'+i+'" class="form-control" value="'+ Arreglo[x] +'"></input>';
                        break;
                        case 6: newCell.innerHTML = '<input  type="text" id="StockMinimo'+i+'" class="form-control" value="'+ Arreglo[x] +'"></input>';
                        break;
                        case 7: newCell.innerHTML = '<input  type="text" id="StockMaximo'+i+'" class="form-control" value="'+ Arreglo[x] +'"></input>';
                        break;
                    }

                    if (x == 4) {//Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(5); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (i + 1) + ')> Actualizar </button>';
                    }
                }//fin de for de columnas
            }//fin de for de filas
        }//Funcion success
    });//Ajax
}//Evento clic

//=========================================== Buscar con evento Enter =================================================//
function runScript(e) {
    if (e.keyCode == 13) {
        GETPRODUCTS();
    }
} 

//=========================================== Actualizar Seleccion =================================================//

function Seleccion(variable) {
    var indice = variable -1;
    Registro = document.getElementById("Herr_Encontradas");
 
    var id = document.getElementById("id"+indice).value; //Obtiene el valor de id
    var Clave = document.getElementById("Clave"+indice).value; //Obtiene el valor de Clave
    var Producto = document.getElementById("Producto"+indice).value; //Obtiene el valor de Producto
    var Ubicacion = document.getElementById("Ubicacion"+indice).value; //Obtiene el valor de Ubicacion
 
    var ObjetoTabla = {
        id: id,
        Clave: Clave,
        Producto: Producto,
        Ubicacion: Ubicacion,   
    }
 
        $.post("/ActualizarProducto", // url
        { ObjetoTabla }, // data to be submit
        function (objeto, estatus) {// success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });
}
