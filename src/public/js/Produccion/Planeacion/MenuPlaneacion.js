 var tarjetaRespaldo;

 //CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
 function ObtenerFamiliasPlantas() {
     tarjetaRespaldo = document.getElementById("Prototipo").innerHTML;
     $.ajax({
         url: '/ListaFamilias/',
         success: function (Data) {
             let TotalRegistros = Data.length;

             for (let x = 0; x < TotalRegistros; x++) {
                 Paneles(Data[x].Familia, Data[x].Planta, x);
             }
             console.table(Data)
         } //Funcion success
     }); //Ajax
 } //Evento clic


 function Paneles(Familia, Planta, indice) {
     var tarjeta = tarjetaRespaldo;
     //Crear elemento li
     let li = document.createElement("li"); //Creo un nuevo div para la nueva tarjeta
     li.setAttribute('class', 'col-12 col-md-6 col-lg-3');
     li.id = indice;
     li.innerHTML = tarjeta;

     document.getElementById("PanelPrincipal").appendChild(li); //Incrusta el nuevo div en el apartado de subAcordion

     //Crear link
     var imagen = document.getElementById("Imagen");
     imagen.id = indice;
     let link = document.createElement("a");
     link.setAttribute('href', '/Listado/' +Familia + '|' + Planta);

     //Cargar imagen
     const Picture = document.createElement("img");
     Picture.setAttribute('src', 'images/Maquinas.png');
     Picture.setAttribute('class', 'img-responsive');

     link.appendChild(Picture);
     imagen.appendChild(link);

     //Crear texto
     let CajaTexto = document.getElementById("Texto");
     CajaTexto.id = Familia + "_" + Planta;

     let Titulo = document.createElement("h3");
     let TipoFamilia = Familia;
     Titulo.innerHTML = TipoFamilia;

     let SubNombre = document.createElement("p");
     let Texto = Familia + " " + Planta;
     SubNombre.innerHTML = Texto;

     CajaTexto.appendChild(Titulo)
     CajaTexto.appendChild(SubNombre)

 }