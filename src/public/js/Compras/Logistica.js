function modal() {
    $("#ModalImportaciones").modal();
}

function Buscar() {
    var Variable = document.getElementById("Pedimento").value;
    if(Variable > 0){
        alert(Variable.length);
        $.ajax({
            url: '/BuscarPedimento/' + Variable,
            success: function (Data) {
                var Arreglo = [];
                //Limpiar tabla 
                var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
                var limite = TablaAlmacen.rows.length;
                for (var i = 0; i < limite; i++) {
                    $("#Rows").remove(); //elimina los elementos con id Rows
                }
    
                for (var i = 0; i < Data.length; i++) {
                    var id = Data[i].id;
                    var Pedimento = Data[i].Pedimento;
                    var Origen = Data[i].Origen;
                    var Proveedor = Data[i].Proveedor;
                    var Factura = Data[i].Factura;
                    var Monto = Data[i].Monto;
                    var Cantidad = Data[i].Cantidad;
                    var OT = Data[i].OT;
                    var OC = Data[i].OC;
                    var Descripcion = Data[i].Descripcion;
                    var Diametro = Data[i].Diametro;
                    var DiametroIn = Data[i].DiametroIn;
                    var Largo = Data[i].Largo;
                    var LBS = Data[i].LBS;
                    var KG = Data[i].KG;
                    var Colada = Data[i].Colada;
                    var Tarima = Data[i].Tarima;
                    var FecheRegsitro = Fecha(Data[i].FecheRegsitro);
                    //Eliminar variable dentro del For
                    Arreglo = [id, Pedimento, Origen, Proveedor, Factura, Monto, Cantidad, OT, OC,Descripcion,Diametro,DiametroIn,Largo,LBS,KG,Colada,Tarima,FecheRegsitro];
                    // inserta una fila al final de la tabla
                    var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                    for (var x = 0; x < Arreglo.length; x++) {
                        // inserta una celda en el indice 0
                        var newCell = newRow.insertCell(x);
                        newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                        newRow.setAttribute("onclick", "Hola("+Arreglo[0]+")"); //se asigna id al incrementar cada fila +1 para contar el encabezado
                        // adjuntar el texto al nodo
                        var newText = document.createTextNode(Arreglo[x]);
                        newCell.appendChild(newText);

                        if (x == 18) { //Si termina de registrar datos crear el boton
                            var newCell = newRow.insertCell(19); //CREAR CELDA
                            newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (i + 1) + ')> Selección </button>';
                        }
                    } //fin de for de columnas
                } //fin de for de filas
            } //Funcion successs
        }); //Ajax
    }else{
        alert("Busqueda sin argumentos");
    }
}

//=========================================== Guardar elementos de la nota =================================================//
function GuardarNota() {
    var Pedimento = document.getElementById("Pedimento").value;
    var Origen = document.getElementById("Origen").value;
    var Proveedor = document.getElementById("Proveedor").value;
    var Factura = document.getElementById("Factura").value;
    var Monto = document.getElementById("Monto").value;
    var Cantidad = document.getElementById("Cantidad").value;
    var OT = document.getElementById("OT").value;
    var OC = document.getElementById("OC").value;
    var Descripcion = document.getElementById("Descripcion").value;
    var Diametro = document.getElementById("Diam").value;
    var DiametroIn = document.getElementById("DiamIn").value;
    var Largo = document.getElementById("Largo").value;
    var LBS = document.getElementById("LBS").value;
    var KG = document.getElementById("KG").value;
    var Colada = document.getElementById("Colada").value;
    var Tarima = document.getElementById("Tarima").value;

    var Tabla = [Pedimento, Origen, Proveedor, Factura, Monto, Cantidad, OT, OC, Descripcion, Diametro, DiametroIn, Largo, LBS, KG, Colada, Tarima]
    console.table(Tabla);
    $.post("/NuevaImportacion", // url
        {
            Tabla
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
        });
}

function Fecha(parametro) {
    var Fecha = new Date(parametro);
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

 function Hola(x){
     alert("Valor: " + x);
 }
 