var cnSQL = require('../Functions/MySQL');


var CompararHistorial = function (Excel) {
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Impresion = function (Excel) {
    cnSQL.cnn.query("Select OT from controlplaner WHERE Estatus != 'Cerrada'", [], (err, Historial) => { // UPDATE  A[B]
        if (err) {
            console.log('sin lectura: ' + err);
        } else {
            //console.log(Excel);
            var limite = Object.keys(Excel).length;
            var Arreglo = [];
            var coincidencia = false;
            for (var index = 1; index < limite; index++) {
                coincidencia = false;
                for (let H = 0; H < Historial.length; H++) {

                    if (Historial[H].OT == Excel[index][2]) {
                        coincidencia = true;
                        //console.log("Comparando historial: " + Historial[H].OT + " Excel: " + Excel[index][2] + " " + coincidencia);
                    }
                } //For historial

                //console.log('***************************');
                if (coincidencia == false && Excel[index][2] != null) {
                    //console.log("Sin historial: " + Excel[index][2]);
                    var Maquina = Excel[index][0];
                    var Estatus = Excel[index][1];
                    var OT = Excel[index][2];
                    var Parte = Excel[index][3];
                    var Cantidad = Excel[index][4];
                    var FechaVencimiento = Excel[index][5];
                    var Planta = Excel[index][14];
                    var x = [Maquina, Estatus, OT, Parte, Cantidad, FechaVencimiento, Planta];
                    Arreglo.push(x);
                }
            } //For Excel

            var newLimit = Arreglo.length;
            for (let index = 0; index < newLimit; index++) {
                var Maquina = Arreglo[index][0];
                var Estatus = Arreglo[index][1];
                var OT = Arreglo[index][2];
                var Parte = Arreglo[index][3];
                var CantOt = Arreglo[index][4];
                var m = new Date(Arreglo[index][5]);
                var FechaVenc = FormatoFechas(m);
                var Planta = Arreglo[index][6];

                //console.log(Maquina + " " + Estatus + " " + OT + " " + Parte + " " + CantOt + " " + FechaVenc);
                cnSQL.cnn.query("INSERT INTO controlplaner(Maquina,Estatus,OT,Parte,CantOt,FechaVenc,Planta,Recibido) VALUES ('" + Maquina + "','" + Estatus + "','" + OT + "','" + Parte + "','" + CantOt + "','" + FechaVenc + "','" + Planta + "'," + CantOt + ")", [], (err, dato) => {
                    if (err) {
                        console.log('error d: ' + err);
                    }
                });
            }
        }
    });
}


function FormatoFechas(fecha) {
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
    var today = yyyy + '-' + mm + '-' + dd;
    return today
}

module.exports = {
    Impresion,
    CompararHistorial
};