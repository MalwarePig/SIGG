const Controller = {};
const express = require('express'); //guardar express en una variable de servidor

///////// == Pronostico Show == ////////////////////////////// == Pronostico Show == ////////////////////////////// == Pronostico Show == ////////////////////////// == Pronostico Show == //////////////////// 

Controller.list = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            conn.query('SELECT pronostico.id,pronostico.Clave, pronostico.Producto, pronostico.Cantidad, almacen.Stock, pronostico.OT, pronostico.Comentarios, pronostico.Planta, pronostico.EmpleadoReq, pronostico.FechaReq, pronostico.Estatus FROM pronostico' +
                ' INNER JOIN almacen ON pronostico.Producto = almacen.Producto', [], (err, Pronostico) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error al registrar despacho de herramienta');
                    }
                    res.render('Compras/Pronosticos.html', {
                        data: Pronostico
                    });
                });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


///////// == Resumen == ////////////////////////////// == Resumen == ////////////////////////////// == Resumen == ////////////////////////// == Resumen == //////////////////// == Resumen == ///////////////////// == Resumen 
Controller.Resumen = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {Herramienta} = req.params;
            var Planta = "Almacen " + req.session.planta;
            conn.query("SELECT pronostico.id,pronostico.Clave, pronostico.Producto, pronostico.Cantidad, almacen.Stock, pronostico.OT, pronostico.Comentarios, pronostico.Planta, pronostico.EmpleadoReq, pronostico.FechaReq, pronostico.Estatus FROM pronostico" +
            " INNER JOIN almacen ON pronostico.Producto = '" +Herramienta+ "' AND almacen.Producto = '"+Herramienta+"'", [], (err, Pronostico) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Pronostico)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



module.exports = Controller;