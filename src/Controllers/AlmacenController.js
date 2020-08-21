const Controller = {};
var OP = require('../public/js/Funciones.js');
var fun = require('../Functions/ajusteFechas');
const express = require('express');//guardar express en una variable de servidor
var pruebasql = require('../Functions/MySQL');


///////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////// == SALIDA == //////////////////// == SALIDA == ///////////////////// == SALIDA == ///////////////////////////////////////////////////////////////
Controller.search = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const { Herra } = req.params;
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
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            conn.query("SELECT * FROM almacen where producto = 'pivote'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.render('Almacen/wh_Salidas.html', {
                    data: Herramientas,
                });
            });
        });
    } else {
        res.render('Login.html');
    }
};


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
        const { familia } = req.params;
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
            const data = req.body;//TRAE TODO EL OBJETO
            let Folio = Object.values(data)[0];//obeter datos de un objeto Folio
            let Producto = Object.values(data)[1];//obeter datos de un objeto Producto
            let Entregado = Object.values(data)[2];//obeter datos de un objeto Entregado
            let Estado = Object.values(data)[3];//obeter datos de un objeto Estado
            let OT = Object.values(data)[4];//obeter datos de un objeto OT
            let OTEstatus = Object.values(data)[5];//obeter datos de un objeto OT
            let Maquina = Object.values(data)[6];//obeter datos de un objeto Maquina
            let Empleado = Object.values(data)[7];//obeter datos de un objeto Empleado
            let Turno = Object.values(data)[8];//obeter datos de un objeto Empleado
            let Comentario = Object.values(data)[9];//obeter datos de un objeto Comentario
            let Movimiento = 'Salida';
            let Planta = req.session.planta;
            let Usuario = req.session.username;
            //console.log(Folio + " - " + Producto + " - " +  Entregado + " - " +  Estado + " - " +  OT + " - " +  OTEstatus + " - " +  Maquina + " - " +  Empleado + " - " +  Turno + " - " +  Comentario + " - " +  Movimiento + " - " +  Planta + " - " +  Usuario)
            if (err){
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
                    console.log("RestoAlmacen: "+rows);
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
            const { Maquina } = req.params;
            console.log(Maquina);
            conn.query("select * from itemprestado WHERE Maquina = '"+Maquina +"' AND Devuelto < Entregado", (err, Herramientas) => {
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
            const data = req.body;//TRAE TODO EL OBJETO
            let Folio = Object.values(data)[0];//obeter datos de un objeto Folio
            let Producto = Object.values(data)[1];//obeter datos de un objeto Folio
            let Cantidad = Object.values(data)[2];//obeter datos de un objeto Folio
            let Estado  = Object.values(data)[3];//obeter datos de un objeto Folio
            let OT = Object.values(data)[4];//obeter datos de un objeto Folio
            let Empleado = Object.values(data)[5];//obeter datos de un objeto Folio
            let Turno = Object.values(data)[6];//obeter datos de un objeto Folio
            let Maquina = Object.values(data)[7];//obeter datos de un objeto Folio
            let Comentarios = Object.values(data)[8];//obeter datos de un objeto Folio
            let Movimiento = 'Retorno';
            let Planta = req.session.planta;
            let Usuario = req.session.username;
            if (err) {
                console.log("Conexion: " + err)
            }
            console.log(Folio + " - " + Producto + " - " +  Cantidad + " - " +  Estado + " - " +  OT  + " - " +  Maquina + " - " +  Empleado + " - " +  Turno + " - " +  Comentarios + " - " +  Movimiento + " - " +  Planta + " - " +  Usuario)
            conn.query('INSERT INTO itemretorno(Folio,Producto,Cantidad,Estado,OT,Empleado,Turno,Maquina,Comentarios,Movimiento,Usuario,Almacen)values(?,?,?,?,?,?,?,?,?,?,?,?)', [Folio,Producto,Cantidad,Estado,OT,Empleado,Turno,Maquina,Comentarios,Movimiento,Usuario,Planta], (err, ot) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error al registrar despacho de herramienta');
                }
                conn.query("call RetornarAlmacen(" + Cantidad + ",'" + Producto + "','" + Estado + "','" + Maquina + "')", true, (err, rows, fields) => {
                    if (err) {
                        res.json(err);
                        console.log('Error al descontar almacen' + err);
                    }else{console.log('Se Resto del almacen' +  Object.values(rows));}
                    conn.query("call IncrementarFolioRetornoAlmacen('" + Folio + "');", true, (err, rows, fields) => {
                        if (err) {
                            res.json(err);
                            console.log('Error al registrar folios' + err);
                        }else{console.log('Se incremento folio');}
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

























module.exports = Controller;