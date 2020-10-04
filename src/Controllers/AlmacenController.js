const Controller = {};
var OP = require('../public/js/Funciones.js');
var fun = require('../Functions/ajusteFechas');
const express = require('express'); //guardar express en una variable de servidor
var pruebasql = require('../Functions/MySQL');


///////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////// == SALIDA == //////////////////// == SALIDA == ///////////////////// == SALIDA == ///////////////////////////////////////////////////////////////
Controller.search = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Herra
            } = req.params;
            conn.query("SELECT * FROM almacen WHERE producto LIKE '%" + Herra + "%'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Login.html');
    }
};

Controller.list = (req, res) => {
    if (req.session.loggedin) {
        const planta = req.session.planta;
        const Turno = req.session.turno;
        var FechaActual = new Date();
 

        //.log(FechaFinal.getDay());
        //console.log("inicial: " + FechaInicial.toISOString().slice(0,10) + " Final: " +FechaFinal.toISOString().slice(0,10));
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            conn.query("SELECT * FROM EstadoAuditoria where Almacen = '" + planta + "' AND Turno = '" + Turno + "'", (err, Estado) => { //Obtiene el estado de auditoria del turno actual
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                if (Estado[0].Estado == "0") {//Si no se ha realizado la auditoria debe entrar
                    if (Turno == "Dia") {
                        if (FechaActual.getDay() == 1) {//Si es lunes
                            var FechaFinal = new Date();
                            var FechaInicial = new Date();
                            FechaInicial.setDate(FechaInicial.getDate() - 2);
                            conn.query("SELECT * FROM itemprestado where Almacen = '" + planta + "' AND Turno != '" + Turno + "' AND Salida  BETWEEN  '" + FechaInicial + "' AND  '" + FechaFinal.toISOString().slice(0, 10) + "'", (err, Herramientas) => {
                                if (err) {
                                    res.json("Error json: " + err);
                                    console.log('Error de lectura');
                                }
                                //console.log(Herramientas);
                                res.render('Almacen/PreAuditoria.html', {
                                    data: Herramientas
                                });
                            });
                        } else {//Si no es lunes
                            var FechaFinal = new Date();
                            var FechaInicial = new Date();
                            FechaInicial.setDate(FechaInicial.getDate() - 1);
                            conn.query("SELECT * FROM itemprestado where Almacen = '" + planta + "' AND Turno != '" + Turno + "' AND Salida  >= '" + FechaFinal.toISOString().slice(0, 10) + "'", (err, Herramientas) => {
                                if (err) {
                                    res.json("Error json: " + err);
                                    console.log('Error de lectura');
                                }
                                //console.log(Herramientas);
                                res.render('Almacen/PreAuditoria.html', {
                                    data: Herramientas
                                });
                            });
                        }
                    }else{//Si no es de dia
                        var FechaFinal = new Date();
                        conn.query("SELECT * FROM itemprestado where Almacen = '" + planta + "' AND Turno != '" + Turno + "' AND Salida  >= '" + FechaFinal.toISOString().slice(0, 10) + "'", (err, Herramientas) => {
                            if (err) {
                                res.json("Error json: " + err);
                                console.log('Error de lectura');
                            }
                            //console.log(Herramientas);
                            res.render('Almacen/PreAuditoria.html', {
                                data: Herramientas
                            });
                        });
                    }

                } else {
                    res.render('Almacen/wh_Salidas.html');
                }
            });
        });
    } else {
        res.render('Login.html');
    }
}; //Falta lanzar el modal

Controller.Folio = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            conn.query("SELECT Count(distinct(Folio)) as Total FROM folioalmacen", (err, Folio) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Folio);
            });
        });
    } else {
        res.render('Login.html');
    }
};

Controller.Num_Nomina = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            conn.query("SELECT * from empleados", (err, empleados) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(empleados);
            });
        });
    } else {
        res.render('Login.html');
    }
};

Controller.Maquinas = (req, res) => {
    if (req.session.loggedin) {
        const {
            familia
        } = req.params;
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            conn.query("SELECT * from maquinas where Familia ='" + familia + "'", (err, maquinas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(maquinas);
            });
        });
    } else {
        res.render('Login.html');
    }
};

