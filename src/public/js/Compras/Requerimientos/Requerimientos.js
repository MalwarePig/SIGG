 function ModalPeticiones() {
   $("#ModalPeticiones").modal();
 }

 function SolicitarCompra() {
   let Folio = document.getElementById("P_Folio").value;
   let OT = document.getElementById("P_OT").value;
   let PN = document.getElementById("P_PN").value;
   let Fecha = document.getElementById("P_Fecha").value;
   let Nombre = document.getElementById("P_Nombre").value;
   let Correo = document.getElementById("P_Correo").value;
   let Producto = document.getElementById("P_Producto").value;
   let Cantidad = document.getElementById("P_Cantidad").value;
   let Link = document.getElementById("P_Link").value;
   let Notas = document.getElementById("P_Notas").value;

   var ObjetoTabla = {
     Folio: Folio,
     OT: OT,
     PN: PN,
     Fecha: Fecha,
     Nombre: Nombre,
     Correo: Correo,
     Producto: Producto,
     Cantidad: Cantidad,
     Link: Link,
     Notas: Notas
   }

   console.table(ObjetoTabla);
   $.post("/SolicitarCompra", // url
     {
       ObjetoTabla
     }, // data to be submit
     function (objeto, estatus) { // success callback
       //console.log("objeto: " + objeto + "Estatus: " + estatus);
     });
 }

 //CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
 function CargarPeticiones() {
   $.ajax({
     url: '/BuscarPeticion/' + document.getElementById("Busqueda").value,
     success: function (data) {
       if(data[0]){
        document.getElementById("Folio").value = data[0].Folio;
        document.getElementById("OT").value = data[0].OT;
        document.getElementById("PN").value = data[0].PN;
        document.getElementById("Fecha").value = data[0].Fecha;
        document.getElementById("Nombre").value = data[0].Nombre;
        document.getElementById("Correo").value = data[0].Correo;
        document.getElementById("Producto").value = data[0].Producto;
        document.getElementById("Cantidad").value = data[0].Cantidad;
        document.getElementById("Link").value = data[0].Link;
        document.getElementById("Notas").value = data[0].Notas;
        document.getElementById("Estado").value = data[0].Estado;
 
        Estado();
       }else{
         alert("Sin registros")
       }
       
     } //Funcion success
   }); //Ajax
 } //Evento click


 
 function ActualizarCompra() {
  let Folio = document.getElementById("Folio").value;
  let OT = document.getElementById("OT").value;
  let PN = document.getElementById("PN").value;
  let Fecha = document.getElementById("Fecha").value;
  let Nombre = document.getElementById("Nombre").value;
  let Correo = document.getElementById("Correo").value;
  let Producto = document.getElementById("Producto").value;
  let Cantidad = document.getElementById("Cantidad").value;
  let Link = document.getElementById("Link").value;
  let Notas = document.getElementById("Notas").value;

  var ObjetoTabla = {
    Folio: Folio,
    OT: OT,
    PN: PN,
    Fecha: Fecha,
    Nombre: Nombre,
    Correo: Correo,
    Producto: Producto,
    Cantidad: Cantidad,
    Link: Link,
    Notas: Notas
  }

  console.table(ObjetoTabla);
  $.post("/ActualizarCompra", // url
    {
      ObjetoTabla
    }, // data to be submit
    function (objeto, estatus) { // success callback
      //console.log("objeto: " + objeto + "Estatus: " + estatus);
    });
}


 
function EliminarCompra() {
  let Folio = document.getElementById("Folio").value;
  
  var ObjetoTabla = {
    Folio: Folio
  }

  console.table(ObjetoTabla);
  $.post("/EliminarCompra", // url
    {
      ObjetoTabla
    }, // data to be submit
    function (objeto, estatus) { // success callback
      //console.log("objeto: " + objeto + "Estatus: " + estatus);
    });
}


 function Estado() {
 
   let Estado = document.getElementById("Estado").value;
   if (Estado == 'Enviado') {
     document.getElementById("Estado").style.backgroundColor = "#c8ddf9"; //AZUL
   } else if (Estado == 'Revisando') {
     document.getElementById("Estado").style.backgroundColor = "#f0f9c8"; //AMARILLO
   } else if (Estado == 'Negado') {
    document.getElementById("Estado").style.backgroundColor = "#f84b62"; //Rojo
   }else if (Estado == 'Aceptado') {
    document.getElementById("Estado").style.backgroundColor = "#b1f84b"; //Rojo
   }

 }