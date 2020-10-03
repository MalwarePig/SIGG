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


///////// == NotaCompras Save == ////////////////////////////// == NotaCompras Save == ////////////////////////////// == NotaCompras Save == ////////////////////////// == NotaCompras Save == //////////////////// 
Controller.NotaCompras = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Clave = Object.values(data)[0]; //obeter datos de un objeto Folio
            let Producto = Object.values(data)[1]; //obeter datos de un objeto Folio
            let Cantidad = Object.values(data)[2]; //obeter datos de un objeto Folio
            let OT = Object.values(data)[3]; //obeter datos de un objeto Folio
            let Comentarios = Object.values(data)[4]; //obeter datos de un objeto Folio
            let Empleado = req.session.nombre; //obeter datos de un objeto Folio
            let Planta = req.session.planta;
            let Estatus = 'Requerido';

            if (err) {
                console.log("Conexion: " + err);
            }
            console.log(Clave + " - " + Producto + " - " + Cantidad + " - " + OT + " - " + Comentarios + " - " + Empleado + " - " + Planta + " - " + Estatus);
            conn.query('INSERT INTO requisiciones(Clave, Producto, CantidadReq, OT, Comentarios, EmpleadoReq, Planta, Estatus)values(?,?,?,?,?,?,?,?)', [Clave, Producto, Cantidad, OT, Comentarios, Empleado, Planta, Estatus], (err, ot) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error al registrar despacho de herramienta');
                }
            });
        });
    } else {
        res.render('Login.html');
    }
};

module.exports = Controller;


