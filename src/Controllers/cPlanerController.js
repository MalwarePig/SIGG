const Controller = {};
const express = require('express');//guardar express en una variable de servidor


//llenado automatico por excel de Ordenes
Controller.saveCP = (req,res) => {
    const data = req.body;//TRAE TODO EL OBJETO
    var TablaCP = {
         Maquina : Object.values(data)[0],//obeter datos de un objeto
         Estatus : Object.values(data)[1],//obeter datos de un objeto
         OT : Object.values(data)[2],//obeter datos de un objeto
         Parte : Object.values(data)[3],//obeter datos de un objeto
         CantOt : Object.values(data)[4],//obeter datos de un objeto
         FechaInicio : Object.values(data)[5],//obeter datos de un objeto
         FechaVenc : Object.values(data)[6],//obeter datos de un objeto
         FechaProd : Object.values(data)[7],//obeter datos de un objeto
         Programa : Object.values(data)[8],//obeter datos de un objeto
         Herramienta : Object.values(data)[9],//obeter datos de un objeto
         Comentarios : Object.values(data)[10],//obeter datos de un objeto
    }
   
    req.getConnection((err,conn) => {
        conn.query('INSERT INTO controlplaner set ? ',[TablaCP],  (err, fields) =>{
            if(err){
                console.log(err);
            }
            console.log(fields);
            //res.redirect('/cPlaner');
        });
    })
    
  console.log(req.body);//se obtienen los datos del formulario a traves del req.body
    res.send('works');
}











module.exports = Controller;