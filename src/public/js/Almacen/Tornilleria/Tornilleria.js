function ModalAccesorios() {
    console.clear();
    $("#ModalAccesorios").modal();
}
 

function RegistrarAccesorio() {
    let Linea = {
        Tor_OC: document.getElementById("Tor_OC").value,
        Tor_OT: document.getElementById("Tor_OT").value,
        Tor_Producto: document.getElementById("Tor_Producto").value,
        Tor_PO: document.getElementById("Tor_PO").value,
        Tor_ENS: document.getElementById("Tor_ENS").value,
        Tor_Cantidad: document.getElementById("Tor_Cantidad").value,
        Tor_Ubicacion: document.getElementById("Tor_Ubicacion").value,
        Tor_Recibe: document.getElementById("Tor_Recibe").value
    }

    $.post("/RegistrarAccesorio", // inicia la lista de ot en el flujo de produccion
        {
            Linea
        }, // data to be submit
        function (objeto, estatus) { // success callback
            //console.log("objeto: " + objeto + "Estatus: " + estatus);
            if (objeto == true) {
                Pendientes();
            }
        });
    $('#FormularioAccesorios')[0].reset();
}



function CargaAccesorios() {
    $.ajax({
        url: '/LeerAccesorios/'+ document.getElementById("Busqueda").value,
        success: function (data) {
            console.log(data[0])

            $("#CuerpoTablaAccesorios tr").remove();

            let TotalRegistros = data.length;
            var Tabla = document.getElementById('TablaAccesorios').getElementsByTagName('tbody')[0];
            for (let index = 0; index < TotalRegistros; index++) {
                let OCGemak = data[index].OCGemak;
                let OT = data[index].OT;
                let Producto = data[index].Producto;

                let POCliente = data[index].POCliente;
                let ENS = data[index].ENS;
                let Cantidad = data[index].Cantidad;

                let Ubicacion = data[index].Ubicacion;
                let Entregado = data[index].Entregado;
                let Recibe = data[index].Recibe;
 
                let Arreglo = [OCGemak,OT,Producto,POCliente,ENS,Cantidad,Ubicacion,Entregado,Recibe];
                 // inserta una fila al final de la tabla
                 var newRow = Tabla.insertRow(Tabla.rows.length);
                 Entregado != null ? newRow.style.backgroundColor = "#ffd2d2" : newRow.style.backgroundColor = "#ffd2d2";  
                 
                 for (var x = 0; x < Arreglo.length; x++) {
                      // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"+index); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);
                 } //fin de for de columnas
            }

            //document.getElementById("TotalMuerto").value = (data[0].TMUno + data[0].TMDos + data[0].TMTres);

        } //Funcion success
    }); //Ajax 
}


