const Controller = {};
const express = require('express');//guardar express en una variable de servidor
const xlsxFile = require('read-excel-file/node');

Controller.list = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var Planta = parametros.split(' ')[0]; // categoria o tipo de reporte
            var Area = parametros.split(' ')[1]; // categoria o tipo de reporte
            console.log(Planta + " - " + Area);
            conn.query("SELECT * FROM " + Area + " WHERE Planta = '"+Planta+"' ORDER BY FechaInicio Asc", [], (err, Lineas) => {
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

Controller.FechasFlujo = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                OT
            } = req.params;
            conn.query("call FechasFlujo('" + OT + "')", true, (err, rows, fields) => {
                if (err) {
                    console.log('Error al asignar' + err);
                } else {
                    res.json(rows[0][0])
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.ExcelInterno = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            var ruta = '//192.168.2.191/Archivos Compartidos Servidor/RecursosSIGG/Data.xlsx'
            xlsxFile(ruta).then((rows) => {
                console.log(rows);
                console.table(rows);
               })
        });
    } else {
        res.render('Admin/Login.html');
    }
};

module.exports = Controller;