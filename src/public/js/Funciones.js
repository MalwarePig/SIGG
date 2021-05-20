var cnSQL = require('../../Functions/MySQL.js');

function ValorX(){
}


//RECREA EL CALCULO PARA LA FECHA FIN DE UNA ORDEN
var CalcularFechaFin = async function (NumPart, inicio, horas, Cantidad, Maquina,Estatus,FechaVenc,OT,Planta){
   /*=========================================================  VARIABLES  =======================================================================================*/
    var Termino = new Date();
    var Horas_Original = horas;
    var Cantidad_Original = Cantidad;
    var inicioParametro = new Date(inicio);
   /*=======================================================  CALCULAR HORAS  ====================================================================================*/
   cnSQL.cnn.query("SELECT Horas from historial WHERE EXISTS (SELECT NoParte FROM historial WHERE NoParte = '"+ NumPart +"' LIMIT 1) AND  NoParte = '"+ NumPart +"'", [], (err, consulta) => {//CONSULTA DE OT REFERENTE A LA ID [A]
    if(err){
        console.log("Consulta Error: " + err);
    }else if(Object.keys(consulta).length > 0){//si la consulta obtiene horas de algun registro en el historial      
       var Consul_horas =  Object.values(consulta[0]);
       console.log("Horas de consulta en if: " + Consul_horas);
       var HorasTrabajo = (Consul_horas * Cantidad);
       var ini = new Date(inicio);
       ini.setMinutes(ini.getMinutes() + ini.getTimezoneOffset());//SE AJUSTA FECHA Y HORA
       //===================================    CONSULTAR HISTORIAL DE ORDENES    =============================================//
       var HorasLaborales = 0;//variable para horas predeterminadas para una maquina
       cnSQL.cnn.query("SELECT * from maquinas WHERE Nombre = '" + Maquina + "'", [], (err, consulta) => {//CONSULTA DE OT REFERENTE A LA ID [A]
           if(err){
               console.log("Consulta Error: " + err);
           }
           //===================================    REGISTRAR ORDEN CON HORAS DESDE EL HISTORIAL    =============================================//
           else if(Object.keys(consulta).length > 0){
               HorasLaborales = consulta[0].Tiempo;//variable para horas predeterminadas para una maquina
               console.log("Si hay historial Horas laboroales: " + HorasLaborales + "  Horas de trabajo: " + HorasTrabajo + " con fecha de inciio: " + inicio);
               var FechaFin =  CalcularFecha(HorasLaborales,HorasTrabajo,inicio);
               console.log("Fecha Retornada: " + FechaFin);
           }
           console.log("Horas para historial 1: " + Consul_horas);
           var horas = Consul_horas;
           var tabla = {
               Maquina : Maquina,
               Estatus : Estatus,
               OT : OT,
               Parte : NumPart,
               CantOt : Cantidad,       
 
               FechaVenc :FechaVenc,
               FechaProd : FechaFin,
               Horas : horas,
               Planta: Planta
           };
      console.table(tabla)
           cnSQL.cnn.query('INSERT INTO ControlPlaner set ? ',[tabla],  (err, ot) =>{
               if(err){
                   console.log(err);
               }
           }); 
       });
       //================================================ REGISTO OT SIN HISTORIAL ====================================================================//
    }else if(Object.keys(consulta).length <= 0){//si no hay registro en el historial, crea registro nuevo en tabla historial
        var TablaCP = {
            NoParte : NumPart,
            Horas : Horas_Original
        }
        cnSQL.cnn.query('INSERT INTO historial set ? ',[TablaCP],  (err, ot) =>{
        if(err){
            console.log(err);
        }
        });
        cnSQL.cnn.query("SELECT * from maquinas WHERE Nombre = '" + Maquina + "'", [], (err, consulta) => {//CONSULTA DE OT REFERENTE A LA ID [A]
            if(err){
                console.log("Consulta Error: " + err);
            }
            //===================================    REGISTRAR ORDEN CON HORAS DESDE EL HISTORIAL    =============================================//
            else if(Object.keys(consulta).length > 0){
                HorasLaborales = consulta[0].Tiempo;//variable para horas predeterminadas para una maquina
                console.log("Horas para historial 2: " + Horas_Original);
        
        var horas = Horas_Original;
        HorasTrabajo = Horas_Original * Cantidad_Original;
        console.log("HRS: Laborales: " +HorasLaborales +" HorasTrabajo: " +HorasTrabajo+" inicio: " + inicio);
        var FechaFin =  CalcularFecha(HorasLaborales,HorasTrabajo,inicio);
        var tabla = {
            Maquina : Maquina,
            Estatus : Estatus,
            OT : OT,
            Parte : NumPart,
            CantOt : Cantidad,       
            FechaInicio : inicio,
            FechaVenc :FechaVenc,
            FechaProd : FechaFin,
            Horas : horas,
            Planta : Planta
        };
        console.table(tabla)
        cnSQL.cnn.query('INSERT INTO ControlPlaner set ? ',[tabla],  (err, ot) =>{
            if(err){
                console.log(err);
            }
        });
            }
        })
        
    }
    });
}
/*=============================================    Calcular Fecha    ==========================================================================
===============================================================================================================================================*/

