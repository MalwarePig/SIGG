function Ubicaciones() {

  var ListaSelect = ['Ubicacion', 'UbicacionReporte']

  $.ajax({
    url: '/UbicacionesGaveta',
    success: function (data) {

      for (let index = 0; index < 2; index++) {
        var listMaquina = document.getElementById(ListaSelect[index]);

        for (let i = listMaquina.options.length; i >= 1; i--) { //Borrar elementos option de select
          listMaquina.remove(i);
        }
        for (var i = 0; i < data.length; i++) { //Agregar nuevos options del select

          var option = document.createElement("option");
          option.text = data[i].Ubicacion;
          listMaquina.add(option);
        }
      }
    } //Funcion success
  }); //Ajax
}

var ConsultaPendiente;
//CONSULTAR HERRAMIENTAS -- BOTON BUSCAR    
function GETPRODUCTS() {
  var variable = document.getElementById("Ubicacion").value; //Cambia el simbolo '/'
  $.ajax({
    url: '/BuscarHerramientasUbicacion/' + variable,
    success: function (Herramientas) {
      ConsultaPendiente = Herramientas;
      var Arreglo = [];
      //Limpiar tabla 
      var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
      var limite = TablaAlmacen.rows.length;
      for (var i = 0; i < limite; i++) {
        $("#Rows" + i).remove(); //elimina los elementos con id Rows
      }
      if (Herramientas.length == 0) {
        $("#Vacio").modal();
      }
      for (var i = 0; i < Herramientas.length; i++) {
        var id = Herramientas[i].id;
        var Planta = Herramientas[i].Planta;
        var Ubicacion = Herramientas[i].Ubicacion;
        var Clave = Herramientas[i].Clave;
        var Descripcion = Herramientas[i].Descripcion;
        var Grado = Herramientas[i].Grado;
        var Marca = Herramientas[i].Marca;
        var FechaAjuste = Herramientas[i].FechaAjuste ? moment(Herramientas[i].FechaAjuste).format('DD-MM-YYYY') : '-'
        var Auditor = Herramientas[i].Auditor || '-';
        var Cantidad = Herramientas[i].Cantidad || '0';
        //Eliminar variable dentro del For
        Arreglo = [id, Planta, Ubicacion, Clave, Descripcion, Grado, Marca, FechaAjuste, Auditor, Cantidad]
        var TablaAlmacen = document.getElementById('Herr_Encontradas').getElementsByTagName('tbody')[0];
        // inserta una fila al final de la tabla
        var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
        for (var x = 0; x < Arreglo.length; x++) {
          // inserta una celda en el indice 0
          var newCell = newRow.insertCell(x);
          newRow.setAttribute("id", "Rows" + i); //se asigna id al incrementar cada fila +1 para contar el encabezado 
          newRow.setAttribute("name", Arreglo[4]); //se asigna id al incrementar cada fila +1 para contar el encabezado 
          switch (x) {
            case 0:
              newCell.innerHTML = '<input required type="text" id="id' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly></input>';
              break;
            case 1:
              newCell.innerHTML = '<input required type="text" id="Planta' + i + '" class="form-control"  value="' + Arreglo[x] + '" readonly></input>';
              break;
            case 2:
              newCell.innerHTML = '<input type="text" id="Ubicacion' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly></input>';
              break;
            case 3:
              newCell.innerHTML = '<input type="text" id="Clave' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly></input>';
              break;
            case 4:
              newCell.innerHTML = '<input required type="text" id="Descripcion' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly></input>';
              break;
            case 5:
              newCell.innerHTML = '<input required type="text" id="Grado' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly></input>';
              break;
            case 6:
              newCell.innerHTML = '<input required type="text" id="Marca' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly></input>';
              break;
            case 7:
              newCell.innerHTML = '<input required type="text" id="FechAjuste' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly></input>';
              break;
            case 8:
              newCell.innerHTML = '<input required type="text" id="Auditor' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly></input>';
              break;
            case 9:
              newCell.innerHTML = '<input required type="text" id="Cantidad' + i + '" class="form-control" value="' + Arreglo[x] + '" readonly></input>';
              break;

            default:
              break;
            // code block
          }
          if (x == 8) { //Si termina de registrar datos crear el boton
            var newCell = newRow.insertCell(9); //CREAR CELDA
            newCell.innerHTML = '<button id="' + i + '" class="btn btn-danger" name="btn" data-bs-toggle="modal" data-bs-target="#ModalComentario" onclick=AsignarIndice(' + (i) + ')> <i class="fa-solid fa-pen-to-square"></i> </button>';
            var newCell = newRow.insertCell(10); //CREAR CELDA
            newCell.innerHTML = '<button id="' + i + '" class="btn btn-success" name="btn" onclick=SinCambio(' + (i) + ')> <i class="fa-regular fa-square-check"></i> </button>';
          }
        } //fin de for de columnas
      } //fin de for de filas
    } //Funcion success
  }); //Ajax
} //Evento clic

