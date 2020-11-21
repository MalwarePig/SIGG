function Contador() {
    //==============================    grupo de divs   =====================================================//
    var ArrayDivs = document.getElementById("Maquinas");    //Obtener Arreglo DivPadre
    var ObjetoMaquina = ArrayDivs.getElementsByTagName('*');    //Obtener nodos hijos div Padre

    var ArrayTUnoDivs = document.getElementById("TrabajadorUno"); //Obtener Arreglo DivPadre
    var ObjetoTrabajadorUno = ArrayTUnoDivs.getElementsByTagName('*'); //Obtener nodos hijos div Padre

    var ArrayTDosDivs = document.getElementById("TrabajadorDos"); //Obtener Arreglo DivPadre
    var ObjetoTrabajadorDos = ArrayTDosDivs.getElementsByTagName('*'); //Obtener nodos hijos div Padre

    // Obtner decendientes
    for (var i = 0; i < ObjetoMaquina.length; ++i) {

        var ValorMaquina = '-';
        var ValorTUno = '-';
        var ValorTDos = '-';

           ObjetoM = ObjetoMaquina[i];  //Obtner el nodo del arreglo
            ValorMaquina = ObjetoM.innerHTML;  //Obtener el valor del nodo

           ObjetoTU = ObjetoTrabajadorUno[i]; //Obtner el nodo del arreglo
           if(ObjetoTU == undefined){
                ValorTUno = '-';  //Obtener el valor del nodo 
           }else
           { 
                ValorTUno = ObjetoTU.innerHTML;  //Obtener el valor del nodo
           }

           ObjetoTD = ObjetoTrabajadorDos[i]; //Obtner el nodo del arreglo
           if(ObjetoTD == undefined){
                ValorTDos = '-';  //Obtener el valor del nodo 
           }else
           { 
                ValorTDos = ObjetoTD.innerHTML;  //Obtener el valor del nodo
           }

           //Crear Objeto para guardar
           var Tabla = {
               Maquina : ValorMaquina,
               TrabajadorUno : ValorTUno,
               TrabajadorDos : ValorTDos
           }
           console.log("Tabla: " + Tabla)

           //guardar objeto en BD

                        $.post("/postHorarios", // url
                        {Tabla}, // data to be submit
                                function(Tabla,status) {// success callback
                                //console.log(Tabla);
                        })
    }
}

