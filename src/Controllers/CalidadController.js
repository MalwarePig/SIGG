const Controller = {};
var OP = require('../public/js/Funciones.js');
var fun = require('../Functions/ajusteFechas');
const express = require('express'); //guardar express en una variable de servidor
var pruebasql = require('../Functions/MySQL');


Controller.NuevaInspeccion = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Planta = "Almacen " + req.session.planta; //obeter datos de un objeto Planta
            let Usuario = req.session.nombre; //obeter datos de un objeto nombre

            let N_FechaRegistro = Object.values(data)[0].N_FechaRegistro;
            let N_Inspector = Object.values(data)[0].N_Inspector;
            let N_Tipo = Object.values(data)[0].N_Tipo;
            let N_OT = Object.values(data)[0].N_OT;
            let N_CantidadOT = Object.values(data)[0].N_CantidadOT;
            let N_Notas = Object.values(data)[0].N_Notas;


            conn.query("INSERT INTO Inspeccion(Inspector,Tipo,OT,CantidadOT,Notas)VALUES" +
                "('" + N_Inspector + "','" + N_Tipo + "','" + N_OT + "'," + N_CantidadOT + ",'" + N_Notas + "')", (err, Herramientas) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                    }
                    res.json(Herramientas);
                });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.CargarInspeccion = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {

            conn.query("SELECT * FROM Inspeccion WHERE FechaFin is null", (err, data) => {
                if (err) {
                    //res.json("Error json: " + err);
                    console.log('Error al registrar recepcion ' + err);
                } else {
                    console.table(data)
                    res.json(data)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



Controller.ActualizarOrden = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id
            var FechaFin = Object.values(data)[0].FechaFin; //obeter datos de un objeto Clave
            var Estado = Object.values(data)[0].Estado; //obeter datos de un objeto Producto
            var CantidadEstado = Object.values(data)[0].CantidadEstado; //obeter datos de un objeto Ubicacion
            var Notas = Object.values(data)[0].Notas; //obeter datos de un objeto Ubicacion

            console.log("id " + id + "','" + FechaFin + "','" + Estado + "','" + CantidadEstado);
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("UPDATE Inspeccion SET FechaFin = NOW(), Estado = '"+Estado+"',CantidadEstado = '"+CantidadEstado+"',Notas = '"+Notas+"'  WHERE id = "+id, (err, data) => {
                    if (err) {
                        //res.json("Error json: " + err);
                        console.log('Error al registrar recepcion ' + err);
                    } else {
                        res.json(data)
                    }
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};




Controller.EliminarOrdenInsp = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const data = req.body;
            var id = Object.values(data)[0].id;
            console.log(id + " - " + id)

            conn.query("DELETE FROM Inspeccion WHERE id = " + id, (err, data) => {
                if (err) {
                    //res.json("Error json: " + err);
                    console.log('Error al registrar recepcion ' + err);
                } else {
                    res.json(data)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.CargarInspectores = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            let Planta =  req.session.planta;
            conn.query("SELECT * FROM empleados WHERE Puesto = 'Inspector' AND Planta = '"+Planta+"'", (err, data) => {
                if (err) {
                    //res.json("Error json: " + err);
                    console.log('Error al registrar recepcion ' + err);
                } else {
                    console.table(data)
                    res.json(data)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};
 

Controller.ListaInspecciones = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var fechaInicio = parametros.split('|')[0]; // Fecha inicial
            var fechafin = parametros.split('|')[1]; // Fecha limite

            conn.query("SELECT * FROM Inspeccion WHERE FechaFin BETWEEN '" + fechaInicio + "' AND '" + fechafin + "'", (err, data) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                console.table(data)
                res.json(data)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};














module.exports = Controller;