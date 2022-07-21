const Controller = {};
var OP = require('../public/js/Funciones.js');
var fun = require('../Functions/ajusteFechas');
const express = require('express'); //guardar express en una variable de servidor
var pruebasql = require('../Functions/MySQL');

Controller.NuevaInspeccion = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Planta = req.session.planta; //obeter datos de un objeto Planta
            let Usuario = req.session.nombre; //obeter datos de un objeto nombre

            let N_FechaRegistro = Object.values(data)[0].N_FechaRegistro;
            let N_Tipo = Object.values(data)[0].N_Tipo;
            let N_OT = Object.values(data)[0].N_OT;
            let N_CantidadOT = Object.values(data)[0].N_CantidadOT;
            let N_Notas = Object.values(data)[0].N_Notas;
            let N_Operador = Object.values(data)[0].N_Operador;
            let N_Serie = Object.values(data)[0].N_Serie;
            let N_Parte = Object.values(data)[0].N_Parte;
            let N_Familia = Object.values(data)[0].N_Familia;
            let N_Maquina = Object.values(data)[0].N_Maquina;


            conn.query("INSERT INTO Inspeccion(Tipo,OT,CantidadOT,Notas,Operador,Serie,Parte,Familia,Maquina,Planta)VALUES" +
                "('" + N_Tipo + "','" + N_OT + "'," + N_CantidadOT + ",'" + N_Notas + "','"+N_Operador+"','"+N_Serie+"','"+N_Parte+"','"+N_Familia+"','"+N_Maquina+"','"+Planta+"')", (err, Herramientas) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                        res.json(false);
                    }else{
                          console.log('Listo' )
                        res.json(true);
                    }
                   
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
            let Planta = req.session.planta; //obeter datos de un objeto Planta
            conn.query("SELECT * FROM Inspeccion WHERE Planta = '"+Planta+"' AND FechaFin is null", (err, data) => {
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


Controller.ActualizarOrden = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id
            var N_Inspector = Object.values(data)[0].N_Inspector; //obeter datos de un objeto Clave
            var CantidadConforme = Object.values(data)[0].CantidadConforme; //obeter datos de un objeto Producto
            var CantidadNoConforme = Object.values(data)[0].CantidadNoConforme; //obeter datos de un objeto Producto
            var CantidadRetrabajo = Object.values(data)[0].CantidadRetrabajo; //obeter datos de un objeto Producto
            var CantidadAjuste = Object.values(data)[0].CantidadAjuste; //obeter datos de un objeto Producto
            var Notas = Object.values(data)[0].Notas; //obeter datos de un objeto Ubicacion
 
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("UPDATE Inspeccion SET FechaFin = NOW(), Inspector = '"+N_Inspector+"', CantidadConforme = "+CantidadConforme+", CantidadNoConforme = "+CantidadNoConforme+", CantidadRetrabajo= "+CantidadRetrabajo+", CantidadAjuste= " +CantidadAjuste + ", Notas = '"+Notas+"'  WHERE id = "+id, (err, data) => {
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

 
Controller.InfoOT = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;

            console.log(variable)
            conn.query("SELECT * FROM controlplaner WHERE OT = '"+variable+"'", (err, data) => {
                if (err) {
                    console.log('Error de lectura');
                }
                console.table(data)
                res.json(data)
               // res.json(Maquinas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.ListarPersonal = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;
            var AreaOrigen = req.session.area;
            console.log("Planta: " + variable)

            conn.query("SELECT * FROM empleados WHERE Nombre LIKE '%" + variable + "%' OR Nomina LIKE '%" + variable + "%'", true, (err, rows) => {
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



Controller.ActivarInspector = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;

            console.log(variable)
            conn.query("UPDATE empleados SET Puesto = 'Inspector' WHERE Nomina = '"+variable+"'", (err, data) => {
                if (err) {
                    console.log('Error de lectura');
                }
                console.table(data)
                res.json(data)
               // res.json(Maquinas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.EliminarInspector = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;

            console.log(variable)
            conn.query("UPDATE empleados SET Puesto = '-' WHERE Nomina = '"+variable+"'", (err, data) => {
                if (err) {
                    console.log('Error de lectura');
                }
                console.table(data)
                res.json(data)
               // res.json(Maquinas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

module.exports = Controller;