function SinCambio(params) {
  //alert(document.getElementById("id" + params).value)
  var Planta = document.getElementById("Planta" + params).value; //Obtiene el valor de id 
  var Ubicacion = document.getElementById("Ubicacion" + params).value; //Obtiene el valor de id 
  var Clave = document.getElementById("Clave" + params).value; //Obtiene el valor de id 
  var Descripcion = document.getElementById("Descripcion" + params).value; //Obtiene el valor de id  
  var id = document.getElementById("id" + params).value; //Obtiene el valor de id 
  var Cantidad = document.getElementById("Cantidad" + params).value; //Obtiene el valor de id 
  var CantidadAjuste = Cantidad

  var ObjetoTabla = {
    id: id,
    Cantidad: Cantidad,
    CantidadAjuste: CantidadAjuste,
    Planta: Planta,
    Ubicacion: Ubicacion,
    Clave: Clave,
    Descripcion: Descripcion,
    Comentario: 'No requiere ajuste'
  }

  $.post("/RegistrarAuditoria", // url
    {
      ObjetoTabla
    }, // data to be submit
    function (objeto, estatus) { // success callback
      if (objeto == true) {
        var myModal = new bootstrap.Modal(document.getElementById('Cambios'), {
          keyboard: false
        })
        myModal.show()

        setTimeout(() => {
          myModal.hide();
        }, 1500);
        GETPRODUCTS()
      } else {
        var myModal = new bootstrap.Modal(document.getElementById('Error'), {
          keyboard: false
        })
        myModal.show()

        setTimeout(() => {
          myModal.hide();
        }, 1500);
      }
    });
}

function AsignarIndice(params) {
  document.getElementById("Indice").value = params
}

function Limpiar() {
  document.getElementById("Indice").value = ''
  document.getElementById("CantidadAjuste").value = ''
  document.getElementById("Comentario").value = ''
}


function Ajuste() {
  var params = document.getElementById("Indice").value;
  var Planta = document.getElementById("Planta" + params).value; //Obtiene el valor de id 
  var Ubicacion = document.getElementById("Ubicacion" + params).value; //Obtiene el valor de id 
  var Clave = document.getElementById("Clave" + params).value; //Obtiene el valor de id 
  var Descripcion = document.getElementById("Descripcion" + params).value; //Obtiene el valor de id  
  var id = document.getElementById("id" + params).value; //Obtiene el valor de id 
  var Cantidad = document.getElementById("Cantidad" + params).value; //Obtiene el valor de id 
  var CantidadAjuste = document.getElementById("CantidadAjuste").value; //Obtiene el valor de id 
  var Comentario = document.getElementById("Comentario").value; //Obtiene el valor de id 

  var ObjetoTabla = {
    id: id,
    Cantidad: Cantidad,
    CantidadAjuste: CantidadAjuste,
    Planta: Planta,
    Ubicacion: Ubicacion,
    Clave: Clave,
    Descripcion: Descripcion,
    Comentario: Comentario
  }

  $.post("/RegistrarAuditoria", // url
    {
      ObjetoTabla
    }, // data to be submit
    function (objeto, estatus) { // success callback
      Limpiar();
      if (objeto == true) {
        var myModal = new bootstrap.Modal(document.getElementById('Cambios'), {
          keyboard: false
        })
        myModal.show()

        setTimeout(() => {
          myModal.hide();
        }, 1500);
        GETPRODUCTS()
      } else {
        var myModal = new bootstrap.Modal(document.getElementById('Error'), {
          keyboard: false
        })
        myModal.show()

        setTimeout(() => {
          myModal.hide();
        }, 1500);
      }
    });
}

