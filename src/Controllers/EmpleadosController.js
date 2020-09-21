const Controller = {};
const express = require('express');//guardar express en una variable de servidor

Controller.list = (req,res)=> {
    if(req.session.loggedin){
        //res.send('Metodo Get list');
        req.getConnection((err,conn) => {
            conn.query('SELECT * FROM empleados',(err, Empleados) =>{
                if(err){
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.render('Admin/Empleados.html', {
                    data: Empleados,
                });
            });
        });
    }else{
        res.send('Please login to view this page!');
    }
};


Controller.save = (req,res) => {
    const data = req.body;
    const nombre = req.body.Planta;
    //console.log("Mis datos: " + nombre+ data);
    req.getConnection((err,conn) => {

        conn.query('INSERT INTO empleados set ?',[data], (err, ot) =>{
            if(err){
                console.log("Error: " + err);
            }
            res.redirect('/Empleados');
        });
    })
}


Controller.delete = (req,res) => {
    const { id } = req.params;
    req.getConnection((err,conn) => {
        conn.query('DELETE FROM empleados WHERE id = ?',[id], (err, rows) =>{
            res.redirect('/Empleados');
        });
    })
};



module.exports = Controller;