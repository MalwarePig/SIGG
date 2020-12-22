const Controller = {};
const express = require('express');//guardar express en una variable de servidor


Controller.list = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            conn.query("SELECT * FROM almacen", [], (err, Pronostico) => {
                    if (err) {
                        console.log('Error al registrar despacho de herramienta' + err);
                    }
                    res.json(Pronostico)
                });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


module.exports = Controller;