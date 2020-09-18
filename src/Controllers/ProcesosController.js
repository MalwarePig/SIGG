const Controller = {};
const express = require('express'); //guardar express en una variable de servidor


///////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////// == SALIDA == //////////////////// == SALIDA == ///////////////////// == SALIDA == ///////////////////////////////////////////////////////////////
Controller.searchPlanta = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {Herramienta} = req.params;
            var Planta ="Almacen " + req.session.planta;
            console.log("PLanta; " + Planta + " " + Herramienta);
            conn.query("SELECT * FROM almacen WHERE Producto LIKE '%"+ Herramienta + "%' AND Almacen = '" + Planta + "'", (err, Herramientas) => {
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