function CalcularFecha(HorasLaborales,HorasTrabajo,inicio){
    var ini = new Date(inicio);
    console.log("Parametro de inicio: " + inicio + " horas Laborales: " + HorasLaborales + " HorasTabajo: " + HorasTrabajo);
    var semana = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
               var indice = 1;
               var dias = 0;
               var fhoras = 0;
               var DomingoPivote = new Date();
               if(HorasTrabajo > 0){
                while(indice > 0){//siclo para contar los dias y horas en base a horas laborales
                    if(HorasTrabajo >= HorasLaborales){
                        HorasTrabajo = HorasTrabajo - HorasLaborales;
                        dias++;
                        indice++;
                    }else if(HorasTrabajo < HorasLaborales){
                        fhoras = HorasTrabajo;
                        indice = 0;
                    }
                    console.log("indice: " + indice);
                }
               }
               console.log("Fecha inicio: " + inicio);
               DomingoPivote = new Date(ini.setHours(ini.getHours() +  (dias*24)));//calcula la fecha final para una OT
                   if(DomingoPivote.getUTCDay() == 0){//Se busca incrementar un dia si este dia se calcula en domingo
                       dias++;
                   }
               ini = new Date(inicio);
               console.log("Fecha ini: " + ini);
               ini.setMinutes(ini.getMinutes() + ini.getTimezoneOffset());//SE AJUSTA FECHA Y HORA
               var HorasRealesTrabjo = (dias*24) + fhoras;//horas reales a trabajar en base a la maquina, calculando el total en horas
               var FechaFin = new Date(ini.setHours(ini.getHours() + HorasRealesTrabjo));//calcula la fecha final para una OT
              
               console.log("Fecha funcion: " + FormtatoFechas(FechaFin));
               return FechaFin;
}






/*==========================================    FORMTATO DE FECHA    ==========================================================================
===============================================================================================================================================*/
function FormtatoFechas(fecha){
    var today = new Date(fecha); 
    var dd = today.getDate(); 
    var mm = today.getMonth() + 1; 
    var yyyy = today.getFullYear(); 
    var HH = today.getHours();
    var mi = today.getMinutes();

    if (dd < 10) { 
        dd = '0' + dd; 
    }
    if (mm < 10) { 
        mm = '0' + mm; 
    }
    var today =  yyyy+ '/' + mm + '/' + dd + " " + HH +':' + mi; 
    return today;
}
/*=============================================================================================================================================================
========================================================== OBSOLETO ===========================================================================================
===============================================================================================================================================================*/

async function consultarHistorial(NumPart,horas){//Consulta si existe registros de NoPartes para determinar el tiempo de cada pieza
     cnSQL.cnn.query("SELECT Horas from historial WHERE EXISTS (SELECT NoParte FROM historial WHERE NoParte = '"+ NumPart +"' LIMIT 1) AND  NoParte = '"+ NumPart +"'", [], (err, consulta) => {//CONSULTA DE OT REFERENTE A LA ID [A]
        if(err){
            console.log("Consulta Error: " + err);
        }
        /*====================================================  CALCULAR HORAS  =======================================================================================*/
        else if(Object.keys(consulta).length > 0){//si la consulta obtiene horas de algun registro en el historial      
            horas =  Object.values(consulta[0]);
            console.log("Horas de consulta en if: " + horas);

        }else if(Object.keys(consulta).length <= 0){//si no hay registro en el historial, crea registro nuevo en tabla historial
            var TablaCP = {
                NoParte : NumPart,
                Horas : horas
            }
            cnSQL.cnn.query('INSERT INTO historial set ? ',[TablaCP],  (err, ot) =>{
            if(err){
                console.log(err);
            }
            });
        }
    });
    console.log("Return: " + horas);
    return horas;
}




  
var Funciones = {
    CalcularFechaFin
};

module.exports.Funciones = Funciones;