const Controller = {};
const express = require('express');//guardar express en una variable de servidor
const fileupload = require('express-fileupload');

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





Controller.Subir = (req,res) => {
 
        const archivo = req.files.archivo;
        const fileName = archivo.name;
        const path = __dirname + '/../uploads/' + fileName;
    
        try {
          archivo.mv(path, (error) => {
            if (error) {
              console.error(error);
              res.writeHead(500, {
                'Content-Type': 'application/json'
              });
              res.end(JSON.stringify({ status: 'error', message: error }));
                return;
              }
              return res.status(200).send({ status: 'success', path:'/uploads/' + fileName });
           });
         } catch (e) {
           res.status(500).json({
             error: true,
             message: e.toString()
           });
         }
 
};






module.exports = Controller;