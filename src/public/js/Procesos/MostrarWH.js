let Producto = '';
let Cantidad = 1000;
let OT = 'vacio';
let Clave = '-';
let Estatus = 'Viva';
let Comentarios = '-';
//=========================================== Buscar Herramientas =================================================// 
function BuscarHerramienta() {
    // GET PRODUCTS}
    var Herramienta = Tranformer(document.getElementById("Herramienta").value);
 
        $.ajax({
            url: '/VerAlmacen/' + Herramienta,
            success: function (Herramientas) {
                var Arreglo = [];
                //Limpiar tabla 
                var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
                var limite = TablaAlmacen.rows.length;
                for (var i = 0; i < limite; i++) {
                    $("#Rows").remove(); //elimina los elementos con id Rows
                }
                for (var i = 0; i < Herramientas.length; i++) {
                    var Clave = Herramientas[i].Clave;
                    Producto = Herramientas[i].Producto;
                    var Stock = Herramientas[i].M_Nuevo;
                    var StockUsado = Herramientas[i].M_Usado;
                    var BStock = Herramientas[i].B_Nuevo;
                    var BStockUsado = Herramientas[i].B_Usado;
                    var Ubicacion = Herramientas[i].Ubicacion;
                    //Eliminar variable dentro del For
                    Arreglo = [Clave, Producto, Stock,BStock, StockUsado,BStockUsado,(Stock + BStock),(StockUsado + BStockUsado)]
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

                        if (x == 6) { //Si termina de registrar datos crear el boton
                            var newCell = newRow.insertCell(7); //CREAR CELDA
                            newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (i + 1) + ')> Apartar </button>';
                        }
                    } //fin de for de columnas
                } //fin de for de filas
            } //Funcion success
        }); //Ajax
}//Funcion JQuery

//=========================================== Muestra Modal Para Terminar Registro =================================================//
function Seleccion(variable) {
    Modal();
    Registro = document.getElementById("Herr_Encontradas");
    Clave = '-'; //Obtiene el valor de Clave
    Producto = Registro.rows[variable].cells[1].childNodes[0].nodeValue; //Obtiene el valor de Producto
}

function Modal() {
    $("#ModalApartado").modal();
}

//=========================================== Guardar el Registro =================================================//


function Guardar() {
    Cantidad = document.getElementById("Cantidad").value;  
    OT = document.getElementById("OT").value; 
    Comentarios = document.getElementById("Comentario").value;
    if(Comentarios == null || Comentarios == ''){
        Comentarios = '-';
    }
    var Nota = {
        Clave: "-",
        Producto: Producto,
        Cantidad: Cantidad,
        OT:       OT,
        Comentarios: Comentarios,
        Estatus:  Estatus
    }

    $.post("/GuardarPronostico", // url
    { Nota }, // data to be submit
    function (objeto, estatus) {// success callback
        
    });
    limpiar();
}

function limpiar(){
document.getElementById("OT").value = "";
document.getElementById("Cantidad").value = "";
document.getElementById("Comentario").value = "";
$("#Listo").modal();

//setTimeout ("redireccionar()", 2000);//Tiempo para reedireccionar
}

function redireccionar() {
    location.reload();
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


function runScript(e) {
    if (e.keyCode == 13) {
        BuscarHerramienta();
    }
}