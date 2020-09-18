//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
$(function () {
    // GET PRODUCTS}
    Modal();
    $('#BuscarPlanta').on('click', () => {
        $.ajax({
            url: '/VerAlmacen/' + document.getElementById("Herramienta").value,
            success: function (Herramientas) {
                var Arreglo = [];
                //Limpiar tabla 
                var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
                var limite = TablaAlmacen.rows.length;
                for (var i = 0; i < limite; i++) {
                    $("#Rows").remove();//elimina los elementos con id Rows
                }
                for (var i = 0; i < Herramientas.length; i++) {
                    var Clave = Herramientas[i].Clave;
                    var Producto = Herramientas[i].Producto;
                    var Stock = Herramientas[i].Stock;
                    var StockUsado = Herramientas[i].StockUsado;
                    var Ubicacion = Herramientas[i].Ubicacion;
                    //Eliminar variable dentro del For
                    Arreglo = [Clave, Producto, Stock, StockUsado, Ubicacion]
                    var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
                    // inserta una fila al final de la tabla
                    var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                    for (var x = 0; x < Arreglo.length; x++) {
                        // inserta una celda en el indice 0
                        var newCell = newRow.insertCell(x);
                        newRow.setAttribute("id", "Rows");//se asigna id al incrementar cada fila +1 para contar el encabezado
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);

                        if (x == 4) {//Si termina de registrar datos crear el boton
                            var newCell = newRow.insertCell(5); //CREAR CELDA
                            newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (i + 1) + ')> Apartar </button>';
                        }
                    }//fin de for de columnas
                }//fin de for de filas
            }//Funcion success
        });//Ajax
    });//Evento clic
});//Funcion JQuery

function Modal(){
    $("#ModalApartado").modal();
}

function Mostrar(){

    alert(document.getElementById("OT").value);

}