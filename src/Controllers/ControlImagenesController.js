const Controller = {};
const express = require('express'); //guardar express en una variable de servidor


Controller.SubirImgaenOT = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
             
        });
    } else {
        res.render('Admin/Login.html');
    }
};





module.exports = Controller;
