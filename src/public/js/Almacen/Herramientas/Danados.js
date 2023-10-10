function InicarFechas() {
    let fechaInicial = new Date()
    fechaInicial.setDate(fechaInicial.getDate() - 10);
    document.getElementById("inicio").value = moment(fechaInicial).format('YYYY-MM-DD');

    let fechaFinal = new Date()
    fechaFinal.setDate(fechaFinal.getDate() + 1);
    document.getElementById("fin").value = moment(fechaFinal).format('YYYY-MM-DD');

    let fechaModal = new Date()
    fechaFinal.setDate(fechaFinal.getDate() - 1);
    document.getElementById("fechaModal").value = moment(fechaFinal).format('YYYY-MM-DD');
    CargarImagen();
}
function CargarImagen() {
    img = new Image;
    img.src = 'images/LogoM.png';
}


function MostrarReporte() {
    var Almacen = document.getElementById("Almacen").value;

    var fechaInicio = document.getElementById("inicio").value;
    var fechafin = document.getElementById("fin").value;


    //alert(fechaInicio);
    $.ajax({
        url: '/HerramentalDano/' + Almacen + '|' + fechaInicio + '|' + fechafin,
        success: function (Herramientas) {
            var Arreglo = [];
            //Limpiar tabla 
            var TablaAlmacen = document.getElementById('TablaReporte').getElementsByTagName('tbody')[0];
            var limite = TablaAlmacen.rows.length;
            var TotalHerramientas = Herramientas.length;
            for (var i = 0; i < limite; i++) {
                $("#Rows" + i).remove(); //elimina los elementos con id Rows
            }
            for (var i = 0; i < TotalHerramientas; i++) {
                var Planta = Herramientas[i].Planta;
                var Clave = Herramientas[i].Clave;
                var Estado = Herramientas[i].Estado || Herramientas[i].Cantidad;
                var OT = Herramientas[i].OT || "-";
                var Nomina = Herramientas[i].Nomina;
                var Empleado = Herramientas[i].Empleado || "-";
                var Familia = Herramientas[i].Familia || "-";
                var Maquina = Herramientas[i].Maquina || "-";
                var Comentario = Herramientas[i].Comentario;
                var Fecha = moment(Herramientas[i].Fecha).format('DD-MM-YYYY HH:MM');
                var PDFDano = Herramientas[i].PDFDano;

                Arreglo = [Planta, Clave, Estado, OT, Nomina, Empleado, Familia, Maquina, Comentario, Fecha];

                // inserta una fila al final de la tabla
                var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
                for (var x = 0; x < Arreglo.length; x++) {
                    // inserta una celda en el indice 0
                    var newCell = newRow.insertCell(x);
                    if (PDFDano == 0) {
                        newCell.style.backgroundColor = "#ffc432" //amarillo
                        newRow.setAttribute("onclick", "LevantarReporte('" + (i + 1) + "')");
                        newRow.setAttribute("data-bs-toggle", "modal");
                        newRow.setAttribute("data-bs-target", "#ModalFormularioDanos");
                    } else {
                        newCell.style.backgroundColor = "#96ffb9" //verde
                        newRow.setAttribute("data-bs-toggle", "modal");
                        newRow.setAttribute("data-bs-target", "#ModalFormularioDanos");
                        newRow.setAttribute("onclick", "HistorialReporte('" + (i + 1) + "')"); 
                    }
                    newRow.setAttribute("id", "Rows" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado 

                    // adjuntar el texto al nodo
                    var newText = document.createTextNode(Arreglo[x]);
                    newCell.appendChild(newText);
                } //fin de for de columnas
            } //fin de for de filas
        } //Funcion success
    }); //Ajax
}


function ExcelReporte() {
    var tabla = document.getElementById("TablaReporte");
    var total = tabla.rows.length //Total de filas

    var sheet_1_data = [];
    for (var j = 0; j <= total - 1; j++) { //filas

        var Planta = tabla.rows[j].cells[0].childNodes[0].nodeValue;
        var Clave = tabla.rows[j].cells[1].childNodes[0].nodeValue;
        var Estado = tabla.rows[j].cells[2].childNodes[0].nodeValue;
        var OT = tabla.rows[j].cells[3].childNodes[0].nodeValue;
        var Nomina = tabla.rows[j].cells[4].childNodes[0].nodeValue;
        var Empleado = tabla.rows[j].cells[5].childNodes[0].nodeValue;
        var Familia = tabla.rows[j].cells[6].childNodes[0].nodeValue;
        var Maquina = tabla.rows[j].cells[7].childNodes[0].nodeValue;
        var Comentario = tabla.rows[j].cells[8].childNodes[0].nodeValue;
        var Fecha = tabla.rows[j].cells[9].childNodes[0].nodeValue;

        var Fila = [Planta, Clave, Estado, OT, Nomina, Empleado, Familia, Maquina, Comentario, Fecha]
        sheet_1_data.push(Fila);
    } //fin filas

    var opts = [{
        sheetid: 'Hoja1',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("Reporte.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}




function Contar() {
    // Obtener una referencia a la tabla
    var tabla = document.getElementById("TablaReporte");
    // Acceder a la primera fila de la tabla (fila de encabezado)
    var filaEncabezado = tabla.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0];
    // Contar el número de columnas
    var numeroDeColumnas = filaEncabezado.getElementsByTagName("th").length;
    // Mostrar el número de columnas en la consola
    console.log("Número de columnas: " + numeroDeColumnas + " - " + filaEncabezado.getElementsByTagName("th")[0].innerText);

    let Encabezado = []
    let Doc = []
    var Fila = []
    for (let index = 0; index < numeroDeColumnas; index++) {
        Encabezado.push(filaEncabezado.getElementsByTagName("th")[index].innerText)
    }
    //Doc.push(Encabezado)

    for (let Fil = 0; Fil < numeroDeColumnas; Fil++) {
        Fila = []
        for (var Col = 0; Col < numeroDeColumnas; Col++) { //filas 
            Fila.push(tabla.rows[Fil].cells[Col].childNodes[0].nodeValue);
        }
        Doc.push(Fila);
    }


}

function ExcelReporteAvanzado() {
    // Obtener una referencia a la tabla
    var tabla = document.getElementById("TablaReporte");
    //Total de filas
    var totalFilas = tabla.rows.length;
    // Acceder a la primera fila de la tabla (fila de encabezado)
    var filaEncabezado = tabla.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0];
    // Contar el número de columnas
    var numeroDeColumnas = filaEncabezado.getElementsByTagName("th").length;

    let Doc = []
    var Fila = []

    for (let Fil = 0; Fil < totalFilas; Fil++) {
        Fila = []
        for (var Col = 0; Col < numeroDeColumnas; Col++) { //filas 
            Fila.push(tabla.rows[Fil].cells[Col].childNodes[0].nodeValue);
        }
        Doc.push(Fila);
    }

    var opts = [{
        sheetid: 'Hoja1',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("Reporte.xlsx",?) FROM ?', [opts, [Doc]]);
}


//=========================================== EVENTO CLIC SOBRE LA TABLA DE BUSQUEDA PARA SELECCIONAR HERRAMIENTA =================================================//
function LevantarReporte(params) {
    Registro = document.getElementById("TablaReporte");

    var Planta = Registro.rows[params].cells[0].childNodes[0].nodeValue; //Obtiene el valor de Stock
    var Clave = Registro.rows[params].cells[1].childNodes[0].nodeValue; //Obtiene el valor de Clave
    var Estado = Registro.rows[params].cells[2].childNodes[0].nodeValue; //Obtiene el valor de Clave
    var OT = Registro.rows[params].cells[3].childNodes[0].nodeValue; //Obtiene el valor de Producto
    var Empleado = Registro.rows[params].cells[5].childNodes[0].nodeValue; //Obtiene el valor de Producto
    var Comentario = Registro.rows[params].cells[8].childNodes[0].nodeValue; //Obtiene el valor de Producto

    $.ajax({
        url: '/HerramentalClave/' + Clave,
        success: function (Herramientas) {
            document.getElementById("New_Descripcion").value = Herramientas[0].Descripcion;
            document.getElementById("FechaN").value = Herramientas[0].fechaNuevo || '-';
        } //Funcion success
    }); //Ajax

    document.getElementById("New_Planta").value = Planta
    document.getElementById("New_Clave").value = Clave
    document.getElementById("New_OT").value = OT
    document.getElementById("New_Negligencia").value = Comentario
    document.getElementById("New_Nombre").value = Empleado

}


function Nombres(e, CampoNum, CampoNom) {
    console.log(CampoNum)
    if (e.keyCode == 13) {
        $.ajax({
            url: '/Num_Nomina',
            success: function (empleados) {
                console.log(empleados)
                let Nomina = document.getElementById(CampoNum).value.toUpperCase();;
                for (var i = 0; i < empleados.length; i++) {
                    if (Nomina == empleados[i].Nomina) {
                        document.getElementById(CampoNom).value = empleados[i].Nombre;
                    }
                }
            } //Funcion success
        }); //Ajax 
        return false;
    }
}

function RegistrarPDF() {
    let Objeto = {
        Clave: document.getElementById("New_Clave").value,
        Planta: document.getElementById("New_Planta").value,
        OT: document.getElementById("New_OT").value,
        Fecha: document.getElementById("fechaModal").value,
        Descripcion: document.getElementById("New_Descripcion").value,
        Comentario: document.getElementById("New_Negligencia").value,
        Causante: document.getElementById("New_Nombre").value,
        ResponsableH: document.getElementById("New_NombreResponsable").value,
        ResponsableP: document.getElementById("New_NombreProgramacion").value,
        PDFDano: 1,
        SelectNegligencia: document.getElementById("SelectNegligencia").value,
    }

    $.post("/GuardarPDFDanado", // url
        {
            Objeto
        }, // data to be submit
        function (objeto, estatus) { // success callback
            PDF()
            MostrarReporte()
        });
}

function PDF() {

    var doc = new jsPDF();

    doc.addImage(img, 10, 10, 50, 13);

    //doc.addImage(img, 10, 28, 160, 45); //EJE X,Y  -  ANCHO Y ALTO MORELOS
    //doc.addImage(img, 10, 28,120, 45); //EJE X,Y  -  ANCHO Y ALTO Bravo

    //Fecha L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Fecha: ", 85, 20);
    doc.setFontType("normal");
    doc.text(document.getElementById("fechaModal").value, 100, 20);

    //Folio L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("F-003/REV03 ", 150, 20);

    // Empty square
    doc.rect(148, 13, 30, 10);

    doc.setFontType("bold");
    doc.setFontSize(15);
    doc.setTextColor(25);
    doc.text("REPORTE DE HERRAMIENTA DAÑADA ", 55, 40);

    //Clave L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Estado: ", 71, 60);
    doc.setFontType("normal");
    doc.text("Dañado", 90, 60);
    // horizontal line xy xy
    doc.line(90, 61, 115, 61);

    //Clave L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Planta: ", 72, 68);
    doc.setFontType("normal");
    doc.text("Bravo", 90, 68);
    // horizontal line xy xy
    doc.line(90, 69, 115, 69);

    //Estado R
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("OT: ", 128, 68);
    doc.setFontType("normal");
    doc.text("185235", 140, 68);
    doc.line(140, 69, 165, 69);



    //----------------------------------------------------------------------//
    //Clave L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Clave herramienta/equipo dañada: ", 10, 95);
    doc.setFontType("normal");
    doc.text(document.getElementById("New_Clave").value, 83, 95);
    // horizontal line xy xy
    doc.line(83, 96, 165, 96);

    //Descripcion L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Descripción de la herramienta/equipo: ", 10, 103);
    doc.setFontType("normal");
    doc.text(document.getElementById("New_Descripcion").value, 90, 103);
    // horizontal line xy xy
    doc.line(90, 104, 165, 104);

    //Negligencia L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Comentario o negligencia: ", 10, 111);
    doc.setFontType("normal");

    var loremipsum = document.getElementById("New_Negligencia").value;
    if (loremipsum.length > 42) {
        doc.setFontType("normal");
        lines = doc.splitTextToSize(loremipsum, 130); //420 el ancho de la fila para el texto
    } else {
        doc.setFontType("normal");
        // This line works. Try generating PDF.
        lines = doc.splitTextToSize(loremipsum, 130); //420 el ancho de la fila para el texto
    }
    doc.text(65, 111, lines);
    // horizontal line xy xy
    doc.line(65, 112, 165, 112);
    doc.line(10, 120, 165, 120);
    doc.line(10, 128, 165, 128);

    //Causante L 
    doc.setFontType("bold");
    doc.setFontSize(14);
    doc.text("Causante ", 10, 150);

    //Nombre L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Nombre: ", 10, 158);
    doc.setFontType("normal");
    doc.text(document.getElementById("New_Nombre").value, 30, 158);
    // horizontal line xy xy
    doc.line(30, 159, 115, 159);

    //Nombre L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Firma: ", 120, 158);
    // horizontal line xy xy
    doc.line(135, 159, 165, 159);

    //Leyenda L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Responsable de Almacen/herramentista", 10, 170);

    //Nombre L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Nombre: ", 10, 185);
    doc.setFontType("normal");
    doc.text(document.getElementById("New_NombreResponsable").value, 30, 185);
    // horizontal line xy xy
    doc.line(30, 186, 115, 186);

    //Nombre L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Firma: ", 120, 185);
    // horizontal line xy xy
    doc.line(135, 186, 165, 186);

    //Leyenda L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Coordinador Programación/Procesos", 10, 197);

    //Nombre L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Nombre: ", 10, 212);
    doc.setFontType("normal");
    doc.text(document.getElementById("New_NombreProgramacion").value, 30, 212);
    // horizontal line xy xy
    doc.line(30, 213, 115, 213);


    //Nombre L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Firma: ", 120, 212);
    // horizontal line xy xy
    doc.line(135, 213, 165, 213);

    //Leyenda L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Gerente de compras o RH (en caso de controversia) ", 10, 227);

    //Nombre L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Nombre: ", 10, 239);
    doc.setFontType("normal");
    doc.text("", 30, 239);
    // horizontal line xy xy
    doc.line(30, 240, 115, 240);

    //Nombre L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Firma: ", 120, 239);
    // horizontal line xy xy
    doc.line(135, 240, 165, 240);

    //Leyenda L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("A llenar por RH: ", 10, 254);

    //Leyenda L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Costo de la herramien a descontar $:                     a razón de                     por semana ", 10, 262);
    // horizontal line xy xy
    doc.line(87, 263, 104, 263);
    // horizontal line xy xy
    doc.line(133, 263, 150, 263);

    //Leyenda L 
    doc.setFontType("bold");
    doc.setFontSize(12);
    doc.text("Fecha de envio a nominas: ", 78, 277);
    // horizontal line xy xy
    doc.line(135, 278, 165, 278);

 
    doc.save(document.getElementById("New_Clave").value + '.pdf');
}

function Limpiar() {
    document.getElementById("Etiqueta").reset();
    document.getElementById("Usuarios").reset();
}


function HistorialReporte(params) {
    Registro = document.getElementById("TablaReporte");
    var Clave = Registro.rows[params].cells[1].childNodes[0].nodeValue; //Obtiene el valor de Clave

    $.ajax({
        url: '/HistorialReportesDanos/' + Clave,
        success: function (Herramientas) {
            document.getElementById("New_Clave").value = Herramientas[0].Clave || '-';
            document.getElementById("New_Planta").value = Herramientas[0].Planta || '-';
            document.getElementById("New_OT").value = Herramientas[0].OT || '-';
            document.getElementById("FechaN").value = Herramientas[0].fechFechaaNuevo || '-';
            document.getElementById("New_Descripcion").value = Herramientas[0].Descripcion;
            document.getElementById("New_Negligencia").value = Herramientas[0].Comentario || '-';
            document.getElementById("New_Nombre").value = Herramientas[0].Causante || '-';
            document.getElementById("New_NombreResponsable").value = Herramientas[0].ResponsableH || '-';
            document.getElementById("New_Nombre").value = Herramientas[0].ResponsableP || '-';
        } //Funcion success
    }); //Ajax
}











