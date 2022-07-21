function carga(){//carga la funcion de carga de formulario
  Data_Maquinas = document.getElementById("MaquinasTabla");//carga datos de maquina desde tabla html
  Data_Empleados = document.getElementById("EmpleadosTabla");//carga datos de maquina desde tabla html
  var ArrayMaquinas = Cargar_list_Maquina();//cargo el arreglo

  for(var i = 0; i < Data_Maquinas.rows.length -1; i++){
   CrearForm(i, ArrayMaquinas[i]);
  }
//Agregar Botones a tabla despues de ser creada
  $(".FormWork").append(
   $("<input/>", {
   type: 'submit',
   class: "btn btn-primary",
   name: "enviar",
   value: 'Agregar'
   })
  )


};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// CARGAR LISTA DE MAQUINAS ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Cargar_list_Maquina(){
  //Obtener datos de tabla
  var total_Maquinas = Data_Maquinas.rows.length//Total de filas
  var arrayMachin = new Array(); 

  //CREAR ARRAY CON DATOS DE TABLA
  for(var i = 1; i < total_Maquinas; i++){
    arrayMachin[i-1] = Data_Maquinas.rows[i].cells[1].childNodes[0].nodeValue; //Obtiene el valor de nombre
  }
  return arrayMachin;
}

function CrearForm(i,ArrayMaquinas) {//crear formulario dinamicamente
$(".FormWork").append(
// Creating Form Div and Adding <h2> and <p> Paragraph Tag in it.
 //CREAR LOS ELEMENTOS DENTRO DEL FORM
 $("<div>", {
 'class': 'form-row'
 }).append(
   $("<div>", {
   'class': 'form-group col-md-1'
   }).append(
   // Create <form> Tag and Appending in HTML Div form1.
   $("<input/>", {
   type: 'text',
   id: 'maquina'+i,
   name: 'Maquina',
   placeholder: 'Maquina...',
   value: ArrayMaquinas,
   tabindex : '-1',
   readonly: 'readonly',
   class : 'form-control',
   })), // crea control de maquina dentro de un div
   $("<div>", {
   'class': 'form-group col-md-1'
   }),
   $("<div>", {
   'class': 'form-group col-md-1'
   }).append(
   $("<input/>", {
   type: 'text',
   id: 'turno'+i,
   name: 'Turno'+i,
   placeholder: 'Turno...',
   value: '8',
   tabindex : '-1',
   readonly: 'readonly',
   class : 'form-control'
   })), 
   $("<div>", {
   'class': 'form-group col-md-1'
   }).append(
   $("<input/>", {
   type: 'text',
   value: '-',
   id: 'empleadoA'+i,
   name: 'EmpleadoA'+i,
   placeholder: 'Empleado...',
   class : 'form-control',
   onchange : 'AddEmpleado("A",'+ i+')'
   })), 
   $("<div>", {
   'class': 'form-group col-md-2'
   }).append(
   $("<input/>", {
   type: 'text',
   value: '-',
   id: 'nombreA'+i,
   name: 'NombreA'+i,
   placeholder: 'Nombre...',
   tabindex : '-1',
   class : 'form-control'
   })),
   $("<div>", {
   'class': 'form-group col-md-1'
   }),
  //crea control de maquina dentro de un div
   $("<div>", {
   'class': 'form-group col-md-1'
   }).append(
   $("<input/>", {
   type: 'text',
   id: 'turnoB' +i,
   name: 'TurnoB'+i,
   placeholder: 'Turno...',
   value: '7.5',
   tabindex : '-1',
   readonly: 'readonly',
   class : 'form-control'
   })), 
   $("<div>", {
   'class': 'form-group col-md-1'
   }).append(
   $("<input/>", {
   type: 'text',
   value: '-',
   id: 'empleadoB'+i,
   name: 'EmpleadoB'+i,
   placeholder: 'Empleado...',
   class : 'form-control',
   onchange : 'AddEmpleado("B",'+i+')'
   })), 
   $("<div>", {
   'class': 'form-group col-md-2'
   }).append(
   $("<input/>", {
   type: 'text',
   value: '-',
   id: 'nombreB'+i,
   name: 'NombreB'+i,
   placeholder: 'Nombre...',
   tabindex : '-1',
   class : 'form-control'
   }))
 )//fiv form row
)//space work
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// CARGAR LISTA DE Empleados ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function AddEmpleado(Opcion,fila){
  //Obtener datos de tabla
  var total_Empleados = Data_Empleados.rows.length//Total de filas
  var nomina = document.getElementById("empleado"+Opcion+fila).value;
  //CREAR OBJ ARRAY CON DATOS DE TABLA
  for(var i = 1; i < total_Empleados; i++){//recorrer lista de empleados
    if(Data_Empleados.rows[i].cells[2].childNodes[0].nodeValue == nomina){//Coincidencia de nomina en la tabla a buscar
      var nombre = Data_Empleados.rows[i].cells[1].childNodes[0].nodeValue; //Obtiene el valor de Nombre
      console.log('Nombre del sujeto: ' + nombre);
      if(Opcion == 'A'){//si la opcion es de la fila A
        document.getElementById("nombreA"+fila).value = nombre;
        //document.FEmpleados.nombreA0.value = 30;
      }else{//si la opcion es de la fila B
        document.getElementById("nombreB"+fila).value = nombre;
      }
    }
  }
}






























/*
function Clonar(){
    // Get the last <li> element ("Milk") of <ul> with id="myList2"
    var itm = document.getElementById("FormHorario");

    // Copy the <li> element and its child nodes
    var cln = itm.cloneNode(true);

    // Append the cloned <li> element to <ul> with id="myList1"
    document.getElementById("SpaceWork").appendChild(cln); 
}


let nuevo = function() {
    $("<section/>").insertBefore("[name='enviar']")
                   .append($(".inputs").html())
                   .find("button")
                   .attr("onclick", "eliminar(this)")
                   .text("Eliminar");
  }
  
  let eliminar = function(obj) {
    $(obj).closest("section").remove();
  }

var form = $("<form/>",{ action:'/add' }
);
form.append( 
$("<input>", 
{ type:'text', 
placeholder:'Keywords', 
name:'keyword', 
style:'width:65%' }
)
);

form.append( 
$("<input>", 
{ type:'submit', 
value:'Search', 
style:'width:30%' }
)
);

$("#someDivId").append(form);

*/