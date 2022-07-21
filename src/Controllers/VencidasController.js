const Controller = {};
var OP = require('../public/js/Funciones.js');
const express = require('express');//guardar express en una variable de servidor

Controller.listVencidas = (req,res)=> {
    if(req.session.loggedin){//se verifica si el usuario esta logueado
        //res.send('Metodo Get list');
        req.getConnection((err,conn) => {
            conn.query('SELECT * FROM controlplaner',(err, ot) =>{
                if(err){
                    res.json(err);
                    console.log('Error de lectura');
                }
                console.log('lectura OT' + ot);
                res.render('Vencidas.html', {
                    data: ot
                });
            });
        });
    }else{
        res.send('Please login to view this page!');
    }
};




module.exports = Controller;