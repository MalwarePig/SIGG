imgPN = new Image;
imgPO = new Image;
imgSerie = new Image;
imgFecha = new Image;
function modal() {
    document.getElementById("Fecha").value = moment().format('DD-MM-YY')

    var myModal = new bootstrap.Modal(document.getElementById('ModalBaker'), {
        keyboard: false
      })
      
      myModal.show()
    
     
    //CargarImagen()
}

/***Valores de formulario*/
let arrayCodigos = ['CodigoPN', 'CodigoPO', 'CodigoSerie', 'CodigoFecha']
function Generar() {
    var PN = document.getElementById("PN").value
    var PO = document.getElementById("PO").value
    var Serie = document.getElementById("Serie").value
    var Fecha = document.getElementById("Fecha").value

    let arrayCampos = [PN, PO, Serie, Fecha]

    for (let index = 0; index < arrayCampos.length; index++) {
        if (index == 1) {
            JsBarcode("#" + arrayCodigos[index], arrayCampos[index], {
                format: "CODE128",
                lineColor: "#000000",
                width: 8,
                height: 40,
                displayValue: false,
                fontSize: 35
            });
        } else {
            JsBarcode("#" + arrayCodigos[index], arrayCampos[index], {
                format: "CODE128",
                lineColor: "#000000",
                width: 2,
                height: 40,
                displayValue: false,
                fontSize: 35
            });
        }

    }

}



async function ConverterPNG() {
    let arraySalidas = ['SalidaPN', 'SalidaPO', 'SalidaSerie', 'SalidaFecha']

    for (let index = 0; index < arraySalidas.length; index++) {

        let promise = new Promise(function (resolve, reject) {

            var outputss = document.querySelector('#' + arraySalidas[index]) // Salida
            console.log(arraySalidas[index])
            //Codigo de barras
            var svg = document.getElementById(arrayCodigos[index]);
            console.log(arrayCodigos[index])
            var svgData = new XMLSerializer().serializeToString(svg);

            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            let newWidth = 1000;

            var img = document.createElement("img");
            img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svgData));

            img.onload = function () {
                // Declare initial dimensions of the image
                let originalWidth = img.width;
                let originalHeight = img.height;
                // Declare the new width of the image
                // And calculate the new height to preserve the aspect ratio
                img.width = newWidth;
                img.height = (originalHeight / originalWidth) * newWidth;

                // Set the dimensions of the canvas to the new dimensions of the image
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, (img.width / 2), (img.height / 2));

                // Now is done 
                outputss.src = canvas.toDataURL("image/JPG")
            };
            setTimeout(() => resolve("hecho"), 100);
        });
    }

}

function GenerarPDF(params) {
    //Generar codigos de barra
    Generar();
    //Convertir imagenes en PNG
    setTimeout(() => {
        ConverterPNG()
    }, 1000);
    setTimeout(() => {
        PDF()
    }, 1500);
}

function PDF() {
    
    

    var doc = new jsPDF('l', 'mm', [432, 279.5]);

    imgPN = document.getElementById("SalidaPN").src
    imgPO = document.getElementById("SalidaPO").src
    imgSerie = document.getElementById("SalidaSerie").src
    imgFecha = document.getElementById("SalidaFecha").src

    /*PN*/
    doc.setFontType("bold");
    doc.setFontSize(50);
    doc.setTextColor(25);
    doc.text("PN: ", 10, 40);
    doc.addImage(imgPN, 'PNG', 45, 10, 400, 100);
    doc.setFontType("normal");
    doc.text(document.getElementById("PN").value, 105, 65);



    /*Rev: */
    doc.setFontType("bold");
    doc.setFontSize(50);
    doc.setTextColor(25);
    doc.text("Rev: ", 10, 90);
    doc.setFontType("normal");
    doc.text(document.getElementById("Rev").value, 50, 90);

    /*PN*/
    doc.setFontType("bold");
    doc.setFontSize(50);
    doc.setTextColor(25);
    doc.text("PO: ", 10, 140);
    doc.addImage(imgPO, 'PNG', 45, 110, 600, 100);
    doc.setFontType("normal");
    doc.text(document.getElementById("PO").value, 135, 165);

    /*Serie*/
    doc.setFontType("bold");
    doc.setFontSize(50);
    doc.setTextColor(25);
    doc.text("Serie-Nr: ", 10, 200);
    doc.addImage(imgSerie, 'PNG', 85, 170, 300, 100);
    doc.setFontType("normal");
    doc.text(document.getElementById("Serie").value, 120, 225);

    /*Fecha*/
    //doc.text("Serie-Nr: ", 10, 200);
    doc.addImage(imgFecha, 'PNG', 250, 170, 300, 100);
    doc.setFontType("normal");
    doc.text(document.getElementById("Fecha").value, 290, 225);


    //Rectangulo negro
    doc.rect(40, 240, 125, 20, "F"); 
    doc.setTextColor(255,255,255);
    doc.text("Made in México", 40, 255);
 
    doc.save("ss" + '.pdf');
}

function Limpiar() {
    document.getElementById("Etiqueta").reset();
    document.getElementById("Usuarios").reset();
}