Controller.GuardarNota = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Folio = Object.values(data)[0]; //obeter datos de un objeto Folio
            let Producto = Object.values(data)[1]; //obeter datos de un objeto Producto
            let Entregado = Object.values(data)[2]; //obeter datos de un objeto Entregado
            let Estado = Object.values(data)[3]; //obeter datos de un objeto Estado
            let OT = Object.values(data)[4]; //obeter datos de un objeto OT
            let OTEstatus = Object.values(data)[5]; //obeter datos de un objeto OT
            let Maquina = Object.values(data)[6]; //obeter datos de un objeto Maquina
            let Empleado = Object.values(data)[7]; //obeter datos de un objeto Empleado
            let Turno = Object.values(data)[8]; //obeter datos de un objeto Empleado
            let Comentario = Object.values(data)[9]; //obeter datos de un objeto Comentario
            let Movimiento = 'Salida';
            let Planta = req.session.planta;
            let Usuario = req.session.username;
            //console.log(Folio + " - " + Producto + " - " +  Entregado + " - " +  Estado + " - " +  OT + " - " +  OTEstatus + " - " +  Maquina + " - " +  Empleado + " - " +  Turno + " - " +  Comentario + " - " +  Movimiento + " - " +  Planta + " - " +  Usuario)
            if (err) {
                console.log("Conexion: " + err)
            }
            conn.query('INSERT INTO itemprestado(Folio, Producto, Entregado, Estado, OT,OTEstatus, Maquina, Empleado, Turno, Comentarios, Movimiento, Almacen, Usuario)values(?,?,?,?,?,?,?,?,?,?,?,?,?)', [Folio, Producto, Entregado, Estado, OT, OTEstatus, Maquina, Empleado, Turno, Comentario, Movimiento, Planta, Usuario], (err, ot) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error al registrar despacho de herramienta');
                }
                conn.query("call RestarAlmacen(" + Entregado + ",'" + Producto + "','" + Estado + "');", true, (err, rows, fields) => {
                    if (err) {
                        res.json(err);
                        console.log('Error al descontar almacen' + err);
                    }
                    console.log("RestoAlmacen: " + rows);
                    conn.query("call IncrementarFolioAlmacen('" + Folio + "');", true, (err, rows, fields) => {
                        if (err) {
                            res.json(err);
                            console.log('Error al registrar folios' + err);
                        }
                    });
                });
            });
        });
    } else {
        res.render('Login.html');
    }
};


Controller.SavePreAudit = (req, res) => { //Guarda la auditoria diaria de cada almacen
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Producto = Object.values(data)[0]; //obeter datos de un objeto Folio
            let Cantidad = Object.values(data)[1]; //obeter datos de un objeto Folio

            let Planta = req.session.planta;
            let Usuario = req.session.nombre;
            let FechaReq = new Date();
            if (err) {
                console.log("Conexion: " + err)
            }
            conn.query('INSERT INTO RegistrosFaltantes(id,Producto, Cantidad, Auditor,Almacen,FechaReq)values(?,?,?,?,?,?)', [0, Producto, Cantidad, Usuario, Planta, FechaReq], (err, ot) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error al registrar auditoria' + err);
                }
            });
        });
    } else {
        res.render('Login.html');
    }
};

Controller.UpdatePreAudit = (req, res) => { //Guarda la auditoria diaria de cada almacen
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            const Usuario = req.session.nombre;
            const planta = req.session.planta;
            const Turno = req.session.turno;
            let FechaReq = new Date();
            /**id   Turno  Estado  Planta
             *  1	Dia  	  0	    Morelos
                2	Tarde	  0	    Morelos
                3	Tarde	  0	    Bravo
                4	Dia	      0	    Bravo
             */
            if (err) {
                console.log("Conexion: " + err)
            }
            conn.query("call CambiarEstadoAuditoria('" + Turno + "','" + planta + "');", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al registrar folios' + err);
                } else {
                    console.log('Se cambio de estado');
                    res.render('Almacen/wh_Salidas.html');
                }
            });
        });
    } else {
        res.render('Login.html');
    }
};

//============================================================================================================================================================================================================================================
///////// == RETORNO == ////////////////////////////// == RETORNO == ////////////////////////////// == RETORNO == ////////////////////////// == RETORNO == //////////////////// == RETORNO == ///////////////////// == RETORNO == ////////////
//============================================================================================================================================================================================================================================

Controller.listRetorno = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            //Acceder formulario Registrar usuario
            res.render('Almacen/wh_Retorno.html');
        });
    } else {
        res.render('Login.html');
    }
};

