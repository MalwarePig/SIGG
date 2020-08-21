var cnSQL = require('../Functions/MySQL');

var actulizacion = function ActualizarHorarios(data){
    //console.log("Data: " + Object.values(data).length[0]);
    var arreglo = new Array(100);
    //var Obj = new Object();
    var M = false;
    var i = 0;
    var j = 0;
    var a = 0;
while(j<20){
        if(j == 0 || j % 7 == 0){
            arreglo[j] = Object.values(data)[j][i];
            i++
        }else if(j % 6 == 0){
        var Maquina = arreglo[0];
        var Horas = arreglo[1];
        var Nomina = arreglo[2];
        var Nombre = arreglo[3];
        var Horas_B = arreglo[4];
        var Nomina_B = arreglo[5];
        var Nombre_B = arreglo[6];
            arreglo.length = 0;
            console.log("primer turno: Maquina: " + Maquina +  " Horas: " + Horas + " Nomina: " + Nomina +  " Nombre: " + Nombre )  
            console.log("Segundo turno: Maquina: " + Maquina + " Horas_b: " + Horas_B + " Nomina_b: " + Nomina_B +  " Nombre_b: " + Nombre_B);
        }else{
            arreglo[j] = Object.values(data)[j];
            M = false;
        }
    j++;
}
/*
    for(var i = 0;i < 5; i++){
        M = true;
        for(var j = 0;j <= 100; j++){
            if(M == true){
                arreglo[j] = Object.values(data)[j][i];
                M = false;
            }else{
                arreglo[j] = Object.values(data)[j];
                M = false;
            }
        }
            var Maquina = arreglo[0];
            var Horas = arreglo[1];
            var Nomina = arreglo[2];
            var Nombre = arreglo[3];
            var Horas_B = arreglo[4];
            var Nomina_B = arreglo[5];
            var Nombre_B = arreglo[6];
        arreglo.length = 0;
        console.log("primer turno: Maquina: " + Maquina +  " Horas: " + Horas + " Nomina: " + Nomina +  " Nombre: " + Nombre )  
        console.log("Segundo turno: Maquina: " + Maquina + " + Horas_b: " + Horas_B + " Nomina_b: " + Nomina_B +  " Nombre_b: " + Nombre_B);
    }*/
}

module.exports.Funciones = actulizacion;