
//Mostrar Tareas Activas
var ListaTareas = []
var TotalTareas = []
function MostrarFormulario() {

    var BotonEscondido = document.querySelector("#BotonEscondido"); 
    BotonEscondido.setAttribute("Style","display: block");

    //Limpiar Lista Maestra
    var Lista = document.querySelector("#Contenedor");
    while (Lista.firstChild) {
        //The list is LIVE so it will re-index each call
        Lista.removeChild(Lista.firstChild);
    }

    //Construir Lista Maestra con tarjetas
    var ItemOriginal = document.querySelector("#Item-Borrador").innerHTML;

 
    for (let index = 0; index < document.getElementById("Copias").value; index++) {
        var Lista = document.querySelector("#Contenedor");

        const div = document.createElement("div"); //Creo un nuevo div para la nueva tarjeta
        div.setAttribute("class", "form-row");
        div.innerHTML = ItemOriginal;
        Lista.appendChild(div); 

        var REF = document.querySelector("#REF"); 
        REF.id = 'REF' + index;

        var LOT = document.querySelector("#LOT"); 
        LOT.id = 'LOT' + index; 
    }
    Carga();
}


var img = new Image;
function Carga() {
    img = new Image;
    img.src = 'images/LogoM.png';
}
 

function CargarImagen() {
    img = new Image;
    console.log("repetidor")
    img.src = 'images/LogoM.png';
}



function PDF() {
    CargarImagen();
    var doc = new jsPDF('l', 'mm', [432, 279.5]); 
    localStorage.setItem('CadenaLOT', document.getElementById("LOT").value);

    let copias = document.getElementById("Copias").value;
    for (let index = 0; index < copias; index++) {
        if (index == 0) {
            EscribirPDF(doc, 0,index);
        } else {
            doc.addPage();
            EscribirPDF(doc, 1,index);
        }
    } 
    doc.save(document.getElementById("PN").value + '.pdf');
}


function EscribirPDF(doc, incrementa,index) {
    doc.addImage(img, 10, 28, 160, 45);
    //doc.addImage(img, 10, 28, 160, 45); //EJE X,Y  -  ANCHO Y ALTO MORELOS
    //doc.addImage(img, 10, 28,120, 45); //EJE X,Y  -  ANCHO Y ALTO Bravo

    doc.setFontType("bold");
    doc.setFontSize(50);
    doc.setTextColor(25);
    doc.text("P.N-REV: ", 10, 100);
    doc.setFontType("normal");
    doc.text(document.getElementById("PN").value, 95, 100);

    doc.text("QTY: 1", 260, 100);

    doc.setFontType("bold");
    doc.text("DESC: ", 33, 125);
    doc.setFontType("normal");
    doc.text(document.getElementById("description").value, 95, 125);




    









    doc.setFontType("bold");
    doc.text("PO# / LINE#: ", 10, 150);
    doc.setFontType("normal");
    doc.text(document.getElementById("PO").value, 120, 150);

    doc.setFontType("bold");
    doc.text("HEAT / REF: ", 11, 175);
    doc.setFontType("normal");
    doc.text(document.getElementById("REF"+index).value, 120, 175);

    doc.setFontType("bold");
    doc.text("SER / LOT: ", 23, 200);
    doc.setFontType("normal");

    let CadenaLOT = localStorage.getItem('CadenaLOT');
    //let LOT = Consecutivo(CadenaLOT, incrementa).toString();

    let LOT = CadenaLOT;
    console.log("Esto es lot: " + typeof(LOT) + LOT)
    doc.text(LOT, 120, 200);

    doc.setLineWidth(0.5)//Grueso de linea
    doc.line(5, 25, 425, 25)//Puntos (x,y)(x,y) Horizontal superior
    doc.line(5, 25, 5, 270)//Puntos (x,y)(x,y) Vertical izquierda
    doc.line(425, 25, 425, 270)//Puntos (x,y)(x,y) Vertical derecha
    doc.line(5, 270, 425, 270)//Puntos (x,y)(x,y) Horizontal inferior
}

function Consecutivo(Cadena, incrementa) {
    let Arreglo = Cadena.split("").reverse();//Se voltea la cadena
    let NumeroConsecutivo = true;//Para solo obtener los primeros digitos(los ultimos)
 
    let ArregloConsecutivo = [];
    let ArregloRestoCadena = [];
    for (let index = 0; index < Arreglo.length; index++) {
        if ((isNum(Arreglo[index])) && (NumeroConsecutivo == true)) { //Solo numeros
            ArregloConsecutivo.push(Arreglo[index]);
        } else {
            NumeroConsecutivo = false;
            ArregloRestoCadena.push(Arreglo[index]);
        }
    }

    let nuemeroFinal = parseInt(ArregloConsecutivo.reverse().join('')) + incrementa;
    let NuevaCadena = ArregloRestoCadena.reverse().join('') + nuemeroFinal; 
    console.log("funcion");

    localStorage.setItem('CadenaLOT', NuevaCadena);
    return NuevaCadena;
}

function isNum(val) {
    return !isNaN(val)
}