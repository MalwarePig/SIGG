var cnSQL = require('../Functions/MySQL');
/*
const mysql = require('mysql');
const myConnection = require('express-myconnection');
*/

var Reorganizar = function AjusteFechaOrdenes(id,formulario,pivote,maquina,numPart,FechaInicio,res){
    var consulta;
    
    //Actualizar registro pivote
    cnSQL.cnn.query('UPDATE ControlPlaner SET ? WHERE id = ?', [formulario, id], (err, ordenes) => {// UPDATE  A[B]
        if(err){
            console.log('sin actualizar: ' + err);
        }else{
            //console.log('se actualizo' + ordenes);
        }
    });

    //conn.query('SELECT * FROM ControlPlaner WHERE id = ?', [id], (err, ordenes) => {
    cnSQL.cnn.query("SELECT * FROM ControlPlaner WHERE Maquina = '"+ maquina + "' AND FechaInicio > '"+FechaInicio +"' AND Parte != '" + numPart + "'", [], (err, rows) => {//consulta OT siguienes a pivote [C]
        if(err){
        console.log("No funciona sql: " + err);
        }
        consulta = rows;
        RecorrerOrdenes(id,formulario,pivote,consulta,maquina,numPart,FechaInicio,res);
    });
}//Fin de función Reorganizar

function RecorrerOrdenes(id,formulario,pivote,consulta,maquina,numPart,FechaInicio,res){

    //Comparar fechas entre Pivote y formulario
    var ini_Pivote;// = new Date(pivote[0].FechaInicio);
    var ini_Form = new Date(formulario.FechaInicio);

    ini_Pivote;//.setMinutes(ini_Pivote.getMinutes() + ini_Pivote.getTimezoneOffset());//SE AJUSTA FECHA Y HORA
    ini_Form.setMinutes(ini_Form.getMinutes() + ini_Form.getTimezoneOffset());//SE AJUSTA FECHA Y HORA

    //console.log(ini_Pivote + "      ------------         " + ini_Form);
    //if(ini_Form >= ini_Pivote){
         //Actualizar ordenes siguintes a pivote
         var limite_C = consulta.length;//limite de objetos para consultas OT siguientes [C]
         //SETEAR FECHAS DE FORMULARIO
         var fecha_pivote = new Date(formulario.FechaProd);//SE SETEA FECHA DE FORMULARIO
         fecha_pivote.setMinutes(fecha_pivote.getMinutes() + fecha_pivote.getTimezoneOffset());//SE AJUSTA FECHA Y HORA
         //console.log('Fecha final: ' + fecha_pivote + " tipo: " + typeof(fecha_pivote));
         for(var i=0;i<limite_C;i++){
             if(consulta[i].Parte != formulario.numPart){
                if(i==0){
                    var id_c = consulta[i].id;
                    var dias_Diferncia = milliToDays((consulta[i].FechaProd - consulta[i].FechaInicio));//dias de diferencia entre fechas [DIAS DE TRABAJO]
                    var newFechaProd = new Date(CalcularFin(formulario.FechaProd, dias_Diferncia));
                    newFechaProd.setMinutes(newFechaProd.getMinutes() + newFechaProd.getTimezoneOffset());//SE AJUSTA FECHA Y HORA
                    var tabla = {
                        Maquina : consulta[i].Maquina,
                        OT      : consulta[i].OT,
                        Parte   : consulta[i].Parte,
                        CantOt  : consulta[i].CantOt,
                        FechaInicio : formulario.FechaProd,
                        FechaVenc   : consulta[i].FechaVenc,
                        FechaProd   : newFechaProd
                    };

                    cnSQL.cnn.query('UPDATE ControlPlaner SET ? WHERE id = ?', [tabla, id_c], (err, ordenes) => {// UPDATE  A[B]
                        if(err){
                            console.log('sin actualizar: ' + err);
                        }else{
                            //console.log('se actualizo' + ordenes[0]);
                        }
                    });
                    var new_Inicio = newFechaProd;
                }else{
                    var id_c = consulta[i].id;
                    var dias_Diferncia = milliToDays((consulta[i].FechaProd - consulta[i].FechaInicio));//dias de diferencia entre fechas [DIAS DE TRABAJO]
                    var newFechaProd = new Date(CalcularFin(new_Inicio, dias_Diferncia));
                    newFechaProd.setMinutes(newFechaProd.getMinutes() + newFechaProd.getTimezoneOffset());//SE AJUSTA FECHA Y HORA
                    var tabla = {
                        Maquina : consulta[i].Maquina,
                        OT      : consulta[i].OT,
                        Parte   : consulta[i].Parte,
                        CantOt  : consulta[i].CantOt,
                        FechaInicio : new_Inicio,
                        FechaVenc   : consulta[i].FechaVenc,
                        FechaProd   : newFechaProd
                    };
                    //console.log("OT: " + consulta[i].OT + " NParte: " + consulta[i].Parte );
                    cnSQL.cnn.query('UPDATE ControlPlaner SET ? WHERE id = ?', [tabla, id_c], (err, ordenes) => {// UPDATE  A[B]
                        if(err){
                            console.log('sin actualizar: ' + err);
                        }else{
                            //console.log('se actualizo' + ordenes[0]);
                        }
                    });
                    new_Inicio = newFechaProd;
                }   
             }//if comparador de numero de parte
        }//Fin de for
    //se reedireccionara al finalizar la actualizacion del resto de ordenes, esperando 3 segundos para reedireccionar
        setTimeout(function reedireccion(){
            res.redirect('/Maquinas');
        },3000);
        //(res,freno);
}//if principal




  
     