Controller.searchRetorno = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Maquina
            } = req.params;

            conn.query("select * from itemprestado WHERE Maquina = '" + Maquina + "' AND Devuelto < Entregado", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Login.html');
    }
};

Controller.FolioRetorno = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            conn.query("SELECT Count(distinct(Folio)) as Total FROM folioalmacenRetorno", (err, Folio) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Folio);
            });
        });
    } else {
        res.render('Login.html');
    }
};

Controller.GuardarNotaRetorno = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Folio = Object.values(data)[0]; //obeter datos de un objeto Folio
            let Producto = Object.values(data)[1]; //obeter datos de un objeto Folio
            let Cantidad = Object.values(data)[2]; //obeter datos de un objeto Folio
            let Estado = Object.values(data)[3]; //obeter datos de un objeto Folio
            let OT = Object.values(data)[4]; //obeter datos de un objeto Folio
            let Empleado = Object.values(data)[5]; //obeter datos de un objeto Folio
            let Turno = Object.values(data)[6]; //obeter datos de un objeto Folio
            let Maquina = Object.values(data)[7]; //obeter datos de un objeto Folio
            let Comentarios = Object.values(data)[8]; //obeter datos de un objeto Folio
            let Movimiento = 'Retorno';
            let Planta = req.session.planta;
            let Usuario = req.session.username;
            if (err) {
                console.log("Conexion: " + err)
            }
            //console.log(Folio + " - " + Producto + " - " + Cantidad + " - " + Estado + " - " + OT + " - " + Maquina + " - " + Empleado + " - " + Turno + " - " + Comentarios + " - " + Movimiento + " - " + Planta + " - " + Usuario)
            conn.query('INSERT INTO itemretorno(Folio,Producto,Cantidad,Estado,OT,Empleado,Turno,Maquina,Comentarios,Movimiento,Usuario,Almacen)values(?,?,?,?,?,?,?,?,?,?,?,?)', [Folio, Producto, Cantidad, Estado, OT, Empleado, Turno, Maquina, Comentarios, Movimiento, Usuario, Planta], (err, ot) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error al registrar despacho de herramienta');
                }
                conn.query("call RetornarAlmacen(" + Cantidad + ",'" + Producto + "','" + Estado + "','" + Maquina + "')", true, (err, rows, fields) => {
                    if (err) {
                        res.json(err);
                        console.log('Error al descontar almacen' + err);
                    } else {
                        console.log('Se Resto del almacen' + Object.values(rows));
                    }
                    conn.query("call IncrementarFolioRetornoAlmacen('" + Folio + "');", true, (err, rows, fields) => {
                        if (err) {
                            res.json(err);
                            console.log('Error al registrar folios' + err);
                        } else {
                            console.log('Se incremento folio');
                        }
                    });
                });
            });
        });
    } else {
        res.render('Login.html');
    }
};

//============================================================================================================================================================================================================================================
///////// == RECEPCIÓN == ////////////////////////////// == RECEPCIÓN == ////////////////////////////// == RECEPCIÓN == ////////////////////////// == RECEPCIÓN == //////////////////// == RECEPCIÓN == ///////////////////// == RECEPCIÓN == 
//============================================================================================================================================================================================================================================

Controller.MainRecepcion = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            res.render('Almacen/wh_Recepcion.html');
        });
    } else {
        res.render('Login.html');
    }
};

//============================================================================================================================================================================================================================================
///////// == RETORNO == ////////////////////////////// == RETORNO == ////////////////////////////// == RETORNO == ////////////////////////// == RETORNO == //////////////////// == RETORNO == ///////////////////// == RETORNO == ////////////
//============================================================================================================================================================================================================================================

Controller.GuardarRequisicion = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Clave = Object.values(data)[0]; //obeter datos de un objeto Folio
            let Producto = Object.values(data)[1]; //obeter datos de un objeto Folio
            let Cantidad = Object.values(data)[2]; //obeter datos de un objeto Folio
            let OT = Object.values(data)[4]; //obeter datos de un objeto Folio
            let Comentarios = Object.values(data)[5]; //obeter datos de un objeto Folio
            let Empleado = req.session.nombre; //obeter datos de un objeto Folio
            let Planta = req.session.planta;
            let Estatus = 'Requerido';

            if (err) {
                console.log("Conexion: " + err)
            }
            //console.log(Clave + " - " + Producto + " - " + Cantidad + " - " + OT + " - " + Comentarios + " - " + Empleado + " - " + Planta + " - " + Estatus)
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