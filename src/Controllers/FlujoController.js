const Controller = {};
const express = require('express');//guardar express en una variable de servidor


Controller.list = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var Planta = parametros.split(' ')[0]; // categoria o tipo de reporte
            var Area = parametros.split(' ')[1]; // categoria o tipo de reporte

            conn.query("SELECT * FROM controlplaner WHERE Planta = '"+Planta+"' AND Fisico = '"+Area+"' ORDER BY FechaInicio Asc", [], (err, Lineas) => {
            if (err) {
                    console.log('Error al registrar despacho de herramienta' + err);
                }
                res.json(Lineas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

module.exports = Controller;