function MostrarReporteHerramientaAdmin() {
  var variable = document.getElementById("UbicacionReporte").value; //Cambia el simbolo '/'

  /*Limpiar tabla*/
  var TablaAlmacen = document.getElementById('TablaAuditoria').getElementsByTagName('tbody')[0];
  var limite = TablaAlmacen.rows.length;
  for (var i = 0; i < limite; i++) {
    $("#Rows").remove(); //elimina los elementos con id Rows
  }
  $.ajax({
    url: '/MostrarAuditoria/' + variable,
    success: function (Herramientas) {
      var Arreglo = [];
      //Limpiar tabla 
      var TablaAlmacen = document.getElementById('TablaAuditoria').getElementsByTagName('tbody')[0];
      var limite = TablaAlmacen.rows.length;
      var TotalHerramientas = Herramientas.length;
      for (var i = 0; i < limite; i++) {
        $("#Rows").remove(); //elimina los elementos con id Rows
      }
      for (var i = 0; i < TotalHerramientas; i++) {
        var Clave = Herramientas[i].Clave;
        var Planta = Herramientas[i].Planta;
        var Descripcion = Herramientas[i].Descripcion;
        var Ubicacion = Herramientas[i].Ubicacion;
        var CantidadActual = Herramientas[i].CantidadActual;
        var CantidadAjustada = Herramientas[i].CantidadAjustada
        var Fecha = moment(Herramientas[i].FechaAjuste).format('DD-MM-YYYY');
        var Auditor = Herramientas[i].Auditor;

        //Eliminar variable dentro del For
        Arreglo = [Clave, Planta, Descripcion, Ubicacion, CantidadActual, CantidadAjustada, Fecha, Auditor];
        // inserta una fila al final de la tabla
        var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
        for (var x = 0; x < Arreglo.length; x++) {
          // inserta una celda en el indice 0
          var newCell = newRow.insertCell(x);
          newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
          // adjuntar el texto al nodo
          var newText = document.createTextNode(Arreglo[x]);
          newCell.appendChild(newText);
        } //fin de for de columnas
      } //fin de for de filas
    } //Funcion success
  }); //Ajax 
}



function ResumenAuditoria() {
  $.ajax({
    url: '/ResumenAuditoria/',
    success: function (Herramientas) {
      console.log(Herramientas)
      var Arreglo = [];
      //Limpiar tabla 
      var TablaAlmacen = document.getElementById('ResumenAuditoria').getElementsByTagName('tbody')[0];
      var limite = TablaAlmacen.rows.length;
      var TotalHerramientas = Herramientas.length;
      for (var i = 0; i < limite; i++) {
        $("#Rows").remove(); //elimina los elementos con id Rows
      }
      for (var i = 0; i < (TotalHerramientas - 1); i++) {
        var Ubicacion = Herramientas[i].Ubicacion;
        var FechaAjuste;
        if (Herramientas[i].fecha) {
          FechaAjuste = moment(Herramientas[i].fecha).format('DD-MM-YYYY');
        } else {
          FechaAjuste = 'Sin registro'
        }

        //Eliminar variable dentro del For
        Arreglo = [Ubicacion, FechaAjuste];
        // inserta una fila al final de la tabla
        var newRow = TablaAlmacen.insertRow(TablaAlmacen.rows.length);
        for (var x = 0; x < Arreglo.length; x++) {
          // inserta una celda en el indice 0
          var newCell = newRow.insertCell(x);
          newRow.setAttribute("id", "Rows"); //se asigna id al incrementar cada fila +1 para contar el encabezado
          // adjuntar el texto al nodo
          var newText = document.createTextNode(Arreglo[x]);
          newCell.appendChild(newText);
        } //fin de for de columnas
      } //fin de for de filas
    } //Funcion success
  }); //Ajax 
}





function ExportarAuditoria() {
  var tabla = document.getElementById("TablaAuditoria");
  var total = tabla.rows.length //Total de filas


  var sheet_1_data = [];
  for (var j = 0; j <= total - 1; j++) { //filas
      //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;

      var Clave = tabla.rows[j].cells[0].childNodes[0].nodeValue;
      var Planta = tabla.rows[j].cells[1].childNodes[0].nodeValue;
      var Descripcion = tabla.rows[j].cells[2].childNodes[0].nodeValue;
      var Ubicacion = tabla.rows[j].cells[3].childNodes[0].nodeValue;
      var Anterior = tabla.rows[j].cells[4].childNodes[0].nodeValue;
      var ajustada = tabla.rows[j].cells[5].childNodes[0].nodeValue;  
      var Fecha = tabla.rows[j].cells[6].childNodes[0].nodeValue;  
      var Auditor = tabla.rows[j].cells[7].childNodes[0].nodeValue;  
      
      var Fila = [Clave,Planta,Descripcion,Ubicacion,Anterior,ajustada,Fecha,Auditor]
      sheet_1_data.push(Fila);
  } //fin filas

  var opts = [{
      sheetid: 'Hoja1',
      header: true
  }];
  var result = alasql('SELECT * INTO XLSX("His_Auditoria.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}