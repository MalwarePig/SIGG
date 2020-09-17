const Controller = {};
const express = require('express'); //guardar express en una variable de servidor


///////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////// == SALIDA == //////////////////// == SALIDA == ///////////////////// == SALIDA == ///////////////////////////////////////////////////////////////
Controller.searchPlanta = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {Planta} = req.params;
            conn.query("SELECT * FROM almacen WHERE Almacen = '" + Planta + "'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                console.log(Herramientas);
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Login.html');
    }
};







module.exports = Controller;