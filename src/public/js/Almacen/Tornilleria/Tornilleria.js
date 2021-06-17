const { json } = require("express");

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
        url: '/LeerAccesorios/' + document.getElementById("Busqueda").value,
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
                let Entregado = data[index].Entregado || '-';
                let Recibe = data[index].Recibe || '-';

                let Arreglo = [OCGemak, OT, Producto, POCliente, ENS, Cantidad, Ubicacion, Entregado, Recibe];
                // inserta una fila al final de la tabla
                var newRow = Tabla.insertRow(Tabla.rows.length);
                Entregado != null ? newRow.style.backgroundColor = "#ffd2d2" : newRow.style.backgroundColor = "#ffd2d2";

                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows" + index); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);

                    if (x == 8) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(9); //CREAR CELDA 
                        newCell.innerHTML = '<input type="checkbox" id="Check' + index + '"   checked>';
                    }
                } //fin de for de columnas
            }
            //document.getElementById("TotalMuerto").value = (data[0].TMUno + data[0].TMDos + data[0].TMTres);
        } //Funcion success
    }); //Ajax 
}

function CargarInicial() {
    document.getElementById("FechaRecibo").value = moment().format('DD/MM/YYYY');
}


function EstadoCheck() { //Invierte los checks
    var tabla = document.getElementById("TablaAccesorios");
    var total = tabla.rows.length; //Total de filas
    for (let index = 0; index < total - 1; index++) {
        var chck = document.getElementById("Check" + index).checked;
        if (chck == true) {
            document.getElementById("Check" + index).checked = false;
        } else {
            document.getElementById("Check" + index).checked = true;
        }
    }
}


function RecolectarCandidatos() {
    PersonalSucces = [];
    var tabla = document.getElementById("TablaAccesorios");
    var total = tabla.rows.length; //Total de filas

    for (var j = 0; j < total - 1; j++) { //filas
        var chck = document.getElementById("Check" + j).checked;
        if (chck == true) {
            PersonalSucces.push({
                OCCompra: Registro.rows[j].cells[0].childNodes[0].nodeValue,
                OT: Registro.rows[j].cells[0].childNodes[0].nodeValue,
                Producto: Registro.rows[j].cells[0].childNodes[0].nodeValue,
                POCliente: Registro.rows[j].cells[0].childNodes[0].nodeValue,
                ENS: Registro.rows[j].cells[0].childNodes[0].nodeValue,
                Cantidad: Registro.rows[j].cells[0].childNodes[0].nodeValue,
                Ubicación: Registro.rows[j].cells[0].childNodes[0].nodeValue,
                Fecha: Registro.rows[j].cells[0].childNodes[0].nodeValue,
                Recibe: Registro.rows[j].cells[0].childNodes[0].nodeValue
            })
        }
    } //fin filas
    console.table(PersonalSucces);
    EnviarCorreo();

}