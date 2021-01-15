const Controller = {};
const express = require('express'); //guardar express en una variable de servidor
const xlsxFile = require('read-excel-file/node');
var Obj_Flujo = require('../Functions/EntradaFlujo');

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
            conn.query("SELECT * FROM " + Area + " WHERE Planta = '" + Planta + "' AND Estatus != 'Cerrada' AND FechaInicio IS NOT NULL ORDER BY FechaInicio Asc", [], (err, Lineas) => {
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

Controller.AlimentarFlujo = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            var ruta = '//192.168.2.191/Archivos Compartidos Servidor/RecursosSIGG/Data.xlsx'
            xlsxFile(ruta).then((rows) => {
               Obj_Flujo.Impresion(rows);
            })
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.Pen_FlujoProd = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                OT
            } = req.params;
            var AreaOrigen = req.session.area;
            console.log(AreaOrigen);
            switch (AreaOrigen) {
                case "Producción":
                    AreaOrigen = "controlplaner";
                    break;
                case "Acabados":
                    AreaOrigen = "areaacabados";
                    break;
                case "Tratamientos":
                    AreaOrigen = "areatratamientos";
                    break;
                case "Calidad":
                    AreaOrigen = "areacalidad";
                    break;
                case "Embarques":
                    AreaOrigen = "areaembarques";
                    break;
                default:
                    AreaOrigen = "";
                    break;
            }

            conn.query("SELECT * FROM " + AreaOrigen + " WHERE FechaInicio is null", true, (err, rows) => {
                if (err) {
                    console.log('Error al cargar' + err);
                } else {
                    res.json(rows);
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


//Inicializa la OT con la fecha de inicio de la linea
Controller.IniciarProdFlujo = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {

            const data = req.body;
            console.table(Object.values(data)[0][0][0]);
            var limite = Object.values(data)[0].length;

            var AreaOrigen = req.session.area;
            console.log("IniciarProdFlujo:" + AreaOrigen);
            switch (AreaOrigen) {
                case "Producción":
                    AreaOrigen = "controlplaner";
                    break;
                case "Acabados":
                    AreaOrigen = "areaacabados";
                    break;
                case "Tratamientos":
                    AreaOrigen = "areatratamientos";
                    break;
                case "Calidad":
                    AreaOrigen = "areacalidad";
                    break;
                case "Embarques":
                    AreaOrigen = "areaembarques";
                    break;
                default:
                    AreaOrigen = "";
                    break;
            }

            console.log("Limite: " + limite);
            for (var i = 0; i < limite; i++) {
                console.log("id: " + Object.values(data)[0][i][0]);
                conn.query("UPDATE " + AreaOrigen + " SET FechaInicio = CURDATE() WHERE id = " + Object.values(data)[0][i][0], true, (err, rows) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    }
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

//Tranfiere la linea de un area a otra
Controller.TransFlujo = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body;

            var id = Object.values(data)[0].id;
            var OT = Object.values(data)[0].OT;
            var Parte = Object.values(data)[0].Parte;
            var cantidadDestino = Object.values(data)[0].cantidadDestino;
            var cantidadActual = Object.values(data)[0].cantidadActual;
            var Planta = Object.values(data)[0].Planta;
            var Inicio = Object.values(data)[0].Inicio;
            var Fin = Object.values(data)[0].Fin;
            var AreaDestino = Object.values(data)[0].AreaDestino;
            var Caso = Object.values(data)[0].Caso;

            var AreaOrigen = req.session.area;
            console.log(AreaOrigen);
            switch (AreaOrigen) {
                case "Producción":
                    AreaOrigen = "controlplaner";
                    break;
                case "Acabados":
                    AreaOrigen = "areaacabados";
                    break;
                case "Tratamientos":
                    AreaOrigen = "areatratamientos";
                    break;
                case "Calidad":
                    AreaOrigen = "areacalidad";
                    break;
                case "Embarques":
                    AreaOrigen = "areaembarques";
                    break;
                default:
                    AreaOrigen = "";
                    break;
            }

            console.log("Caso: " + Caso);
            if (Caso == 'Parcial') {
                console.log('Parcial************************');
                var TotalActual = cantidadActual - cantidadDestino;
                //Insert la linea en la nueva area
                conn.query("INSERT INTO " + AreaDestino + "(Estatus,OT,Parte,CantOT,FechaVenc,Planta,Origen)VALUES('Abierta','" + OT + "','" + Parte + "','" + cantidadDestino + "','" + Fin + "','" + Planta + "','" + AreaOrigen + "')", true, (err, rows) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    } else {
                        console.log("Tranferencia realizada");
                    }
                });
                conn.query("SELECT Enviadas FROM " + AreaOrigen + " WHERE id = " + id, true, (err, rows) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    } else {
                        conn.query("UPDATE " + AreaOrigen + " SET Enviadas = " + (parseInt(cantidadDestino) + parseInt(rows[0].Enviadas)) + " WHERE id = " + id, true, (err, rows) => {
                            if (err) {
                                console.log('Error al asignar' + err);
                            } else {
                                console.log("linea actualizada ");
                            }
                        });
                    }
                });

            } else if (Caso == 'Cerrado') {
                //Insert la linea en la nueva area
                conn.query("INSERT INTO " + AreaDestino + "(Estatus,OT,Parte,CantOT,FechaVenc,Planta,Origen)VALUES('Abierta','" + OT + "','" + Parte + "','" + cantidadDestino + "','" + Fin + "','" + Planta + "','" + AreaOrigen + "')", true, (err, rows) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    } else {
                        console.log("Tranferencia realizada");
                    }
                });
                conn.query("SELECT Enviadas FROM " + AreaOrigen + " WHERE id = " + id, true, (err, rows) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    } else {
                        conn.query("UPDATE " + AreaOrigen + " SET Enviadas = " + (parseInt(cantidadDestino) + parseInt(rows[0].Enviadas)) + ", Estatus = 'Cerrada' WHERE id = " + id, true, (err, rows) => {
                            if (err) {
                                console.log('Error al asignar' + err);
                            } else {
                                console.log("linea actualizada ");
                            }
                        });
                    }
                });
            }//if Caso cerrado
        });
    } else {
        res.render('Admin/Login.html');
    }
};


module.exports = Controller;