/*
////////////////////// - [B-A-C] - /////////////////////////
var prueba = function AjusteFecha(id,formulario,pivote, consulta){
    //SETEAR FECHAS DE FORMULARIO
    var FechaInicio_Formulario = new Date(formulario.FechaInicio);//SE SETEA FECHA DE FORMULARIO
    FechaInicio_Formulario.setMinutes(FechaInicio_Formulario.getMinutes() + FechaInicio_Formulario.getTimezoneOffset());//SE AJUSTA FECHA Y HORA
    var FechaFin_Formulario = new Date(formulario.FechaProd);//SE SETEA FECHA DE FORMULARIO
    FechaFin_Formulario.setMinutes(FechaFin_Formulario.getMinutes() + FechaFin_Formulario.getTimezoneOffset());//SE AJUSTA FECHA Y HORA
    var form_Diferncia = milliToDays((FechaFin_Formulario-FechaInicio_Formulario));//dias de diferencia entre fechas [DIAS DE TRABAJO]

    //SETEAR FECHAS DE PIVOTE DB
    var FechaInicio_pivote = new Date(pivote[0].FechaInicio);
    var FechaFin_pivote = new Date(pivote[0].FechaProd);
    var pivote_Diferncia = milliToDays((FechaFin_pivote-FechaInicio_pivote));//dias de diferencia entre fechas [DIAS DE TRABAJO]

    //SETEAR FECHAS DE PIVOTE DB
    var limite_C = consulta.length;//limite de objetos para consultas OT siguientes [C]
    var objeto;
    if(pivote_Diferncia != form_Diferncia){//si la diferencia entre las fechas es diferente...
        //Actualizar registro pivote
        cnSQL.cnn.query('UPDATE ControlPlaner SET ? WHERE id = ?', [formulario, id], (err, ordenes) => {// UPDATE  A[B]
            if(err){
                console.log('sin actualizar: ' + err);
            }else{
                console.log('se actualizo' + ordenes);
            }
        });
        console.log("Esta es la consulta: "  + consulta[0]);
    }
    //prueba2();
    console.log('Total Dias pivote: ' + pivote_Diferncia + ' Total Dias formulario: ' + form_Diferncia + ' id: ' + id + ' Inicio Formulario: ' + FormtatoFechas(FechaInicio_Formulario) + ' Formulario Fin: '+ FormtatoFechas(FechaFin_Formulario) + ' FechaInicio pivote: ' + FormtatoFechas(FechaInicio_pivote) + ' Fin pivote: ' + FormtatoFechas(FechaFin_pivote));
    //console.log('Esta es la consulta: ' + Object.keys[cnSQL.cnn2[0]] + ' Finaliza la consulta');
}
*/
//Calcula la fecha de terminado segun dias agregados o restados 
function CalcularFin(inicio, dias ){
    var d  = Number(dias);
    var newdate = new Date(inicio);
    newdate.setMinutes(newdate.getMinutes() + newdate.getTimezoneOffset());//SE AJUSTA FECHA Y HORA
    newdate.setDate((Number(newdate.getDate()) + d));
    console.log("Fecha Fin: " + newdate);
    return FormtatoFechas(newdate);
}

function daysToMilliseconds(days) {
    return millis * 24 * 60 * 60 * 1000;
}

function milliToDays(millisec){
    var day = (millisec / (1000 * 60 * 60 * 24));
    if(day<0){
        console.log("" + Math.abs(day) );
    }
    return day;
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
    var today =  yyyy+ '-' + mm + '-' + dd; 
    return today;
  }
  

/*
function prueba2(){
    cnSQL.cnn.query("SELECT * FROM ControlPlaner", [], (err, consulta) => {//CONSULTA DE OT REFERENTE A LA ID [A]
        if(err){
            console.log('Error: ' + err);
        }
        console.log('Consulta propia: ' + consulta[0].OT);
    });
    //cnSQL.cnn.end();
}


*/

/*var prueba = function prueba(formulario,pivote, consulta){
    var FechaFin_Formulario = new Date(FormtatoFechas(formulario.FechaProd));
    var limite = consulta.length;
    var objeto;

console.log(pivote);
    if(i == 0){
        for(var i = 0; i < limite; i++){
            objeto = consulta[i];//crea un objeto del arreglo de objetos por la consulta
            var id = FormtatoFechas(objeto["id"]);
            var ot = objeto["OT"];
            var FechaInicio = new Date(FormtatoFechas(objeto["FechaInicio"]));
            var FechaProd = FormtatoFechas(objeto["FechaProd"]);
            var diasDif = milliToDays((FechaFin_Formulario-FechaInicio));

            //console.log("OT: " + ot + " FechaFin_Formulario: " + FechaFin_Formulario + "  FechaInicio:  " + FechaInicio + " dias de diferencia " + (FechaInicio - FechaFin_Formulario));
        }
    }else{


    }
}*/

/*
console.log("parte: "+parte+  " Consulta:  " + date_Consulta + " Formulario: " + date_Formulario);
if(date_Consulta< date_Formulario){
    console.log('tiempo vencido');
}
console.log("Mis consultas: " + objeto["OT"]);

console.log("Mis datos: " + tabla["ot"]); */



















/*
var Funciones = {
    prueba
};*/


module.exports.Funciones = Reorganizar;






