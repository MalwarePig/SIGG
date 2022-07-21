function BuscarKits(){
    var temp = document.getElementById("accordion").childNodes.length;
    if (temp == 0) {
        $.ajax({
            url: '/BuscarKits/'+document.getElementById("NameKit").value,
            success: function (Kits) {
                var TotalKits = Kits.length;
                for (var i = 0; i < TotalKits; i++) {
                    MostrarKits(i);
                    document.getElementById('OT' + i).value = Kits[i].OT;
                    document.getElementById('Cliente' + i).value = Kits[i].Cliente;
                    document.getElementById('Rev' + i).value = Kits[i].Rev;
                    document.getElementById('PO' + i).value = Kits[i].PO;
                    document.getElementById('Ens' + i).value = Kits[i].Ens;
                    document.getElementById('Parte' + i).value = Kits[i].Parte;
                    document.getElementById('Cant' + i).value = Kits[i].Cantidad;
                    document.getElementById('Pendiente' + i).value = Kits[i].Pendientes;
                    document.getElementById('Descripcion' + i).value = Kits[i].Descripcion;
                } //fin de for de filas
            } //Funcion success
        }); //Ajax
    }
}

function Evento(indiceDiv) {
    var temp = document.getElementById('AccordionSub' + indiceDiv).childNodes.length;
    if (temp == 0) {
        $.ajax({
            url: '/BuscarComponentes/' + document.getElementById("PO" + indiceDiv).value,
            success: function (Componentes) {
                var TotalComponentes = Componentes.length;
                for (var i = 0; i < TotalComponentes; i++) {
                    MostrarSub(indiceDiv, i); //Construir una subTarjeta

                    document.getElementById('S_OT' + indiceDiv + i).value = Componentes[i].OT;
                    document.getElementById('S_Cliente' + indiceDiv + i).value = Componentes[i].Cliente;
                    document.getElementById('S_Rev' + indiceDiv + i).value = Componentes[i].Rev;
                    document.getElementById('S_PO' + indiceDiv + i).value = Componentes[i].PO;
                    document.getElementById('S_Ens' + indiceDiv + i).value = Componentes[i].Ens;
                    document.getElementById('S_Parte' + indiceDiv + i).value = Componentes[i].Parte;
                    document.getElementById('S_Cant' + indiceDiv + i).value = Componentes[i].Cantidad;
                    document.getElementById('S_Pendiente' + indiceDiv + i).value = Componentes[i].Pendientes;
                    document.getElementById('S_Descripcion' + indiceDiv + i).value = Componentes[i].Descripcion;
                } //fin de for de filas
            } //Funcion success
        }); //Ajax
        //alert( document.getElementById("Parte"+vars).value);
    }
}


function MostrarKits(i) {
    //var tarjeta = document.getElementById("card");
    var tarjeta = document.getElementById("cardPrincial").innerHTML;
    //document.getElementById("accordion").innerHTML = tarjeta;

    //Crear el div
    const div = document.createElement("div"); //Creo un nuevo div para la nueva tarjeta
    div.id = "Kit" + i;
    div.innerHTML = tarjeta;
    document.getElementById("accordion").appendChild(div); //Incrusta el nuevo div en el apartado de subAcordion

    var btn = document.getElementById('BtnPrincipal'); //Se extrae el boton de la tarjeta
    //Se le asigna las propiedades para el colapso
    //document.getElementById('BtnPrincipal').setAttribute('class', 'btn btn-link collapsed');
    document.getElementById('BtnPrincipal').setAttribute('data-target', '#collapsePrincipal' + i);
    document.getElementById('BtnPrincipal').setAttribute('data-toggle', 'collapse');
    document.getElementById('BtnPrincipal').setAttribute('aria-expanded', 'false');
    document.getElementById('BtnPrincipal').setAttribute('aria-controls', 'collapseTwo');
    document.getElementById('BtnPrincipal').setAttribute('name', i);
    document.getElementById('BtnPrincipal').setAttribute('onclick', 'Evento(' + i + ')');
    btn.id = "BtnPrincipal" + i; //Se renombra el boton

    const colapsador = document.getElementById('collapsePrincipal'); //se renombra el id de la parte colapsador
    colapsador.id = 'collapsePrincipal' + i;

    //Crear el div
    const AccordionSub = document.getElementById('AccordionSub'); //se renombra el id de la parte colapsador
    AccordionSub.id = "AccordionSub" + i;

    const OT = document.getElementById('OT'); //se renombra el id de la parte colapsador
    OT.id = 'OT' + i;

    const Cliente = document.getElementById('Cliente'); //se renombra el id de la parte colapsador
    Cliente.id = 'Cliente' + i;

    const Rev = document.getElementById('Rev'); //se renombra el id de la parte colapsador
    Rev.id = 'Rev' + i;

    const PO = document.getElementById('PO'); //se renombra el id de la parte colapsador
    PO.id = 'PO' + i;

    const Ens = document.getElementById('Ens'); //se renombra el id de la parte colapsador
    Ens.id = 'Ens' + i;

    const Parte = document.getElementById('Parte'); //se renombra el id de la parte colapsador
    Parte.id = 'Parte' + i;

    const Cant = document.getElementById('Cant'); //se renombra el id de la parte colapsador
    Cant.id = 'Cant' + i;

    const Pendiente = document.getElementById('Pendiente'); //se renombra el id de la parte colapsador
    Pendiente.id = 'Pendiente' + i;

    const Descripcion = document.getElementById('Descripcion'); //se renombra el id de la parte colapsador
    Descripcion.id = 'Descripcion' + i;

    //Contar los hijos
    //var temp = document.getElementById("BtnPrincipal"+i).childNodes.length;
    //alert("Total: " + temp  );
}

