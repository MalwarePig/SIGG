/*
        var img = new Image;
        img.src = 'images/LogoG1.jpg';*/
var img = new Image;
img.src = 'images/Logo.png';

function modal() {
    $("#AsignadoExito").modal();
}

function PDF() {
    var doc = new jsPDF('l', 'mm', [432, 279.5]);
    /*
                doc.addImage(img, 10, 28, 50, 45); //EJE X,Y  -  ANCHO Y ALTO
                doc.setFontType("bold");
                doc.setFontSize(100);
                doc.setTextColor(100);
                doc.text("GEMAK", 62, 65);
    */

    doc.addImage(img, 10, 28, 160, 45); //EJE X,Y  -  ANCHO Y ALTO

    doc.setFontType("bold");
    doc.setFontSize(50);
    doc.setTextColor(25);
    doc.text("O.C: ", 10, 100);
    doc.setFontType("normal");
    doc.text(document.getElementById("OC").value, 60, 100);

    doc.setFontType("bold");
    doc.text("Cantidad: ", 10, 125);
    doc.setFontType("normal");
    doc.text(document.getElementById("Cantidad").value, 100, 125);
    doc.setFontType("bold");
    doc.text("OT: ", 160, 125);
    doc.setFontType("normal");
    doc.text(document.getElementById("OT").value, 200, 125);

    doc.setFontType("bold");
    doc.text("No. Parte: ", 10, 150);
    doc.setFontType("normal");
    doc.text(document.getElementById("Parte").value, 100, 150);

    doc.setFontType("bold");
    doc.text("Descripción: ", 10, 175);
    var loremipsum = document.getElementById("Descripcion").value;
    if(loremipsum.length > 42 ){
        doc.setFontType("normal");
        doc.setFontSize(40);
        lines = doc.splitTextToSize(loremipsum, 400); //420 el ancho de la fila para el texto
    }else{
        doc.setFontType("normal");
        // This line works. Try generating PDF.
        lines = doc.splitTextToSize(loremipsum, 415); //420 el ancho de la fila para el texto
    }
        doc.text(10, 200, lines);
    //doc.line(10, 205, 390, 205); // horizontal line (Eje X, Punto Y,Eje X,Punto Y)
    //doc.setFontType("bold");
   // doc.text("Usuario: ", 180, 65);
  /* doc.setFontSize(35);
    doc.setFontType("normal");
    doc.text(document.getElementById("Usuario").value.toUpperCase(), 175, 65);

    //doc.setFontType("bold");
    //doc.text("Planta: ", 220, 65);
    doc.setFontType("normal");
    doc.text(document.getElementById("Planta").value.toUpperCase() , 350, 65);
*/

    doc.save(document.getElementById("OT").value+'.pdf');
}

function Limpiar() {
    document.getElementById("Etiqueta").reset();
    document.getElementById("Usuarios").reset();
}