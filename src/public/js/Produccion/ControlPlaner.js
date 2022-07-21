

function saveVistaPlanta(){
    var tabla = document.getElementsByTagName("table")[0];

    var total = tabla.rows.length//Total de filas
  


  for(j=1;j<=total-1;j++){//filas
            //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
            var OT = tabla.rows[j].cells[1].childNodes[0].nodeValue;
            var nPart = tabla.rows[j].cells[5].childNodes[0].nodeValue;
            var Cantidad = tabla.rows[j].cells[7].childNodes[0].nodeValue;
            var Maquina = tabla.rows[j].cells[9].childNodes[0].nodeValue;
            var Inicio = tabla.rows[j].cells[10].childNodes[0].nodeValue;
            var Vencimiento = tabla.rows[j].cells[10].childNodes[0].nodeValue;
            //alert(total);
            alert("OT: " + OT + " nPart: " + nPart + " Cantidad: " + Cantidad + " Maquina: " + Maquina + " Inicio: " + Inicio + " Vencimiento: " + Vencimiento);
            ///////////////////////// INSERTAR DATOS ///////////////////////var date_format = new Date(date_input).toDateString("yyyy-MM-dd");
            //TECNO FON NPRONMEOL
    }
}

function FormtatoFechas(fecha){

    var today = new Date(fecha); 
    var dd = today.getDate(); 
    var mm = today.getMonth() + 1; 
    var yyyy = today.getFullYear(); 
    if (dd < 10) { 
        dd = '0' + dd; 
    } 
    if (mm < 10) { 
        mm = '0' + mm; 
    } 
    var today =  yyyy+ '/' + mm + '/' + dd; 
    return today
  }
  