function MostrarSub(indice, Fila) {

    //Obten datos
    var tarjeta = document.getElementById("cardSub").innerHTML; //Creo la subtarjeta en un objeto
    var Acordeon = document.getElementById('AccordionSub' + indice);
    //Crear el div
    const div = document.createElement("div"); //Creo un nuevo div para la nueva tarjeta
    div.id = "Sub" + indice;
    div.innerHTML = tarjeta;
    document.getElementById("AccordionSub" + indice).appendChild(div); //Incrusta el nuevo div en el apartado de subAcordion

    var btn = document.getElementById('Btn'); //Se extrae el boton de la tarjeta
    //Se le asigna las propiedades para el colapso
    document.getElementById('Btn').setAttribute('class', 'btn btn-link collapsed');
    document.getElementById('Btn').setAttribute('data-target', '#collapseThree' + Fila);
    document.getElementById('Btn').setAttribute('data-toggle', 'collapse');
    document.getElementById('Btn').setAttribute('aria-expanded', 'false');
    document.getElementById('Btn').setAttribute('aria-controls', 'collapseTwo');
    document.getElementById('Btn').setAttribute('onclick', 'CargarTabla(' + indice + ',' + Fila + ')');
    btn.id = "Btn" + indice; //Se renombra el boton

    const colapsador = document.getElementById('collapseThree'); //se renombra el id de la parte colapsador
    colapsador.id = 'collapseThree' + Fila;

    const Tabla = document.getElementById('OTRegistros'); //Renombrar la tabla interna
    Tabla.id = 'OTRegistros' + Fila;

    const OT = document.getElementById('S_OT'); //se renombra el id de la parte colapsador
    OT.id = 'S_OT' + indice + Fila;

    const Cliente = document.getElementById('S_Cliente'); //se renombra el id de la parte colapsador
    Cliente.id = 'S_Cliente' + indice + Fila;

    const Rev = document.getElementById('S_Rev'); //se renombra el id de la parte colapsador
    Rev.id = 'S_Rev' + indice + Fila;

    const PO = document.getElementById('S_PO'); //se renombra el id de la parte colapsador
    PO.id = 'S_PO' + indice + Fila;

    const Ens = document.getElementById('S_Ens'); //se renombra el id de la parte colapsador
    Ens.id = 'S_Ens' + indice + Fila;

    const Parte = document.getElementById('S_Parte'); //se renombra el id de la parte colapsador
    Parte.id = 'S_Parte' + indice + Fila;

    const Cant = document.getElementById('S_Cant'); //se renombra el id de la parte colapsador
    Cant.id = 'S_Cant' + indice + Fila;

    const Pendiente = document.getElementById('S_Pendiente'); //se renombra el id de la parte colapsador
    Pendiente.id = 'S_Pendiente' + indice + Fila;

    const Descripcion = document.getElementById('S_Descripcion'); //se renombra el id de la parte colapsador
    Descripcion.id = 'S_Descripcion' + indice + Fila;

    //Contar los hijos
    //var temp = document.getElementById("accordion").childNodes.length;
    //console.log("Total: " + temp);
}



function CargarTabla(indiceDiv, indiceTabla) {

    $.ajax({
        url: '/BuscarSubComponentes/' + document.getElementById("S_Parte" + indiceDiv + indiceTabla).value,
        success: function (Componentes) {
            var TotalComponentes = Componentes.length;
            var Arreglo = [];
            //Limpiar tabla 
            var TablaKits = document.getElementById('OTRegistros'+indiceTabla).getElementsByTagName('tbody')[0];
            var limite = TablaKits.rows.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows"+indiceDiv+indiceTabla+i).remove(); //elimina los elementos con id Rows
            }
            for (var i = 0; i < TotalComponentes; i++) {
                var Reqs = Componentes[i].Reqs;
                var Cantidad = Componentes[i].Cantidad;
                var Estatus = Componentes[i].Estatus;
                //Eliminar variable dentro del For
                Arreglo = [Reqs, Cantidad, Estatus]
 
                // inserta una fila al final de la tabla
                var newRow = TablaKits.insertRow(TablaKits.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    newRow.setAttribute("id", "Rows"+indiceDiv+indiceTabla+i); //se asigna id al incrementar cada fila +1 para contar el encabezado
                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);

                    if (x == 4) { //Si termina de registrar datos crear el boton
                        var newCell = newRow.insertCell(5); //CREAR CELDA
                        newCell.innerHTML = '<button id="' + i + '" class="btn btn-dark" name="btn" onclick=Seleccion(' + (i + 1) + ')> Selección </button>';
                    }
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
    //alert( document.getElementById("Parte"+vars).value);
}