
function modal() {
    document.getElementById("Fecha").value = moment().format('DD-MM-YY')
    $("#ModalBaker").modal();
    //CargarImagen()
}

/* function CargarImagen(){
    img = new Image;
    img.src = document.getElementById("barcode").value
} */


function PDF() {
    var doc = new jsPDF('l', 'mm', [432, 279.5]);
 
    var svg = document.getElementById('DivCodigoPN').innerHTML; 

    if (svg)
        svg = svg.replace(/\r?\n|\r/g, '').trim();

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d'); 
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvg(canvas, svg);

    var imgData = canvas.toDataURL('image/png'); 

    doc.addImage(imgData, 'PNG', 1, 1, 160, 45);

    doc.setFontType("bold");
    doc.setFontSize(50);
    doc.setTextColor(25);
    doc.text("O.C: ", 10, 100);
    doc.setFontType("normal");
    doc.text(document.getElementById("OC").value, 60, 100);


    doc.setFontType("bold");
    doc.text("OT: ", 160, 125);
    doc.setFontType("normal");
    doc.text(document.getElementById("OT").value, 200, 125);

    doc.setFontType("bold");
    doc.text("No. Parte: ", 10, 150);
    doc.setFontType("normal");
    doc.text(document.getElementById("Parte").value, 100, 150);




    doc.save(document.getElementById("OT").value + '.pdf');
}

function Limpiar() {
    document.getElementById("Etiqueta").reset();
    document.getElementById("Usuarios").reset();
}



