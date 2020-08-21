
function InicializarSelects(){
    var tablaCliente = document.getElementById("TablaClientes");
    var total = tablaCliente.rows.length//Total de filas


    let Cliente = [];
  for(j=1;j<=total-1;j++){//filas
            //var dato = tabla.rows[j].cells[h].childNodes[0].nodeValue;
            Cliente[j-1] = tablaCliente.rows[j].cells[1].childNodes[0].nodeValue;
            //alert(total);
            ///////////////////////// INSERTAR DATOS ///////////////////////var date_format = new Date(date_input).toDateString("yyyy-MM-dd");
            //TECNO FON NPRONMEOL
    }
    let sinRepetidos = Cliente.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);//FUNCION PARA ELIMINAR DUPLICADOS

        var x = document.getElementById("SelectCliente");
        for(var i = 0; i < sinRepetidos.length; i++){
            var option = document.createElement("option");
            option.text = sinRepetidos[i];
            x.add(option); 
        }
    
}

function Autocomplete(){  //<-- JQUERY CHOSEN -->
   // $(".chosen-select").chosen({ no_results_text: 'No hay resultados para ' });
  
}


