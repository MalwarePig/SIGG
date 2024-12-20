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
            var Herramienta = TranformerReporte(Herra);
            const planta = "Almacen " + req.session.planta;
            const area = req.session.area;

            if (area == 'Admin') {
                console.log("Entre como admin")
                conn.query("SELECT * FROM almacen WHERE producto LIKE '%" + Herramienta + "%' OR Clave = '" + Herramienta + "'", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    }
                    //console.log(Herramientas);
                    res.json(Herramientas);
                });
            } else {
                conn.query("SELECT * FROM almacen WHERE producto LIKE '%" + Herramienta + "%' AND Almacen = '" + planta + "'", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    }
                    //console.log(Herramientas);
                    res.json(Herramientas);
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.list = (req, res) => {
    if (req.session.loggedin) {
        const planta = req.session.planta;
        const Turno = req.session.turno;
        let Usuario = req.session.username;

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
                if (Usuario == 'admin') {
                    res.render('Almacen/wh_Salidas.html');
                } else {
                    if (Estado[0].Estado == "0") { //Si no se ha realizado la auditoria debe entrar
                        if (Turno == "Dia") {
                            if (FechaActual.getDay() == 1) { //Si es lunes
                                var FechaFinal = new Date();
                                var FechaInicial = new Date();
                                FechaInicial.setDate(FechaInicial.getDate() - 2);
                                console.log(typeof (FechaInicial) + " Y " + typeof (FechaFinal.toISOString().slice(0, 10)));
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
                            } else { //Si no es lunes
                                var FechaFinal = new Date();
                                var FechaInicial = new Date();
                                console.log("Actual: " + FechaInicial);
                                FechaInicial.setDate(FechaInicial.getDate() - 1);
                                console.log(typeof (FechaInicial) + " Y " + typeof (FechaFinal.toISOString().slice(0, 10)));
                                conn.query("SELECT * FROM itemprestado where Almacen = '" + planta + "' AND Turno != '" + Turno + "' AND Salida  >= '" + FechaInicial.toISOString().slice(0, 10) + "'", (err, Herramientas) => {
                                    if (err) {
                                        console.log('Error de lectura');
                                    }
                                    //console.log(Herramientas);
                                    res.render('Almacen/PreAuditoria.html', {
                                        data: Herramientas
                                    });
                                });
                            }
                        } else { //Si no es de dia
                            var FechaFinal = new Date();
                            var FechaInicial = new Date();
                            console.log("Actual: " + FechaInicial);
                            FechaInicial.setDate(FechaInicial.getDate() - 1);
                            console.log(typeof (FechaInicial) + " Y " + typeof (FechaFinal.toISOString().slice(0, 10)));
                            conn.query("SELECT * FROM itemprestado where Almacen = '" + planta + "' AND Turno != '" + Turno + "' AND Salida  >= '" + FechaInicial.toISOString().slice(0, 10) + "'", (err, Herramientas) => {
                                if (err) {
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
                }

            });
        });
    } else {
        res.render('Admin/Login.html');
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
        res.render('Admin/Login.html');
    }
};

Controller.Num_Nomina = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        const planta = req.session.planta;
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            conn.query("SELECT * from empleados WHERE Planta = '" + planta + "'", (err, empleados) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(empleados);
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.Maquinas = (req, res) => {
    if (req.session.loggedin) {
        const {
            familia
        } = req.params;
        const planta = req.session.planta;
        const area = req.session.area
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            if (area == 'Admin') {
                conn.query("SELECT * from maquinas where Familia ='" + familia + "'", (err, maquinas) => {
                    if (err) {
                        console.log('Error de lectura');
                    }
                    res.json(maquinas);
                });
            } else {
                conn.query("SELECT * from maquinas where Familia ='" + familia + "' AND Planta = '" + planta + "'", (err, maquinas) => {
                    if (err) {
                        console.log('Error de lectura');
                    }
                    res.json(maquinas);
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.GuardarNota = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO

            var limite = Object.values(data)[0].length;
            console.log("Limite: " + limite);
            for (var i = 0; i < limite; i++) {
                let Folio = Object.values(data)[0][i][0]; //obeter datos de un objeto Folio
                let Producto = Object.values(data)[0][i][1]; //obeter datos de un objeto Producto
                let Entregado = Object.values(data)[0][i][2]; //obeter datos de un objeto Entregado
                let Estado = Object.values(data)[0][i][3]; //obeter datos de un objeto Estado
                let OT = Object.values(data)[0][i][4]; //obeter datos de un objeto OT
                let OTEstatus = Object.values(data)[0][i][5]; //obeter datos de un objeto OT
                let Maquina = Object.values(data)[0][i][6]; //obeter datos de un objeto Maquina
                let Empleado = Object.values(data)[0][i][7]; //obeter datos de un objeto Empleado
                let Parcial = Object.values(data)[0][i][8]; //obeter datos de un objeto Comentario
                let Comentario = Object.values(data)[0][i][9]; //obeter datos de un objeto Comentario
                let Turno = req.session.turno;
                let Movimiento = 'Salida';
                let Planta = req.session.planta;
                let Usuario = req.session.username;

                let Almacen = 'Almacen ' + Planta;


                conn.query("call DespachoAlmacen('" + Folio + "','" + Producto + "'," + Entregado + ",'" + Estado + "','" + OT + "','" + OTEstatus + "','" + Maquina + "','"
                    + Empleado + "','" + Parcial + "','" + Comentario + "','" + Turno + "','" + Movimiento + "','" + Planta + "','" + Usuario + "','" + Almacen + "');", true, (err, rows, fields) => {
                        if (err) {
                            console.log('Error al registrar folios' + err);
                        } else {
                            res.json(true);
                        }
                    });

                //console.log("Indice: " + i + " Folio: " + Folio + " Producto " + Producto + " -Entregado " + Entregado + " -Estado " + Estado + " -OT " + OT + " -OTEstatus " + OTEstatus + " -Maquina " + Maquina + " -Empleado " + Empleado + " -Turno " + Turno + " -Comentario " + Comentario + " -Movimiento " + Movimiento + " -Planta " + Planta + " -Usuario " + Usuario)
                /*  conn.query('INSERT INTO itemprestado(Folio, Producto, Entregado, Estado, OT,OTEstatus, Maquina, Empleado, Turno, Comentarios, Movimiento, Almacen, Usuario,Parcial)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [Folio, Producto, Entregado, Estado, OT, OTEstatus, Maquina, Empleado, Turno, Comentario, Movimiento, Planta, Usuario, Parcial], (err, ot) => {
                     if (err) {
                         console.log('Error al registrar despacho de herramienta');
                     }
                     conn.query("call RestarAlmacen(" + Entregado + ",'" + Producto + "','" + Estado + "','Almacen " + Planta + "');", true, (err, rows, fields) => {
                         if (err) {
                             console.log('Error al descontar almacen' + err);
                         }
                         conn.query("call IncrementarFolioAlmacen('" + Folio + "');", true, (err, rows, fields) => {
                             if (err) {
                                 console.log('Error al registrar folios' + err);
                             }
                         });
                     });
                 }); */
                console.log("Sali " + i);
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};




Controller.GuardarNotaGaveta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO

            var limite = Object.values(data)[0].length;
            console.log("Limite: " + limite);
            for (var i = 0; i < limite; i++) {
                let Folio = Object.values(data)[0][i][0]; //obeter datos de un objeto Folio
                let Producto = Object.values(data)[0][i][1]; //obeter datos de un objeto Producto
                let Entregado = Object.values(data)[0][i][2]; //obeter datos de un objeto Entregado
                let Estado = Object.values(data)[0][i][3]; //obeter datos de un objeto Estado
                let OT = Object.values(data)[0][i][4]; //obeter datos de un objeto OT
                let OTEstatus = Object.values(data)[0][i][5]; //obeter datos de un objeto OT
                let Maquina = Object.values(data)[0][i][6]; //obeter datos de un objeto Maquina
                let Empleado = Object.values(data)[0][i][7]; //obeter datos de un objeto Empleado
                let Parcial = Object.values(data)[0][i][8]; //obeter datos de un objeto Comentario
                let Comentario = Object.values(data)[0][i][9]; //obeter datos de un objeto Comentario
                let idProducto = Object.values(data)[0][i][10]; //obeter datos de un objeto Comentario
                let Movimiento = 'Salida';
                let Planta = req.session.planta;
                let Usuario = req.session.username;

                let Almacen = 'Almacen ' + Planta;

                console.log(idProducto)

                conn.query("call DespachoGaveta('" + Folio + "','" + Producto + "'," + Entregado + ",'" + Estado + "','" + OT + "','" + OTEstatus + "','" + Maquina + "','"
                    + Empleado + "','" + Parcial + "','" + Comentario + "','" + Movimiento + "','" + Planta + "','" + Usuario + "','" + Almacen + "'," + idProducto + ");", true, (err, rows, fields) => {
                        if (err) {
                            console.log('Error al registrar folios' + err);
                        } else {
                            res.json(true);
                        }
                    });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.SavePreAudit = (req, res) => { //Guarda la auditoria diaria de cada almacen
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            var limite = Object.values(data)[0].length || 0;
            for (var i = 0; i < limite; i++) {
                var Producto = Object.values(data)[0][i][0]; //obeter datos de un objeto Producto
                var Cantidad = Object.values(data)[0][i][1]; //obeter datos de un objeto Cantidad
                var Nota = Object.values(data)[0][i][2]; //obeter datos de un objeto Nota

                var Planta = req.session.planta;
                var Usuario = req.session.nombre;

                console.log("Producto " + Producto + " Cantidad: " + Cantidad + " Usuario: " + Usuario + " Planta: " + Planta + " Nota: " + Nota);
                conn.query("INSERT INTO RegistrosFaltantes(Producto, Cantidad, Auditor,Almacen, Notas) values ('" + Producto + "'," + Cantidad + ",'" + Usuario + "','" + Planta + "','" + Nota + "')", [], (err, ot) => {
                    if (err) {
                        console.log('Error al registrar auditoriass' + err);
                    }
                });
            }

        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.AudiCiclica = (req, res) => { //Guarda la auditoria diaria de cada almacen
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Planta = req.session.planta;
            let Usuario = req.session.nombre;
            let FechaReq = new Date();
            console.table(data);
            var limite = Object.values(data)[0].length || 0;
            for (var i = 0; i < limite; i++) {
                var Producto = Object.values(data)[0][i][0]; //obeter datos de un objeto Producto
                var Contado = Object.values(data)[0][i][1]; //obeter datos de un objeto Cantidad
                var Stock = Object.values(data)[0][i][2]; //obeter datos de un objeto Cantidad
                //console.log("Producto: " + Producto+ " Contado: " + Contado + " Stock:" + Stock);
                conn.query('INSERT INTO AudiCiclico(id,Producto, Contado,Stock, Auditor,Almacen,Fecha)values(?,?,?,?,?,?,?)', [0, Producto, Contado, Stock, Usuario, Planta, FechaReq], (err, ot) => {
                    if (err) {
                        console.log('Error al registrar auditoria ciclica' + err);
                    }
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.StockActual = (req, res) => { //Guarda la auditoria diaria de cada almacen
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                Herramienta
            } = req.params;

            var Producto = Tranformer(Herramienta);
            let Planta = "Almacen " + req.session.planta;
            let FechaReq = new Date();

            conn.query("SELECT * FROM almacen where Producto ='" + Producto + "' AND Almacen = '" + Planta + "'", (err, maquinas) => {
                if (err) {
                    console.log('Error de lectura' + err);
                }
                res.json(maquinas);
            });
        });
    } else {
        res.render('Admin/Login.html');
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
            console.log("Entre en Estado auditoria");
            conn.query("call CambiarEstadoAuditoria('" + Turno + "','" + planta + "');", true, (err, rows, fields) => {
                if (err) {
                    console.log('Error al registrar folios' + err);
                } else {
                    console.log('Se cambio de estado');
                    res.render('Almacen/wh_Salidas.html');
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
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
        res.render('Admin/Login.html');
    }
};

Controller.searchRetorno = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Maquina
            } = req.params;

            conn.query("select * from itemprestado WHERE(Empleado LIKE '%" + Maquina + "%' OR OT = '" + Maquina + "' OR Producto = '" + Maquina + "') AND Devuelto < Entregado", (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura' + err);
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
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
                    console.log('Error de lectura' + err);
                }
                res.json(Folio);
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.GuardarNotaRetorno = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data));
            var limite = Object.values(data)[0].length;
            for (var i = 0; i < limite; i++) {
                let Folio = Object.values(data)[0][i][0]; //[No se][indice de fila][indice de columna]
                let Producto = Object.values(data)[0][i][1]; //[No se][indice de fila][indice de columna]
                let Cantidad = Object.values(data)[0][i][2]; //[No se][indice de fila][indice de columna]
                let Estado = Object.values(data)[0][i][3]; //[No se][indice de fila][indice de columna]
                let Empleado = Object.values(data)[0][i][4]; //[No se][indice de fila][indice de columna]
                let Maquina = Object.values(data)[0][i][5]; //[No se][indice de fila][indice de columna]
                let Comentarios = Object.values(data)[0][i][6]; //[No se][indice de fila][indice de columna]
                let FolioSalida = Object.values(data)[0][i][7]; //[No se][indice de fila][indice de columna]
                let OT = Object.values(data)[0][i][8]; //[No se][indice de fila][indice de columna]
                let CantidadSalida = Object.values(data)[0][i][9]; //[No se][indice de fila][indice de columna]
                let Turno = req.session.turno; //obeter datos de un objeto Folio
                let Movimiento = 'Retorno';
                let Planta = req.session.planta;
                let Usuario = req.session.username;
                console.log("Producto : " + Producto + " Cantidad a retornar: " + Cantidad);
                //console.log(Folio + " - " + Producto + " - " + Cantidad + " - " + Estado + " - " + OT + " - " + Maquina + " - " + Empleado + " - " + Turno + " - " + Comentarios + " - " + Movimiento + " - " + Planta + " - " + Usuario)
                conn.query('INSERT INTO itemretorno(Folio,Producto,Cantidad,Estado,Empleado,Turno,Maquina,Comentarios,Movimiento,Usuario,Almacen,OT,Despachado)values(?,?,?,?,?,?,?,?,?,?,?,?,?)', [Folio, Producto, Cantidad, Estado, Empleado, Turno, Maquina, Comentarios, Movimiento, Usuario, Planta, OT, CantidadSalida], (err, ot) => {
                    if (err) {
                        console.log('Error al registrar despacho de herramienta');
                    }
                    conn.query("call RetornarAlmacen(" + Cantidad + ",'" + Producto + "','" + Estado + "','" + Maquina + "','" + FolioSalida + "','Almacen " + Planta + "')", true, (err, rows, fields) => {
                        if (err) {

                            console.log('Error al descontar almacen' + err);
                        } else {
                            console.log('Se Resto del almacen' + Object.values(rows));
                        }
                        conn.query("call IncrementarFolioRetornoAlmacen('" + Folio + "');", true, (err, rows, fields) => {
                            if (err) {
                                console.log('Error al registrar folios' + err);
                            } else {
                                console.log('Se incremento folio');
                                res.json(true)
                            }
                        });
                    });
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
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
        res.render('Admin/Login.html');
    }
};

Controller.GuardarRecepcion = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            // console.log("Tamaño " + Object.values(data).length + " keys " +  Object.keys(data)[0] + " Valores " + Object.values(data)[0] +  " Valores dobles " + Object.values(data)[0][0]  + Object.values(data)[0][1]  + Object.values(data)[0][2]  );
            var limite = Object.values(data)[0].length;
            for (var i = 0; i < limite; i++) {
                let Producto = Object.values(data)[0][i][0]; //obeter datos de un objeto Producto
                let Ordenado = Object.values(data)[0][i][1]; //obeter datos de un objeto Ordenado
                let Entregado = parseInt(Object.values(data)[0][i][2]); //obeter datos de un objeto Entregado
                let Usuario = req.session.nombre; //obeter datos de un objeto nombre
                let Estatus = "N/A"; //obeter datos de un objeto Folio
                console.log("Producto: " + Producto + " Ordenado: " + Ordenado + " Entregado: " + Entregado);

                if (err) {
                    console.log("Conexion: " + err);
                }

                conn.query('INSERT INTO Recepcion(Producto, Ordenado, Entregado, Usuario, Estatus)values(?,?,?,?,?)', [Producto, Ordenado, Entregado, Usuario, Estatus], (err, ot) => {
                    if (err) {
                        //res.json("Error json: " + err);
                        console.log('Error al registrar recepcion ' + err);
                    } else {
                        console.log('Recepciono exitosa: ' + Producto);
                    }
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

/*
Controller.GuardarRecepcion = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Producto = Object.values(data)[0]; //obeter datos de un objeto Folio
            let Ordenado = Object.values(data)[1]; //obeter datos de un objeto Folio
            let Entregado = Object.values(data)[2]; //obeter datos de un objeto Folio
            let Usuario = req.session.nombre; //obeter datos de un objeto nombre
            let Estatus = "N/A"; //obeter datos de un objeto Folio

            if (err) {
                console.log("Conexion: " + err);
            }
            //console.log(Clave + " - " + Producto + " - " + Cantidad + " - " + OT + " - " + Comentarios + " - " + Empleado + " - " + Planta + " - " + Estatus)
            conn.query('INSERT INTO Recepcion(Producto, Ordenado, Entregado, Usuario, Estatus)values(?,?,?,?,?)', [Producto, Ordenado, Entregado, Usuario, Estatus], (err, ot) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error al registrar recepcion');
                }else{
                    console.log('Recepciono exitosa: ' + Producto);
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};*/

Controller.ConsultaRecepcion = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Maquina
            } = req.params;

            conn.query("SELECT * FROM Recepcion WHERE Estatus = 'N/A' ORDER BY Entrada", (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura');
                }
                res.json(Herramientas);
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.Asignar = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            var limite = Object.values(data)[0].length;
            for (var i = 0; i < limite; i++) {
                var id = Object.values(data)[0][i][0]; //obeter datos de un objeto id
                var Item = Object.values(data)[0][i][1]; //obeter datos de un objeto Item
                var Cantidad = Object.values(data)[0][i][2]; //obeter datos de un objeto Cantidad
                var Planta = Object.values(data)[0][i][3]; //obeter datos de un objeto Planta
                console.log(id + "','" + Item + "','" + Cantidad + "','" + Planta);

                conn.query("call Asignar('" + id + "','" + Item + "','" + Cantidad + "','" + Planta + "')", true, (err, rows, fields) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    } else {
                        console.log('Se asigno herramienta a almacen');
                    }
                });
            } //For
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.ConsultaFlotante = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Maquina
            } = req.params;

            conn.query("SELECT * FROM ProductoFlotante", (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura');
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.MostrarRecoleccion = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Maquina
            } = req.params;
            let Planta = req.session.planta;
            conn.query("SELECT * FROM ProductoFlotante where Planta = 'Almacen " + Planta + "'", (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura');
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.GuardarRecoleccion = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Planta = "Almacen " + req.session.planta; //obeter datos de un objeto Planta
            let Usuario = req.session.nombre; //obeter datos de un objeto nombre
            var limite = Object.values(data)[0].length;
            for (var i = 0; i < limite; i++) {
                var id = Object.values(data)[0][i][0]; //obeter datos de un objeto id
                var Item = Object.values(data)[0][i][1]; //obeter datos de un objeto Item
                var Cantidad = Object.values(data)[0][i][2]; //obeter datos de un objeto Cantidad
                console.log("id " + id + "','" + Item + "','" + Cantidad + "','" + Planta + "," + Usuario);
                conn.query("call Recolectar(" + id + ",'" + Item + "'," + Cantidad + ",'" + Planta + "','" + Usuario + "')", true, (err, rows, fields) => { });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.CancelarFlotante = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                id
            } = req.params;
            conn.query("call CancelarAsignacion(" + id + ")", true, (err, rows, fields) => {
                if (err) {
                    console.log('Error al asignar' + err);
                } else {
                    console.log('Se cancelo correctamente');
                    res.json(true)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.EliminarRecepcion = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                id
            } = req.params;
            conn.query("DELETE FROM recepcion WHERE id = " + id + "", (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura');
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


//============================================================================================================================================================================================================================================
///////// == Nuevo Producto == ////////////////////////////// == Nuevo Producto == ////////////////////////////// == Nuevo Producto == ////////////////////////// == Nuevo Producto == //////////////////// == Nuevo Producto
//============================================================================================================================================================================================================================================
Controller.NuevoProducto = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Planta = "Almacen " + req.session.planta; //obeter datos de un objeto Planta
            let Usuario = req.session.nombre; //obeter datos de un objeto nombre

            var Clave = Object.values(data)[0][0]; //obeter datos de un objeto Item
            var Producto = Object.values(data)[0][1]; //obeter datos de un objeto Item
            var Almacen = Object.values(data)[0][2]; //obeter datos de un objeto Item
            var Stock = Object.values(data)[0][3]; //obeter datos de un objeto Item
            var StockMin = Object.values(data)[0][4]; //obeter datos de un objeto Item
            var StockMax = Object.values(data)[0][5]; //obeter datos de un objeto Item
            var StockUsado = Object.values(data)[0][6]; //obeter datos de un objeto Item
            var Ubicacion = Object.values(data)[0][7]; //obeter datos de un objeto Item
            var Categoria = Object.values(data)[0][8]; //obeter datos de un objeto Item
            var Familia = Object.values(data)[0][9]; //obeter datos de un objeto Item
            const nombre = req.session.nombre;

            conn.query("call NuevoProducto('" + Clave + "','" + Producto + "','" + Almacen + "'," + Stock + "," + StockMin + "," + StockMax + "," + StockUsado + ",'" + Ubicacion + "','" + Categoria + "','" + Familia + "','" + nombre + "')", true, (err, rows, fields) => {
                if (err) {
                    res.json(false);
                    console.log('Error al agregar' + err);
                } else {
                    console.log('Se agrego herramienta de almacen');
                    res.json(true)
                }
            });

            // var Cantidad = Object.values(data)[0][i][2]; //obeter datos de un objeto Cantidad
            //console.log("id " + id + "','" + Item + "','" + Cantidad + "','" + Planta + "," + Usuario);
        });
    } else {
        res.render('Admin/Login.html');
    }
};

//============================================================================================================================================================================================================================================
///////// == Actualizar Herramienta == ////////////////////////////// == Actualizar Herramienta == ////////////////////////////// == Actualizar Herramienta == ////////////////////////// == Actualizar Herramienta == //////////////////// == 
//============================================================================================================================================================================================================================================

Controller.ActualizarProducto = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id
            var Clave = Object.values(data)[0].Clave; //obeter datos de un objeto Clave
            var Producto = Object.values(data)[0].Producto; //obeter datos de un objeto Producto
            var StockNuevo = Object.values(data)[0].StockNuevo; //obeter datos de un objeto Ubicacion
            var StockUsado = Object.values(data)[0].StockUsado; //obeter datos de un objeto Ubicacion
            var StockMinimo = Object.values(data)[0].StockMinimo; //obeter datos de un objeto Ubicacion
            var StockMaximo = Object.values(data)[0].StockMaximo; //obeter datos de un objeto Ubicacion
            var Categoria = Object.values(data)[0].Categoria; //obeter datos de un objeto Ubicacion
            var Familia = Object.values(data)[0].Familia; //obeter datos de un objeto Ubicacion
            var Motivo = Object.values(data)[0].Motivo; //obeter datos de un objeto Ubicacion
            var Nombre = Object.values(data)[0].Nombre;
            var NuevaCantidad = Object.values(data)[0].NuevaCantidad;
            var Planta = Object.values(data)[0].Planta;

            console.log("id " + id + "','" + Clave + "','" + Producto + "','" + StockNuevo + "','" + StockUsado + "','" + StockMinimo + "','" + StockMaximo + "','" + Motivo + "','" + Nombre + "','" + NuevaCantidad + "','" + Planta);
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("call ActualizarProducto(" + id + ",'" + Clave + "','" + Producto + "','" + StockNuevo + "','" + StockUsado + "','" + StockMinimo + "','" + StockMaximo + "','" + Categoria + "','" + Familia
                    + "','" + Motivo + "','" + Nombre + "'," + NuevaCantidad + ",'" + Planta + "')", true, (err, rows, fields) => {
                        if (err) {
                            res.json(err);
                            console.log('Error al actualizar' + err);
                        } else {
                            console.log('Se actualizó herramienta de almacen');
                            res.json(true)
                        }
                    });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.ActualizarProductoUsado = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id   var StockNuevo = Object.values(data)[0].StockNuevo; //obeter datos de un objeto Ubicacion
            var StockUsado = Object.values(data)[0].StockUsado; //obeter datos de un objeto Ubicacion
            var StockMinimo = Object.values(data)[0].StockMinimo; //obeter datos de un objeto Ubicacion
            var StockMaximo = Object.values(data)[0].StockMaximo; //obeter datos de un objeto Ubicacion
            var StockAfilado = Object.values(data)[0].StockAfilado; //obeter datos de un objeto Ubicacion


            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("UPDATE almacen SET StockUsado = " + StockUsado + ",StockMin = " + StockMinimo + ", StockMax= " + StockMaximo + ",StockAfilado = " + StockAfilado + " WHERE id = " + id, (err, Herramientas) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                    }
                    res.json(true)
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

//Editar Producto
Controller.EditarProducto = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id
            var Clave = Object.values(data)[0].Clave; //obeter datos de un objeto Clave
            var Producto = Object.values(data)[0].Producto; //obeter datos de un objeto Producto
            var Ubicacion = Object.values(data)[0].Ubicacion; //obeter datos de un objeto Producto
            var Proveedor = Object.values(data)[0].Proveedor; //obeter datos de un objeto Producto
            var ProveedorSec = Object.values(data)[0].ProveedorSec; //obeter datos de un objeto ProveedorSec
            var Precio = Object.values(data)[0].Precio; //obeter datos de un objeto ProveedorSec
            var Familia = Object.values(data)[0].Familia; //obeter datos de un objeto ProveedorSec
            var Moneda = Object.values(data)[0].Moneda; //obeter datos de un objeto ProveedorSec
            var TiempoEntrega = Object.values(data)[0].TiempoEntrega; //obeter datos de un objeto ProveedorSec

            console.log("id " + id + "','" + Clave + "','" + Producto + "','" + Ubicacion + "','" + Proveedor + "','" + ProveedorSec + "',' " + Familia);
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("UPDATE almacen SET Clave = '" + Clave + "', Producto = '" + Producto + "', Ubicacion = '" + Ubicacion + "', Proveedor = '" + Proveedor + "', ProveedorSec= '" + ProveedorSec + "', Precio = " + Precio + ", Familia = '" + Familia + "',Moneda= '" + Moneda + "',TiempoEntrega= '" + TiempoEntrega + "' WHERE Producto = '" + Producto + "'", (err, Herramientas) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                    }
                    res.json(true)
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};


//Eliminar Producto
Controller.EliminarProducto = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id

            console.log("id " + id);
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("DELETE FROM almacen WHERE id = " + id, (err, Herramientas) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                    }
                    res.json(Herramientas)
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

//============================================================================================================================================================================================================================================
///////// == PROVEEDOR == ////////////////////////////// == PROVEEDOR == ////////////////////////////// == PROVEEDOR == ////////////////////////// == PROVEEDOR == //////////////////// == RETORNO == ///////////////////// == RETORNO == ////////////
//============================================================================================================================================================================================================================================
//Editar Producto
Controller.RegistroProveedor = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var Proveedor = Object.values(data)[0].Proveedor; //obeter datos de un objeto id 

            console.log("Proveedor " + Proveedor);
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("INSERT INTO Proveedores(Nombre)VALUE('" + Proveedor + "')", (err, Herramientas) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                    }
                    res.json(true)
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

//Eliminar Producto
Controller.EliminarProveedor = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id

            console.log("id " + id);
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("DELETE FROM Proveedores WHERE id = " + id, (err, Herramientas) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                    } else {
                        res.json(true)
                    }
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};


//============================================================================================================================================================================================================================================
///////// == RETORNO == ////////////////////////////// == RETORNO == ////////////////////////////// == RETORNO == ////////////////////////// == RETORNO == //////////////////// == RETORNO == ///////////////////// == RETORNO == ////////////
//============================================================================================================================================================================================================================================

Controller.GuardarRequisicion = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Clave = Object.values(data)[0]; //obeter datos de un objeto Clave
            let Producto = Object.values(data)[1]; //obeter datos de un objeto Producto
            let Cantidad = Object.values(data)[2]; //obeter datos de un objeto Cantidad
            let OT = Object.values(data)[4]; //obeter datos de un objeto OT
            let Comentarios = Object.values(data)[5]; //obeter datos de un objeto Comentarios
            let Empleado = req.session.nombre; //obeter datos de un objeto nombre
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
        res.render('Admin/Login.html');
    }
};

//============================================================================================================================================================================================================================================
///////// == REPORTE == ////////////////////////////// == REPORTE == ////////////////////////////// == REPORTE == ////////////////////////// == REPORTE == //////////////////// == REPORTE == ///////////////////// == REPORTE == ////////////
//============================================================================================================================================================================================================================================

Controller.MostrarReporte = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var categoria = parametros.split('|')[0]; // categoria o tipo de reporte
            var fechaInicio = parametros.split('|')[1]; // Fecha inicial
            var fechafin = parametros.split('|')[2]; // Fecha limite
            var Almacen = parametros.split('|')[3]; // Almacen
            console.log("SELECT * FROM " + categoria + " WHERE Almacen = '" + Almacen + "' AND Salida BETWEEN '" + fechaInicio + "' AND '" + fechafin + "'")

            conn.query("SELECT * FROM " + categoria + " WHERE Almacen = '" + Almacen + "' AND Salida BETWEEN '" + fechaInicio + "' AND '" + fechafin + "'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};
//============================================================================================================================================================================================================================================
///////// == REPORTE == ////////////////////////////// == REPORTE == ////////////////////////////// == REPORTE == ////////////////////////// == REPORTE == //////////////////// == REPORTE == ///////////////////// == REPORTE == ////////////
//============================================================================================================================================================================================================================================

Controller.reporteAjustes = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var fechaInicio = parametros.split('|')[0]; // Fecha inicial
            var fechafin = parametros.split('|')[1]; // Fecha limite
            var Almacen = parametros.split('|')[2]; // Almacen

            conn.query("SELECT * FROM ReporteAjuste WHERE Almacen = '" + Almacen + "' AND FechaAjuste BETWEEN '" + fechaInicio + "' AND '" + fechafin + "'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                console.log(Herramientas);
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.reporteAjustesBasico = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var fechaInicio = parametros.split('|')[0]; // Fecha inicial
            var fechafin = parametros.split('|')[1]; // Fecha limite
            var Almacen = parametros.split('|')[2]; // Almacen
            var BHerramienta = parametros.split('|')[3]; // Herramienta

            console.log(BHerramienta + " " + Almacen)

            if (BHerramienta == null || BHerramienta == '' || BHerramienta.length == 0) {
                console.log("sin")
                conn.query("SELECT * FROM AjustebasicoAlmacen WHERE Planta = '" + Almacen + "' AND FechaAjuste BETWEEN '" + fechaInicio + "' AND '" + fechafin + "'", (err, Herramientas) => {
                    if (err) {
                        res.json(err);
                        console.log('Error de lectura ' + err);
                    }
                    console.log(Herramientas);
                    res.json(Herramientas)
                });
            } else {
                console.log("Producto: " + BHerramienta + " Almacen: " + Almacen + " fechaInicio: " + fechaInicio + " fechafin: " + fechafin)
                conn.query("SELECT * FROM AjustebasicoAlmacen WHERE Planta = '" + Almacen + "' AND Producto = '" + BHerramienta + "' AND FechaAjuste BETWEEN '" + fechaInicio + "' AND '" + fechafin + "'", (err, Herramientas) => {
                    if (err) {
                        res.json(err);
                        console.log('Error de lectura' + err);
                    }
                    console.table(Herramientas)
                    res.json(Herramientas)
                });
            }

        });
    } else {
        res.render('Admin/Login.html');
    }
};


//============================================================================================================================================================================================================================================
///////// == REPORTE Herramienta == ////////////////////////////// == REPORTE Herramienta == ////////////////////////////// == REPORTE Herramienta == ////////////////////////// == REPORTE Herramienta == //////////////////// == REPORTE Herramienta == ///////////////////// == REPORTE == ////////////
//============================================================================================================================================================================================================================================

Controller.MostrarReporteHerramienta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                Herramienta
            } = req.params;

            var Articulo = TranformerReporte(Herramienta.split('|')[0]);
            var fechaInicio = Herramienta.split('|')[1]; // Fecha inicial
            var fechafin = Herramienta.split('|')[2]; // Fecha limite
            var Almacen = Herramienta.split('|')[3]; // Fecha limite

            console.log("Articulo: " + Articulo + " con fecha " + fechaInicio + " y " + fechafin + "  es de " + Almacen)

            //Reporte solo Articulo sin fecha
            if (fechaInicio == null || fechaInicio == '') {
                console.log("sin fecha ")
                conn.query("call HerramientaOT('" + Articulo + "','" + Almacen + "')", true, (err, rows, fields) => {
                    if (err) {
                        res.json(err);
                        console.log('Error al actualizar' + err);
                    } else {
                        res.json(rows[0])
                    }
                });
            } else {//Reporte Articulo Con fecha
                console.log("Articulo: " + Articulo + " con fecha " + fechaInicio + " y " + fechafin + "  es de " + Almacen)
                conn.query("call HerramientaOTFecha('" + Articulo + "','" + Almacen + "','" + fechaInicio + "','" + fechafin + "')", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura' + err);
                    }
                    console.log(Herramientas.length);
                    res.json(Herramientas[0])
                });
            }



        });
    } else {
        res.render('Admin/Login.html');
    }
};

//============================================================================================================================================================================================================================================
///////// == REPORTE Herramienta == ////////////////////////////// == REPORTE Herramienta == ////////////////////////////// == REPORTE Herramienta == ////////////////////////// == REPORTE Herramienta == //////////////////// == REPORTE Herramienta == ///////////////////// == REPORTE == ////////////
//============================================================================================================================================================================================================================================

Controller.TipoReporteHerramientaAdmin = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                Herramienta
            } = req.params;

            var Articulo = TranformerReporte(Herramienta.split('|')[0]);
            var fechaInicio = Herramienta.split('|')[1]; // Fecha inicial
            var fechafin = Herramienta.split('|')[2]; // Fecha limite
            var Almacen = Herramienta.split('|')[3]; // Fecha limite
            var Planta = "Almacen " + Almacen

            console.log("Articulo: " + Articulo + " con fecha " + fechaInicio + " y " + fechafin + "  es de " + Almacen)

            if (fechaInicio == null || fechaInicio == '') {
                console.log("sin fecha ")
                conn.query("SELECT I.*,A.precio FROM itemprestado I, almacen A WHERE i.producto = A.producto AND (A.almacen = '" + Planta + "' AND I.Almacen = '" + Almacen + "') AND (I.Producto like '%" + Articulo + "%' OR I.OT = '" + Articulo + "') ORDER BY i.Salida Desc", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura' + err);
                    }
                    res.json(Herramientas)
                });
            } else {
                console.log("Articulo: " + Articulo + " con fecha " + fechaInicio + " y " + fechafin + "  es de " + Almacen)
                conn.query("SELECT I.*,A.precio FROM itemprestado I, almacen A WHERE i.producto = A.producto AND (A.almacen = '" + Planta + "') AND (I.Producto like '%" + Articulo + "%' OR I.OT = '" + Articulo + "') AND I.Almacen = '" + Almacen + "' AND I.Salida BETWEEN '" + fechaInicio + "' and '" + fechafin + "'  ORDER BY I.Salida Desc", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura' + err);
                    }
                    console.log(Herramientas);
                    res.json(Herramientas)
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};


//============================================================================================================================================================================================================================================
/////// == ExistenciasAlmacen == ////////////////////////////// == ExistenciasAlmacen == ////////////////////////////// == ExistenciasAlmacen == ////////////////////////// == ExistenciasAlmacen== //////////////////// == ExistenciasAlmacen
//============================================================================================================================================================================================================================================
Controller.ExistenciasAlmacen = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            conn.query("SELECT Clave,Producto,almacen,Stock,StockMin,StockMax,StockUsado,Ubicacion FROM almacen order by Almacen", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

//============================================================================================================================================================================================================================================
///////// == INTERCAMBIO == ////////////////////////////// == INTERCAMBIO == ////////////////////////////// == INTERCAMBIO == ////////////////////////// == INTERCAMBIO == //////////////////// == INTERCAMBIO == /////////////////////     == 
//============================================================================================================================================================================================================================================

Controller.Intercambio = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            res.render('Almacen/Intercambios.html');
        });
    } else {
        res.render('Admin/Login.html');
    }
};

//Intercambiar el diagonal por otro simbolo para no tener problemas con el url
function Tranformer(variable) {
    var Herramienta = "";
    for (var q = 0; q < variable.length; q++) {
        if (variable.charAt(q) == '|') {
            Herramienta += '/';
        } else {
            Herramienta += variable.charAt(q);
        }
    }
    return Herramienta;
}

function TranformerReporte(variable) {
    var Herramienta = "";
    for (var q = 0; q < variable.length; q++) {
        if (variable.charAt(q) == '@') {
            Herramienta += '/';
        } else {
            Herramienta += variable.charAt(q);
        }
    }
    return Herramienta;
}

Controller.CrearIntercambio = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Estatus = 'Pendiente';
            let Planta = req.session.planta;
            var limite = Object.values(data)[0].length;
            for (var i = 0; i < limite; i++) {

                let Producto = Object.values(data)[0][i][0]; //obeter datos de un objeto Producto
                let Cantidad = Object.values(data)[0][i][1]; //obeter datos de un objeto Cantidad
                let Estado = Object.values(data)[0][i][2]; //obeter datos de un objeto OT
                let Empleado = Object.values(data)[0][i][3]; //obeter datos de un objeto OT
                let Comentario = Object.values(data)[0][i][4]; //obeter datos de un objeto OT

                conn.query('INSERT INTO IntercambioActivo(Producto, Cantidad, Estado, Empleado, Planta,Comentario,Estatus)values(?,?,?,?,?,?,?)', [Producto, Cantidad, Estado, Empleado, Planta, Comentario, Estatus], (err, ot) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error al registrar despacho de herramienta' + err);
                    }
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.MostrarIntercambio = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const planta = req.session.planta;

            conn.query("SELECT * FROM IntercambioActivo WHERE Planta != '" + planta + "' AND Estatus = 'Pendiente'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Herramientas);
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.GuardarIntercambio = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            var limite = Object.values(data)[0].length;
            console.log('Lmiite' + limite);

            var Item = "";
            var Cantidad = "";
            var Estado = "";
            let Planta = "";

            Item = Object.values(data)[0][0]; //obeter datos de un objeto Item
            Cantidad = Object.values(data)[0][1]; //obeter datos de un objeto Cantidad
            Estado = Object.values(data)[0][2]; //obeter datos de un objeto Cantidad
            Planta = "Almacen " + req.session.planta; //obeter datos de un objeto Planta

            console.log(Item + "'," + Cantidad + ",'" + Planta + "','" + Estado)

            conn.query("call GuardarIntercambio('" + Item + "'," + Cantidad + ",'" + Planta + "','" + Estado + "')", true, (err, rows, fields) => {
                if (err) {
                    console.log('Error al Recolectar' + err);
                } else {
                    conn.query("call IntercambioActivo('" + Item + "','" + Planta + "')", true, (err, rows, fields) => {
                        if (err) {
                            console.log('Error al Recolectar' + err);
                        } else {
                            console.log(Item + "'," + Cantidad + ",'" + Planta + "','" + Estado)
                        }
                    });
                }
            });


        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.MostrarCancelacion = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const planta = req.session.planta;

            conn.query("SELECT * FROM IntercambioActivo WHERE Planta = '" + planta + "' AND Estatus = 'Pendiente'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Herramientas);
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.CancelarIntercambio = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const planta = req.session.planta;
            var {
                Producto
            } = req.params;
            Producto = Tranformer(Producto);
            conn.query("DELETE FROM intercambioactivo WHERE Producto = '" + Producto + "' AND Planta = '" + planta + "' AND Estatus = 'Pendiente'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error al eliminar');
                }
                res.json(Herramientas);
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



/*============================================================================== GABETA =================================================================================================*/

//Transfiere de gaveta a almacenes
Controller.DescontarGaveta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            var limite = Object.values(data)[0].length;
            console.log("Total de objetos: " + limite);
            for (var i = 0; i < limite; i++) {
                var Producto = Object.values(data)[0][i][0]; //obeter datos de un objeto Producto
                var Entregado = Object.values(data)[0][i][1]; //obeter datos de un objeto Cantidad
                var Estado = Object.values(data)[0][i][2]; //obeter datos de un objeto Estado
                var Planta = "Almacen " + Object.values(data)[0][i][3]; //obeter datos de un objeto Planta
                var Comentario = Object.values(data)[0][i][4]; //obeter datos de un objeto Comentario
                var campoEstado = "";
                // console.log(Producto + "','" + Entregado + "','" + Estado + "','" + PlPlantaanta + "','" +Comentario);
                if (Estado == "Nuevo") {
                    campoEstado = "Stock";
                } else {
                    campoEstado = "StockUsado";
                }
                console.log("insertando: " + Producto);
                conn.query("INSERT INTO productoflotante(Producto, Cantidad, Estatus, Planta, Estado, Comentario)VALUES('" + Producto + "','" + Entregado + "','N/A','" + Planta + "','" + Estado + "','" + Comentario + "')", [], (err, ot) => {
                    if (err) {
                        console.log('Error al registrar despacho de herramienta' + err);
                    }

                    console.log("indice: " + i + "SELECT " + campoEstado + " FROM almacen WHERE Producto = '" + Producto + "' AND Almacen = 'Gaveta'");
                    conn.query("SELECT " + campoEstado + " FROM almacen WHERE Producto = '" + Producto + "' AND Almacen = 'Gaveta'", [], (err, Actual) => {
                        if (err) {
                            console.log('Error al leer actual' + err);
                        } else {
                            conn.query("UPDATE almacen SET " + campoEstado + " = " + (Object.values(Actual[0])[0] - Entregado) + " WHERE Producto = '" + Producto + "' AND Almacen = 'Gaveta'", [], (err, ot) => {
                                if (err) {
                                    console.log('Error al restar gaveta' + err);
                                } else {
                                    console.log("indice: " + i + "Campo: " + campoEstado + " Actual: " + Object.values(Actual[0])[0] + " Entregado: " + Entregado + " Resta: " + (Object.values(Actual[0])[0] - Entregado) + " Producto: " + Producto);
                                    console.log("gaveta restada")
                                }
                            }); //Update de cantidades
                        }
                    }); //Select de cantidades
                }); //Insert a producto flotante
            } //For
        });
    } else {
        res.render('Admin/Login.html');
    }
};



///////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////// == SALIDA == //////////////////// == SALIDA == ///////////////////// == SALIDA == ///////////////////////////////////////////////////////////////
Controller.BuscarHerramientasGav = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Herra
            } = req.params;
            var Herramienta = Tranformer(Herra);//req.session.planta
            const planta = req.session.planta;
            console.log("Salida: " + Herramienta + " Planta: " + planta);
            conn.query("SELECT * FROM Gavetas WHERE Clave like '%" + Herramienta + "%'", (err, Herramientas) => {
                if (err) {

                    console.log('Error de lectura ' + err);
                } else {
                    console.log(Herramientas);
                    res.json(Herramientas);
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.BuscarHerramientasGavPlanta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            console.log("parametros: " + parametros);
            var Herramienta = parametros.split('|')[0];
            var Planta = parametros.split('|')[1];
            console.log("Salida: " + Herramienta + " Planta: " + Planta);
            conn.query("SELECT * FROM Gavetas WHERE Clave like '%" + Herramienta + "%' AND Planta = '" + Planta + "' order by Planta", (err, Herramientas) => {
                if (err) {

                    console.log('Error de lectura ' + err);
                } else {
                    console.log(Herramientas);
                    res.json(Herramientas);
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.BuscarGavetaId = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            console.log("parametros: " + parametros);
            conn.query("SELECT * FROM Gavetas WHERE id = " + parametros, (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura ' + err);
                } else {
                    console.log(Herramientas);
                    res.json(Herramientas);
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



//Editar Producto
Controller.postAjusteGaveta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id
            var Cantidad = Object.values(data)[0].Cantidad; //obeter datos de un objeto Clave
            var CantidadUsados = Object.values(data)[0].CantidadUsados; //obeter datos de un objeto Producto
            var Clave = Object.values(data)[0].Clave; //obeter datos de un objeto Producto
            var Grado = Object.values(data)[0].Grado; //obeter datos de un objeto Producto  
            let Planta = req.session.planta;
            let Usuario = req.session.username;
            console.log("Grado: " + Grado)

            if (err) {
                console.log("Conexion: " + err)
            } else {
                console.log(id + "'," + Clave + ",'" + Planta + "','" + Usuario + "','" + Grado + "','" + Cantidad)
                conn.query("call AjusteGaveta(" + id + ",'" + Clave + "','" + Grado + "','" + Planta + "'," + Cantidad + "," + CantidadUsados + ",'" + Usuario + "')", true, (err, rows, fields) => {
                    if (err) {
                        console.log('Error al Recolectar' + err);
                        console.log(err);
                    } else {
                        res.json(true)
                    }
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};



//Editar Producto Gaveta
Controller.GuardarCambiosGaveta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id
            var Clave = Object.values(data)[0].Clave; //obeter datos de un objeto id
            var Planta = Object.values(data)[0].Planta; //obeter datos de un objeto id
            var Familia = Object.values(data)[0].Familia;
            var Marca = Object.values(data)[0].Marca;
            var Grado = Object.values(data)[0].Grado;
            var MedidaDiametro = Object.values(data)[0].MedidaDiametro;
            var Tipo = Object.values(data)[0].Tipo;
            var Descripcion = Object.values(data)[0].Descripcion;
            var Parte = Object.values(data)[0].Parte;
            var Ubicacion = Object.values(data)[0].Ubicacion;
            var Link = Object.values(data)[0].Link;
            var Comentario = Object.values(data)[0].Comentario;
            var Precio = Object.values(data)[0].Precio;

            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("UPDATE gavetas SET Clave= '" + Clave + "',Planta='" + Planta + "',Familia='" + Familia + "',Marca='" + Marca + "',Grado='" + Grado + "',MedidaDiametro='" + MedidaDiametro +
                    "',Tipo='" + Tipo + "',Descripcion='" + Descripcion + "',Parte='" + Parte + "',Ubicacion='" + Ubicacion + "',Link='" + Link + "',Comentarios='" + Comentario + "',Precio='" + Precio + "' WHERE id = " + id, (err, Herramientas) => {
                        if (err) {
                            console.log('Error de lectura' + err);
                        } else {
                            res.json(true)
                        }

                    });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};


//Crea Producto Gaveta
Controller.GuardarNuevoGaveta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var Clave = Object.values(data)[0].Clave; //obeter datos de un objeto id
            var Planta = Object.values(data)[0].Planta; //obeter datos de un objeto id
            var Familia = Object.values(data)[0].Familia;
            var Marca = Object.values(data)[0].Marca;
            var Grado = Object.values(data)[0].Grado;
            var MedidaDiametro = Object.values(data)[0].MedidaDiametro;
            var Tipo = Object.values(data)[0].Tipo;
            var Descripcion = Object.values(data)[0].Descripcion;
            var Parte = Object.values(data)[0].Parte;
            var Ubicacion = Object.values(data)[0].Ubicacion;
            var Link = Object.values(data)[0].Link;
            var Comentario = Object.values(data)[0].Comentario;
            var Precio = Object.values(data)[0].Precio;
            var Nuevo = Object.values(data)[0].Nuevo;
            var Usado = Object.values(data)[0].Usado;


            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("INSERT INTO gavetas (Clave,Planta,Familia,Marca,Grado,MedidaDiametro,Tipo,Descripcion,Parte,Ubicacion,Link,Comentarios,Precio,Cantidad,CantidadUsados)VALUES" +
                    "('" + Clave + "','" + Planta + "','" + Familia + "','" + Marca + "','" + Grado + "','" + MedidaDiametro + "','" + Tipo + "','" + Descripcion + "','" + Parte + "','" + Ubicacion + "','" + Link + "','" + Comentario + "','" + Precio + "'," + Nuevo + "," + Usado + ")", (err, Herramientas) => {
                        if (err) {
                            console.log('Error de lectura' + err);
                        } else {
                            res.json(true)
                        }

                    });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};


//Crea Producto Gaveta
Controller.EliminarGaveta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id

            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("delete from gavetas where id =" + id, (err, Herramientas) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                    } else {
                        res.json(true)
                    }
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.ListaFamiliasGaveta = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {

            console.log(req.session.nivel)
            if (req.session.nivel == 'Admin') {
                conn.query("SELECT DISTINCT Familia  FROM Gavetas", (err, Data) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                    }
                    res.json(Data);
                });
            } else {
                conn.query("SELECT DISTINCT Familia FROM Gavetas WHERE Planta= '" + req.session.planta + "'", (err, Data) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                    }
                    res.json(Data);
                });
            }
        });
    } else {
        res.redirect('/');
    }
};
///////// == GAVETA == ////////////////////////////// == GAVETA == ////////////////////////////// == GAVETA == ////////////////////////// == GAVETA == //////////////////// == GAVETA == ///////////////////// == GAVETA == ///////////////////////////////////////////////////////////////

Controller.MostrarRecoleccionGav = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Maquina
            } = req.params;
            let Planta = req.session.planta;
            conn.query("SELECT * FROM ProductoFlotante where Planta = 'Gaveta'", (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura' + err);
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.GuardarRecoleccionGaveta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Planta = "Gaveta"; //obeter datos de un objeto Planta
            let Usuario = req.session.nombre; //obeter datos de un objeto nombre
            var limite = Object.values(data)[0].length;
            for (var i = 0; i < limite; i++) {
                var id = Object.values(data)[0][i][0]; //obeter datos de un objeto id
                var Item = Object.values(data)[0][i][1]; //obeter datos de un objeto Item
                var Cantidad = Object.values(data)[0][i][2]; //obeter datos de un objeto Cantidad
                //console.log("id " + id + "','" + Item + "','" + Cantidad + "','" + Planta + "," + Usuario);

                console.log("id " + id + "','" + Item + "','" + Cantidad + "','" + Planta + "," + Usuario);
                conn.query("call Recolectar(" + id + ",'" + Item + "'," + Cantidad + ",'" + Planta + "','" + Usuario + "')", true, (err, rows, fields) => { });

            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};



///////// == AJUSTE == ////////////////////////////// == AJUSTE == ////////////////////////////// == AJUSTE == ////////////////////////// == AJUSTE == //////////////////// == AJUSTE == ///////////////////// == AJUSTE == ///////////////////////////////////////////////////////////////
Controller.searchAjuste = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Herra
            } = req.params;

            var Herramienta = Tranformer(Herra.split('|')[0]);
            var planta = "Almacen " + Herra.split('|')[1]; // Fecha inicial

            console.log("Salida: " + Herramienta + " Planta: " + planta);
            conn.query("SELECT * FROM almacen WHERE (producto LIKE '%" + Herramienta + "%' OR Clave LIKE '%" + Herramienta + "%') and Almacen = '" + planta + "'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Herramientas);
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


///////// == AJUSTE == ////////////////////////////// == AJUSTE == ////////////////////////////// == AJUSTE == ////////////////////////// == AJUSTE == //////////////////// == AJUSTE == ///////////////////// == AJUSTE == ///////////////////////////////////////////////////////////////
Controller.BuscarAlmacenEditar = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Herra
            } = req.params;


            var Herramienta = Tranformer(Herra);
            console.log(Herramienta)
            conn.query("SELECT * FROM almacen WHERE producto LIKE '%" + Herramienta + "%' OR Clave LIKE '%" + Herramienta + "%' order by Producto,almacen", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Herramientas);
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};




//=====================================================================================================================================================================================
///////// == Existencia == ////////////////////////////// == Existencia == ////////////////////////////// == Existencia == ////////////////////////// == Existencia == ////////////////
//=====================================================================================================================================================================================

Controller.ExistenciasAlmacenBasico = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            let consulta = "SELECT Clave,Producto,Almacen,Stock,StockMin,StockMax,StockUsado FROM almacen WHERE almacen != 'Gaveta' order by Almacen";

            conn.query(consulta, (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura' + err);
                } else {
                    console.table(Herramientas.length)
                    res.json(Herramientas)
                }

            });
        });
    } else {
        res.render('Admin/Login.html');
    }
}

//=====================================================================================================================================================================================
///////// == Existencia == ////////////////////////////// == Existencia == ////////////////////////////// == Existencia == ////////////////////////// == Existencia == ////////////////
//=====================================================================================================================================================================================

Controller.ExistenciaTotalAlmacen = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var Almacen = parametros.split('|')[0]; // categoria o tipo de reporte
            var Categoria = parametros.split('|')[1]; // Fecha inicial
            var Familia = parametros.split('|')[2]; // Fecha limite
            let PermisoPrecios = req.session.PermisoPrecios;

            Almacen == 'Todo' ? Almacen = ' IS not null' : Almacen = " = 'Almacen " + Almacen + "'";
            Categoria == 'Todo' ? Categoria = ' AND Categoria IS not null' : Categoria = " AND Categoria = '" + Categoria + "'";
            Familia == 'Todo' ? Familia = ' AND Familia IS not null' : Familia = " AND Familia = '" + Familia + "'";

            let consulta = "SELECT id,Clave,Producto,Proveedor,Precio,Moneda,TiempoEntrega,ProveedorSec,Almacen,Stock,StockMin,StockMax,StockUsado,Stockafilado,Familia,Categoria,Cotizado,OC FROM almacen WHERE VISIBLE = 1 AND Almacen" + Almacen + Categoria + Familia + " order by almacen";

            //console.log(consulta);
            conn.query(consulta, (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura' + err);
                }
                console.log(Herramientas)
                res.json([Herramientas, PermisoPrecios])
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.MostrarOcultos = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;

            let consulta = "SELECT id,Clave,Producto,Proveedor,Precio,Moneda,TiempoEntrega,ProveedorSec,Almacen,Stock,StockMin,StockMax,StockUsado,Familia,Categoria,Cotizado FROM almacen WHERE VISIBLE = 0 order by almacen";

            //console.log(consulta);
            conn.query(consulta, (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura' + err);
                }
                console.table(Herramientas.length)
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



Controller.OrdenProductoBuscar = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var Almacen = parametros
            //console.log(consulta);
            conn.query("SELECT * FROM OrdenCompra WHERE  Producto = '" + parametros + "'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura' + err);
                }
                console.table(Herramientas.length)
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};





Controller.RegistrarAccesorio = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Planta = "Almacen " + req.session.planta; //obeter datos de un objeto Planta
            let Usuario = req.session.nombre; //obeter datos de un objeto nombre

            let Tor_OC = Object.values(data)[0].Tor_OC;
            let Tor_OT = Object.values(data)[0].Tor_OT;
            let Tor_Producto = Object.values(data)[0].Tor_Producto;
            let Tor_PO = Object.values(data)[0].Tor_PO;
            let Tor_ENS = Object.values(data)[0].Tor_ENS;
            let Tor_Cantidad = Object.values(data)[0].Tor_Cantidad;
            let Tor_Ubicacion = Object.values(data)[0].Tor_Ubicacion;

            conn.query("INSERT INTO Accesorios(OCGemak,OT,Producto,POCliente,ENS,Cantidad,Ubicacion)VALUES" +
                "('" + Tor_OC + "','" + Tor_OT + "','" + Tor_Producto + "','" + Tor_PO + "','" + Tor_ENS + "','" + Tor_Cantidad + "','" + Tor_Ubicacion + "')", (err, Herramientas) => {
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

///////// == Accesorios == ////////////////////////////// == Accesorios == ////////////////////////////// == Accesorios == ////////////////////////// == Accesorios == //////////////////// == Accesorios
Controller.LeerAccesorios = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;

            console.log("variable: " + variable);
            conn.query("call LeerAccesorios('" + variable + "')", true, (err, rows, fields) => {
                if (err) {
                    console.log('Error al descontar almacen' + err);
                } else {
                    console.table(rows[0])
                    res.json(rows[0])
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.HistorialAccesorios = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;

            conn.query("SELECT A.OCGemak,A.OT,A.Producto,A.POCliente,A.ENS,F.Cantidad,F.Ubicacion,F.Entregado,F.Recibe FROM accesorios A, SalidaAccesorios F WHERE A.id = F.idAccesorio AND F.Folio = '" + variable + "'", (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura');
                }
                res.json(Herramientas);
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};




Controller.ActualizarAccesorios = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let POCliente = Object.values(data)[0][0][4]; //obeter datos de un objeto Estado
            let Notas = Object.values(data)[0][0][10]; //obeter datos de un objeto Maquina
            var limite = Object.values(data)[0].length || 0;
            for (var i = 0; i < limite; i++) {
                let id = Object.values(data)[0][i][0];
                let OCCompra = Object.values(data)[0][i][1]; //obeter datos de un objeto Folio
                let OT = Object.values(data)[0][i][2]; //obeter datos de un objeto Producto
                let Producto = Object.values(data)[0][i][3]; //obeter datos de un objeto Entregado
                let POCliente = Object.values(data)[0][i][4]; //obeter datos de un objeto Estado
                let ENS = Object.values(data)[0][i][5]; //obeter datos de un objeto OT
                let Cantidad = Object.values(data)[0][i][6]; //obeter datos de un objeto OT
                let Ubicacion = Object.values(data)[0][i][7]; //obeter datos de un objeto Maquina
                let Fecha = Object.values(data)[0][i][8]; //obeter datos de un objeto Maquina
                let Recibe = Object.values(data)[0][i][9]; //obeter datos de un objeto Maquina
                let Folio = Object.values(data)[0][i][11]; //obeter datos de un objeto Maquina

                conn.query("call DespacharAccesorio(" + id + "," + Cantidad + ",'" + Recibe + "')", true, (err, rows, fields) => {
                    if (err) {
                        res.json(err);
                        console.log('Error al actualizar accesorio' + err);
                    } else {
                        console.log('Se actualizó accesorio');
                        conn.query("INSERT INTO SalidaAccesorios(idAccesorio,Folio ,Ubicacion,Recibe,Cantidad)VALUES(" + id + ",'" + Folio + "','" + Ubicacion + "','" + Recibe + "'," + Cantidad + ")", (err, Herramientas) => {
                            if (err) {
                                console.log('Error de lectura' + err);
                            }
                        });
                    }
                });
                conn.query("call NotasAccesorios('" + POCliente + "','" + Notas + "')", true, (err, rows, fields) => {
                    if (err) {
                        res.json(err);
                        console.log('Error al actualizar notas' + err);
                    } else {
                        console.log('Se actualizó notas');
                    }
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.ImportarAccesorios = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            // console.log("Tamaño " + Object.values(data).length + " keys " +  Object.keys(data)[0] + " Valores " + Object.values(data)[0] +  " Valores dobles " + Object.values(data)[0][0]  + Object.values(data)[0][1]  + Object.values(data)[0][2]  );
            var limite = Object.values(data)[0].length;
            let PO = Object.values(data)[0][0][4];
            for (var i = 0; i < limite; i++) {
                let OCGemak = Object.values(data)[0][i][0];
                let OT = Object.values(data)[0][i][1];
                let Producto = Object.values(data)[0][i][2]; //obeter datos de un objeto Ordenado
                let PO = Object.values(data)[0][i][3];
                let ENS = Object.values(data)[0][i][4];
                let Cantidad = Object.values(data)[0][i][5];
                let Ubicacion = Object.values(data)[0][i][6]; //obeter datos de un objeto Ordenado

                console.log("OC: " + OCGemak + " OT: " + OT + " Producto: " + Producto + " PoCliente" + PO + " Ensamble: " + ENS + " Cantidad: " + Cantidad + " Ubicacion: " + Ubicacion);

                conn.query('INSERT INTO accesorios(OCGemak, OT, Producto, POCliente, ENS, Cantidad)values(?,?,?,?,?,?)', [OCGemak, OT, Producto, PO, ENS, Cantidad], (err, ot) => {
                    if (err) {
                        //res.json("Error json: " + err);
                        console.log('Error al registrar recepcion ' + err);
                    } else {
                        console.log('Recepciono exitosa: ' + OCGemak);
                    }
                });
            }

            conn.query('INSERT INTO NotaAccesorios(POCliente, Notas)values(?,?)', [PO, ''], (err, ot) => {
                if (err) {
                    //res.json("Error json: " + err);
                    console.log('Error al registrar recepcion ' + err);
                } else {
                    console.log('Nota añadida');
                }
            });
            res.json(true);
        });
    } else {
        res.render('Admin/Login.html');
    }
};

///////// == Accesorios == ////////////////////////////// == Accesorios == ////////////////////////////// == Accesorios == ////////////////////////// == Accesorios == //////////////////// == Accesorios
Controller.CargaCapturasPendientes = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;

            console.log("variable: " + variable);
            conn.query('SELECT * FROM Accesorios WHERE Cantidad > 0', (err, ot) => {
                if (err) {
                    //res.json("Error json: " + err);
                    console.log('Error al registrar recepcion ' + err);
                } else {
                    console.log('Nota añadida');
                    res.json(ot)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.CargaCapturasEntregado = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;

            console.log("variable: " + variable);
            conn.query('SELECT * FROM Accesorios WHERE Cantidad <= 0', (err, ot) => {
                if (err) {
                    //res.json("Error json: " + err);
                    console.log('Error al registrar recepcion ' + err);
                } else {
                    console.log('Nota añadida');
                    res.json(ot)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.FolioAccesorios = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;

            conn.query('select count(distinct Folio) AS Total  from salidaaccesorios', (err, data) => {
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


Controller.ActuaUbicacionAcces = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const data = req.body;
            var id = Object.values(data)[0].id;
            var Ubicacion = Object.values(data)[0].Ubicacion;
            console.log(id + " - " + Ubicacion)

            conn.query("UPDATE accesorios SET Ubicacion = '" + Ubicacion + "' WHERE id = " + id, (err, data) => {
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


Controller.EliminarAccesorio = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const data = req.body;
            var id = Object.values(data)[0].id;
            console.log(id + " - " + id)

            conn.query("DELETE FROM accesorios WHERE id = " + id, (err, data) => {
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





Controller.RegistrarTrabajoIn = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Planta = "Almacen " + req.session.planta; //obeter datos de un objeto Planta

            let Usuario = Object.values(data)[0].Usuario;
            let OT = Object.values(data)[0].OT;
            let PN = Object.values(data)[0].PN;
            let Articulo = Object.values(data)[0].Articulo;
            let Cantidad = Object.values(data)[0].Cantidad;
            let Instrucciones = Object.values(data)[0].Instrucciones;

            conn.query("INSERT INTO TrabajosIn(Usuario,OT,PN,Articulo,Cantidad,Instrucciones)VALUES" +
                "('" + Usuario + "','" + OT + "','" + PN + "','" + Articulo + "'," + Cantidad + ",'" + Instrucciones + "')", (err, Herramientas) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                    }
                    res.json(true);
                });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



///////// == Accesorios == ////////////////////////////// == Accesorios == ////////////////////////////// == Accesorios == ////////////////////////// == Accesorios == //////////////////// == Accesorios
Controller.LeerTrabajosIn = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;

            console.log("variable: " + variable);
            conn.query("SELECT * FROM trabajosin WHERE OT = '" + variable + "' OR PN = '" + variable + "' OR Articulo = '" + variable + "'", (err, data) => {
                if (err) {
                    console.log('Error de lectura' + err);
                }
                res.json(data)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.ActualizarTrabajoIn = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let POCliente = Object.values(data)[0][0][4]; //obeter datos de un objeto Estado
            let Notas = Object.values(data)[0][0][10]; //obeter datos de un objeto Maquina
            var limite = Object.values(data)[0].length || 0;
            for (var i = 0; i < limite; i++) {
                let id = Object.values(data)[0][i][0];
                let FechaRegistro = Object.values(data)[0][i][1]; //obeter datos de un objeto Folio
                let Usuario = Object.values(data)[0][i][2]; //obeter datos de un objeto Producto
                let OT = Object.values(data)[0][i][3]; //obeter datos de un objeto Entregado
                let PN = Object.values(data)[0][i][4]; //obeter datos de un objeto Estado
                let Articulo = Object.values(data)[0][i][5]; //obeter datos de un objeto OT
                let Cantidad = Object.values(data)[0][i][6]; //obeter datos de un objeto OT
                let Aprobado = Object.values(data)[0][i][7]; //obeter datos de un objeto Maquina
                let Entregado = Object.values(data)[0][i][8]; //obeter datos de un objeto Maquina
                let FechaEntrega = Object.values(data)[0][i][9]; //obeter datos de un objeto Maquina
                let Instrucciones = Object.values(data)[0][i][10]; //obeter datos de un objeto Maquina
                let Folio = Object.values(data)[0][i][11]; //obeter datos de un objeto Maquina


                conn.query("call DespacharTrabajoIn(" + id + "," + Cantidad + ")", true, (err, rows, fields) => {
                    if (err) {
                        res.json(err);
                        console.log('Error al actualizar accesorio' + err);
                    } else {
                        console.log('Se actualizó accesorio');
                        conn.query("INSERT INTO SalidaTrabajoIn(idTrabajoIn, Aprobado , Entregado, Folio, Cantidad)VALUES(" + id + ",'" + Aprobado + "','" + Entregado + "','" + Folio + "'," + Cantidad + ")", (err, data) => {
                            if (err) {
                                console.log('Error de lectura' + err);
                            }
                        });
                    }
                });
                conn.query("call InstruccionesTrabajoIn('" + OT + "','" + Instrucciones + "')", true, (err, rows, fields) => {
                    if (err) {
                        res.json(err);
                        console.log('Error al actualizar notas' + err);
                    } else {
                        console.log('Se actualizó notas');
                    }
                });


            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};





Controller.FolioTrabajoIn = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;

            conn.query('select count(distinct Folio) AS Total  from SalidaTrabajoIn', (err, data) => {
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
}


Controller.EliminarTrabajoIn = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const data = req.body;
            var id = Object.values(data)[0].id;
            console.log(id + " - " + id)

            conn.query("DELETE FROM TrabajosIn WHERE id = " + id, (err, data) => {
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



Controller.CargaCapturasEntregadoTI = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;
            conn.query("call CargaCapturasEntregadoTI()", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar accesorio' + err);
                } else {
                    console.table(rows[0])
                    res.json(rows[0])
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

///////// == Accesorios == ////////////////////////////// == Accesorios == ////////////////////////////// == Accesorios == ////////////////////////// == Accesorios == //////////////////// == Accesorios

Controller.CargaCapturasPendientesTI = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;
            conn.query("call CargaCapturasPorEntregarTI()", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar accesorio' + err);
                } else {
                    console.table(rows[0])
                    res.json(rows[0])
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};




Controller.AjusteBasico = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const data = req.body;
            var id = Object.values(data)[0].indice;
            var CantidadIngreso = Object.values(data)[0].Cantidad;
            var Nombre = Object.values(data)[0].Nombre;
            var CantidadAnterior = Object.values(data)[0].CantidadAnterior;
            var Producto = Object.values(data)[0].Producto;
            var Planta = Object.values(data)[0].Planta;
            var Estado = Object.values(data)[0].Estado;
            console.log(id + " - " + CantidadIngreso + Nombre + CantidadAnterior + Producto + Planta)

            conn.query("call AjusteBasico(" + id + ",'" + Producto + "','" + Planta + "','" + Nombre + "'," + CantidadIngreso + "," + CantidadAnterior + ",'" + Estado + "')", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar accesorio' + err);
                } else {
                    console.table(rows[0])
                    res.json(true)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.addCategoria = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(data)

            let Nombre = Object.values(data)[0].Nombre;
            let Planta = Object.values(data)[0].Planta;
            conn.query("INSERT INTO CategoriaAlmacen(Nombre,Planta)VALUES('" + Nombre + "','" + Planta + "')", (err, data) => {
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

Controller.addFamilia = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(data)

            let Nombre = Object.values(data)[0].Nombre;
            let Planta = Object.values(data)[0].Planta;
            conn.query("INSERT INTO CategoriaAlmacen(Nombre,Planta)VALUES('" + Nombre + "','" + Planta + "')", (err, data) => {
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


Controller.getCategoriaAlmacen = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;

            let consulta = "SELECT Nombre FROM CategoriaAlmacen WHERE Planta = 'General'";

            console.log(consulta);
            conn.query(consulta, (err, data) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura' + err);
                }
                console.table(data.length)
                res.json(data)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.getFamiliasAlmacen = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;

            let consulta = "SELECT * FROM CategoriaAlmacen WHERE Planta != 'General' order by Planta,Nombre";

            console.log(consulta);
            conn.query(consulta, (err, data) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura' + err);
                }
                console.table(data.length)
                res.json(data)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.getFamiliasAlmacenPlanta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;

            let consulta = "Select * from `categoriaalmacen` where Planta = '" + parametros + "' order by Nombre";

            console.log(consulta);
            conn.query(consulta, (err, data) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura' + err);
                }
                console.table(data.length)
                res.json(data)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.EliminarCategoria = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(data)
            let Nombre = Object.values(data)[0].Nombre;
            console.log("Eliminar" + Nombre)
            conn.query("DELETE FROM categoriaalmacen WHERE Nombre = '" + Nombre + "'", (err, data) => {
                if (err) {
                    console.log('Error de lectura ' + err);
                } else {
                    console.log(data)
                    res.json(true)
                }

            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.EliminarFamiliaAlmacen = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(data)
            let id = Object.values(data)[0].ID;
            console.log("Eliminar" + id)
            conn.query("DELETE FROM categoriaalmacen WHERE id = " + id, (err, data) => {
                if (err) {
                    console.log('Error de lectura ' + err);
                } else {
                    console.log(data)
                    res.json(true)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.OcultarFamilia = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(data)
            let id = Object.values(data)[0].ID;
            console.log("Eliminar" + id)

            conn.query("call OcultarFamilia(" + id + ")", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar accesorio' + err);
                } else {
                    console.table(rows[0])
                    res.json(true)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.CambiarCotizacion = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO

            let id = Object.values(data)[0].id;
            let estado = Object.values(data)[0].estado;
            console.log(data)
            console.log(id)
            console.log(estado)
            conn.query("UPDATE almacen SET Cotizado = " + estado + " WHERE id = " + id, (err, data) => {
                if (err) {
                    console.log('Error de lectura ' + err);
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


Controller.RegistrarOC = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO

            let Producto = Object.values(data)[0].Producto;
            let Cantidad = Object.values(data)[0].Cantidad;
            let OC = Object.values(data)[0].OC;
            let Identificador = Object.values(data)[0].Identificador;
            console.log(Producto)
            console.log(Cantidad)
            console.log(OC)
            console.log(Identificador)


            conn.query("call RegistrarOC('" + Producto + "','" + OC + "'," + Cantidad + "," + Identificador + ")", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar accesorio' + err);
                } else {
                    res.json(true)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};




Controller.ListaDeCotizaciones = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            let consulta = "select * from almacen WHERE Cotizado = true AND Ordenado = false";

            conn.query(consulta, (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura' + err);
                } else {
                    console.table(Herramientas.length)
                    res.json(Herramientas)
                }

            });
        });
    } else {
        res.render('Admin/Login.html');
    }
}



Controller.Ordenar = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO

            let IndiceProducto = Object.values(data)[0].IndiceProducto;
            let Cantidad = Object.values(data)[0].Cantidad;
            let Folio = Object.values(data)[0].Folio;
            console.log(IndiceProducto, Cantidad, Folio)
            conn.query("INSERT INTO Ordenado(idAlmacen,Cantidad,Folio)VALUES(" + IndiceProducto + "," + Cantidad + ",'" + Folio + "')", (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    conn.query("UPDATE almacen SET Ordenado = true WHERE id = " + IndiceProducto, (err, data) => {
                        if (err) {
                            console.log(err);
                        }
                        console.table(data)
                        res.json(data)
                        // res.json(Maquinas)
                    });
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.CancelarOrden = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO

            let IndiceProducto = Object.values(data)[0].IndiceProducto;

            conn.query("UPDATE almacen Set Cotizado = false, Ordenado = false WHERE id = " + IndiceProducto, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(data)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.CancelarOrdenados = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO

            let IndiceProducto = Object.values(data)[0].IndiceProducto;
            let Producto = Object.values(data)[0].Producto;
            let Almacen = Object.values(data)[0].Almacen;

            conn.query("call CancelarOrdenados(" + IndiceProducto + ",'" + Producto + "','" + Almacen + "')", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar accesorio' + err);
                } else {
                    console.table(rows[0])
                    res.json(true)
                }
            });

        });
    } else {
        res.render('Admin/Login.html');
    }
};




Controller.ActualizarOrdenar = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO

            let IndiceOrden = Object.values(data)[0].IndiceProducto;
            let Recibido = Object.values(data)[0].Recibido;
            let Factura = Object.values(data)[0].Factura;

            console.log(IndiceOrden, Recibido, Factura)

            conn.query("call ActualizarOrdenar(" + IndiceOrden + "," + Recibido + ",'" + Factura + "')", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar accesorio' + err);
                } else {
                    console.table(rows[0])
                    res.json(true)
                }
            });


        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.ListaDeOrdenes = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {


            conn.query("call ListaDeOrdenes()", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar accesorio' + err);
                } else {
                    console.table(rows[0])
                    res.json(rows[0])
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
}

Controller.MostrarRecepcion = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            conn.query("call MostrarRecepcion()", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar accesorio' + err);
                } else {
                    console.table(rows[0])
                    res.json(rows[0])
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
}

Controller.RecolectarAlmacen = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO

            let Recibido = Object.values(data)[0].Recibido;
            let idAlmacen = Object.values(data)[0].idAlmacen;
            let idOrdenado = Object.values(data)[0].idOrdenado;
            let idRecepcion = Object.values(data)[0].idRecepcion;

            console.log(Recibido + ',' + idAlmacen + ',' + idOrdenado)
            conn.query("call RecolectarAlmacen(" + Recibido + ',' + idAlmacen + ',' + idOrdenado + ',' + idRecepcion + ")", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar accesorio' + err);
                } else {
                    console.table(rows[0])
                    res.json(true)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



//============================================================================================================================================================================================================================================
///////// == REPORTE == ////////////////////////////// == REPORTE == ////////////////////////////// == REPORTE == ////////////////////////// == REPORTE == //////////////////// == REPORTE == ///////////////////// == REPORTE == ////////////
//============================================================================================================================================================================================================================================

Controller.ReporteRequeridos = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            /*   var Req_inicio = parametros.split('|')[0]; // categoria o tipo de reporte
              var Req_fin = parametros.split('|')[1]; // Fecha inicial */
            var Req_Almacen = parametros.split('|')[0]; // Fecha limite 

            conn.query("SELECT * from almacen WHERE Cotizado = true AND Almacen = '" + Req_Almacen + "'", (err, data) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(data)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


//============================================================================================================================================================================================================================================
///////// == REPORTE == ////////////////////////////// == REPORTE == ////////////////////////////// == REPORTE == ////////////////////////// == REPORTE == //////////////////// == REPORTE == ///////////////////// == REPORTE == ////////////
//============================================================================================================================================================================================================================================

Controller.ReporteOrdenados = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var Req_inicio = parametros.split('|')[0]; // categoria o tipo de reporte
            var Req_fin = parametros.split('|')[1]; // Fecha inicial 

            conn.query("SELECT o.id,a.Producto, a.Stock, a.Almacen, o.Cantidad,o.Folio,o.Factura,o.FechaOrdenado,o.Estatus  FROM almacen a, ordenado o WHERE a.id = o.idAlmacen AND o.Recibido < o.Cantidad AND o.FechaOrdenado BETWEEN '" + Req_inicio + "' AND '" + Req_fin + "'", (err, data) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                console.log(data);
                res.json(data)
            });

        });
    } else {
        res.render('Admin/Login.html');
    }
};



Controller.RecolectarBasico = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const data = req.body;
            var id = Object.values(data)[0].indice;
            var Nombre = Object.values(data)[0].Nombre;
            var CantidadAnterior = Object.values(data)[0].CantidadAnterior;
            var Producto = Object.values(data)[0].Producto;
            var Planta = "Almacen " + Object.values(data)[0].Planta;
            var Ingreso = Object.values(data)[0].Ingreso;
            var CantidadFinal = Object.values(data)[0].CantidadFinal;


            console.log(id + " - " + CantidadFinal + Nombre + CantidadAnterior + Producto + Planta + Ingreso)

            conn.query("call RecolectarBasico(" + id + ",'" + Producto + "','" + Planta + "','" + Nombre + "'," + CantidadAnterior + "," + Ingreso + "," + CantidadFinal + ")", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar accesorio' + err);
                } else {
                    console.table(rows[0])
                    res.json(true)
                }
            });

        });
    } else {
        res.render('Admin/Login.html');
    }
};


//============================================================================================================================================================================================================================================
///////// == REPORTE == ////////////////////////////// == REPORTE == ////////////////////////////// == REPORTE == ////////////////////////// == REPORTE == //////////////////// == REPORTE == ///////////////////// == REPORTE == ////////////
//============================================================================================================================================================================================================================================

Controller.repRecolectarBasico = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var fechaInicio = parametros.split('|')[0]; // Fecha inicial
            var fechafin = parametros.split('|')[1]; // Fecha limite
            var Almacen = "Almacen " + parametros.split('|')[2]; // Almacen

            conn.query("SELECT * FROM HisRecoleccionBasica WHERE Planta = '" + Almacen + "' AND Fecha BETWEEN '" + fechaInicio + "' AND '" + fechafin + "'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura' + err);
                }
                console.log(Herramientas);
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.getProveedores = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            let consulta = "select * from Proveedores order by Nombre asc";

            conn.query(consulta, (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura' + err);
                } else {
                    console.table(Herramientas.length)
                    res.json(Herramientas)
                }

            });
        });
    } else {
        res.render('Admin/Login.html');
    }
}


Controller.BuscarHerrRetornoGaveta = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Param
            } = req.params;

            conn.query("select * from SalidaGaveta WHERE(Producto LIKE '%" + Param + "%' OR OT = '" + Param + "' OR Empleado like'%" + Param + "%') AND Devuelto < Entregado order by salida desc", (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura' + err);
                } else {
                    res.json(Herramientas)
                }

            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



Controller.GuardarNotaRetornoGaveta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data));
            var limite = Object.values(data)[0].length;
            for (var i = 0; i < limite; i++) {
                let Folio = Object.values(data)[0][i][0]; //[No se][indice de fila][indice de columna]
                let Producto = Object.values(data)[0][i][1]; //[No se][indice de fila][indice de columna]
                let Cantidad = Object.values(data)[0][i][2]; //[No se][indice de fila][indice de columna]
                let Estado = Object.values(data)[0][i][3]; //[No se][indice de fila][indice de columna]
                let Empleado = Object.values(data)[0][i][4]; //[No se][indice de fila][indice de columna]
                let Maquina = Object.values(data)[0][i][5]; //[No se][indice de fila][indice de columna]
                let Comentarios = Object.values(data)[0][i][6]; //[No se][indice de fila][indice de columna]
                let FolioSalida = Object.values(data)[0][i][7]; //[No se][indice de fila][indice de columna]
                let idHerramienta = Object.values(data)[0][i][8]; //[No se][indice de fila][indice de columna]
                let Movimiento = 'Retorno';
                let Planta = req.session.planta;
                let Usuario = req.session.username;
                //console.log("Producto : " + Producto + " Cantidad a retornar: " + Cantidad);
                //console.log(Folio + " - " + Producto + " - " + Cantidad + " - " + Estado + " - " + OT + " - " + Maquina + " - " + Empleado + " - " + Turno + " - " + Comentarios + " - " + Movimiento + " - " + Planta + " - " + Usuario)
                conn.query('INSERT INTO RetornoGaveta(Folio,Producto,Cantidad,Estado,Empleado,Maquina,Comentarios,Movimiento,Usuario,Planta)values(?,?,?,?,?,?,?,?,?,?)', [Folio, Producto, Cantidad, Estado, Empleado, Maquina, Comentarios, Movimiento, Usuario, Planta], (err, ot) => {
                    if (err) {
                        console.log('Error al registrar despacho de herramienta');
                    }
                    conn.query("call GavetaRetorno(" + Cantidad + ",'" + Producto + "','" + Estado + "','" + Maquina + "','" + FolioSalida + "','" + Planta + "'," + idHerramienta + ",'" + Comentarios + "')", true, (err, rows, fields) => {
                        if (err) {
                            console.log('Error al descontar almacen' + err);
                        } else {
                            console.log('Se Resto del almacen' + Object.values(rows));
                        }
                        conn.query("call IncrementarFolioRetornoAlmacen('" + Folio + "');", true, (err, rows, fields) => {
                            if (err) {
                                console.log('Error al registrar folios' + err);
                            } else {
                                console.log('Se incremento folio');
                            }
                        });
                    });
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.ExistenciasGaveta = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Almacen
            } = req.params;
            let Planta = req.session.planta;
            let PermisoPrecios = req.session.PermisoPrecios;

            console.log('Consultar' + Almacen);
            if (Almacen == 'Todo') {
                conn.query("SELECT * FROM gavetas order by Planta,Clave", (err, Herramientas) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                    }
                    res.json([Herramientas, PermisoPrecios])
                });
            } else {
                conn.query("SELECT * FROM gavetas where Planta = '" + Almacen + "' order by Clave", (err, Herramientas) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                    }
                    res.json([Herramientas, PermisoPrecios])
                });
            }

        });
    } else {
        res.render('Admin/Login.html');
    }
};



//============================================================================================================================================================================================================================================
///////// == REPORTE == ////////////////////////////// == REPORTE == ////////////////////////////// == REPORTE == ////////////////////////// == REPORTE == //////////////////// == REPORTE == ///////////////////// == REPORTE == ////////////
//============================================================================================================================================================================================================================================

/* Controller.ListadoDespacho = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var fechaInicio = parametros.split('|')[0]; // Fecha inicial
            var fechafin = parametros.split('|')[1]; // Fecha limite

            conn.query("SELECT DISTINCT Producto,Almacen FROM itemprestado WHERE Salida BETWEEN '" + fechaInicio + "' AND '" + fechafin + "' ORDER BY Almacen", (err, Herramientas) => {
                if (err) {
                    res.json(err);
                    console.log('Error ListadoDespacho');
                    console.log(err);
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
}; */


Controller.ListadoDespacho = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var Mes = parametros.split('|')[0]; // Fecha inicial
            var ano = parametros.split('|')[1]; // Fecha limite
            var Planta = parametros.split('|')[2]; // Fecha limite
            var Almacen = "Almacen " + Planta


            conn.query("call ListadoDespacho(" + Mes + "," + ano + ",'" + Planta + "','" + Almacen + "')", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar accesorio ' + err);
                } else {
                    //console.table(rows) 
                    res.json(rows)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};




Controller.MinCritico = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            const planta = "Almacen " + req.session.planta;

            conn.query("SELECT * FROM Almacen WHERE Stock <= StockMin and Almacen = '" + planta + "' order by almacen", (err, Herramientas) => {
                if (err) {
                    res.json(err);
                    console.log('Error ListadoDespacho');
                    console.log(err);
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.SumaMensual = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var Producto = parametros.split('|')[0]; // Fecha inicial
            var Mes = parametros.split('|')[1]; // Fecha limite
            var Almacen = parametros.split('|')[2]; // Fecha limite
            //console.log("SELECT SUM(Utilizado), Producto FROM itemprestado WHERE Producto = '"+Producto+"' AND MONTH(Salida) = "+Mes)

            conn.query("SELECT SUM(Utilizado) as Utilizado, Producto FROM itemprestado WHERE Producto = '" + Producto + "' AND MONTH(Salida) = " + Mes + " AND Almacen = '" + Almacen + "'", (err, Herramientas) => {
                if (err) {
                    res.json(err);
                    console.log('Error de lectura');
                    console.log(err);
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



Controller.DetalleHerramienta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var Producto = parametros.split('|')[0]; // Fecha inicial 
            var Almacen = "Almacen " + parametros.split('|')[1]; // Fecha limite
            //console.log("SELECT SUM(Utilizado), Producto FROM itemprestado WHERE Producto = '"+Producto+"' AND MONTH(Salida) = "+Mes)

            conn.query("select Clave,Producto,Almacen,Stock,StockMin,StockMax,Familia,Precio,Moneda,Proveedor from almacen where Producto = '" + Producto + "' AND Almacen = '" + Almacen + "'", (err, Herramientas) => {
                if (err) {
                    res.json(err);
                    console.log('Error de lectura');
                    console.log(err);
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



Controller.TodoDespachos = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;

            //console.log("SELECT SUM(Utilizado), Producto FROM itemprestado WHERE Producto = '"+Producto+"' AND MONTH(Salida) = "+Mes)

            conn.query("select * from itemprestado", (err, Herramientas) => {
                if (err) {
                    res.json(err);
                    console.log('Error de lectura');
                    console.log(err);
                }

                console.log(Herramientas)
                res.json(Herramientas)

            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.reporteAjustesGaveta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var fechaInicio = parametros.split('|')[0]; // Fecha inicial
            var fechafin = parametros.split('|')[1]; // Fecha limite
            var Almacen = parametros.split('|')[2]; // Almacen

            conn.query("SELECT * FROM reporteajustebasicogaveta WHERE Almacen = '" + Almacen + "' AND FechaAjuste BETWEEN '" + fechaInicio + "' AND '" + fechafin + "'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                console.log(Herramientas);
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};








Controller.DashboardStatus = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;

            //console.log("SELECT SUM(Utilizado), Producto FROM itemprestado WHERE Producto = '"+Producto+"' AND MONTH(Salida) = "+Mes)

            conn.query("call DashboardStatus()", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar accesorio' + err);
                } else {
                    console.table(rows[0])
                    res.json(rows[0])
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};




Controller.TopDespachos = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;

            //console.log("SELECT SUM(Utilizado), Producto FROM itemprestado WHERE Producto = '"+Producto+"' AND MONTH(Salida) = "+Mes)

            conn.query("call TopDespachos()", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar accesorio' + err);
                } else {
                    console.table(rows[0])
                    res.json(rows[0])
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



///////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////// == SALIDA == //////////////////// == SALIDA == ///////////////////// == SALIDA == ///////////////////////////////////////////////////////////////
Controller.BuscarHerramental = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Clave
            } = req.params;
            let planta = req.session.planta;

            conn.query("SELECT * FROM Herramienta WHERE (Clave like '%" + Clave + "%' or Descripcion like '%" + Clave + "%') and (Planta = '" + planta + "' ) AND (Estado != 'Dañado'  or Estado is null)", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Herramientas);
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



Controller.GuardarNotaHerramienta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO

            var limite = Object.values(data)[0].length;
            console.log("Limite: " + limite);
            for (var i = 0; i < limite; i++) {
                let idH = Object.values(data)[0][i][0]; //obeter datos de un objeto Folio
                let Planta = Object.values(data)[0][i][1]; //obeter datos de un objeto Producto
                let Clave = Object.values(data)[0][i][2]; //obeter datos de un objeto Entregado
                let Estado = Object.values(data)[0][i][3]; //obeter datos de un objeto Estado
                let OT = Object.values(data)[0][i][4]; //obeter datos de un objeto OT
                let Nomina = Object.values(data)[0][i][5]; //obeter datos de un objeto OT
                let Empleado = Object.values(data)[0][i][6]; //obeter datos de un objeto Maquina
                let Familia = Object.values(data)[0][i][7]; //obeter datos de un objeto Empleado
                let Maquina = Object.values(data)[0][i][8]; //obeter datos de un objeto Comentario
                let Comentario = Object.values(data)[0][i][9]; //obeter datos de un objeto Comentario
                let Descripcion = Object.values(data)[0][i][10]; //obeter datos de un objeto Comentario

                let Movimiento = 'Despacho';
                let Usuario = req.session.username;

                conn.query("call SPDespachoHerramienta('" + idH + "','" + Planta + "','" + Clave + "','" + Estado + "','" + OT + "','" + Nomina + "','" + Empleado + "','"
                    + Familia + "','" + Maquina + "','" + Comentario + "','" + Movimiento + "','" + Usuario + "','" + Descripcion + "');", true, (err, rows, fields) => {
                        if (err) {
                            console.log('Error al registrar folios' + err);
                        }
                    });
            }
            res.json(true);
        });
    } else {
        res.render('Admin/Login.html');
    }
};


///////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////// == SALIDA == //////////////////// == SALIDA == ///////////////////// == SALIDA == ///////////////////////////////////////////////////////////////
Controller.BuscarDespachoUnico = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Clave
            } = req.params;

            conn.query("SELECT * FROM DespachoHerramienta WHERE idHerramienta = " + Clave + " ORDER by id DESC LIMIT 1", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Herramientas);
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};




Controller.GuardarRetornoHerramienta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO

            var limite = Object.values(data)[0].length;
            console.log("Limite: " + limite);
            for (var i = 0; i < limite; i++) {
                let R_id = Object.values(data)[0][i][0]; //obeter datos de un objeto Folio
                let R_Planta = Object.values(data)[0][i][1]; //obeter datos de un objeto Producto
                let R_Clave = Object.values(data)[0][i][2]; //obeter datos de un objeto Entregado
                let R_OT = Object.values(data)[0][i][3]; //obeter datos de un objeto Estado
                let R_Maquina = Object.values(data)[0][i][4]; //obeter datos de un objeto OT
                let R_Fecha = Object.values(data)[0][i][5]; //obeter datos de un objeto OT
                let R_Estado = Object.values(data)[0][i][6]; //obeter datos de un objeto Maquina
                let R_Nomina = Object.values(data)[0][i][7]; //obeter datos de un objeto Empleado
                let R_Empleado = Object.values(data)[0][i][8]; //obeter datos de un objeto Comentario
                let R_Comentario = Object.values(data)[0][i][9]; //obeter datos de un objeto Comentario
                let R_Descripcion = Object.values(data)[0][i][10]; //obeter datos de un objeto Comentario

                let Movimiento = 'Retorno';
                let Usuario = req.session.username;

                conn.query("call SPRetornoHerramienta('" + R_id + "','" + R_Planta + "','" + R_Clave + "','" + R_Estado + "','" + R_OT + "','" + R_Nomina + "','" + R_Empleado + "','"
                    + R_Maquina + "','" + R_Comentario + "','" + Movimiento + "','" + Usuario + "','" + R_Descripcion + "');", true, (err, rows, fields) => {
                        if (err) {
                            console.log('Error al registrar folios' + err);
                        } else {
                            res.json(true);
                        }
                    });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};




Controller.TipoReporteHerramental = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var categoria = parametros.split('|')[0]; // categoria o tipo de reporte
            var fechaInicio = parametros.split('|')[1]; // Fecha inicial
            var fechafin = parametros.split('|')[2]; // Fecha limite
            var Almacen = parametros.split('|')[3]; // Almacen
            console.log("SELECT * FROM " + categoria + " WHERE Planta = '" + Almacen + "' AND Fecha BETWEEN '" + fechaInicio + "' AND '" + fechafin + "'")

            conn.query("SELECT * FROM " + categoria + " WHERE Planta = '" + Almacen + "' AND Fecha BETWEEN '" + fechaInicio + "' AND '" + fechafin + "'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.TipoReporteHerramentalFiltro = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var categoria = parametros.split('|')[0]; // categoria o tipo de reporte
            var Argumento = parametros.split('|')[1]; // Fecha inicial 
            var Almacen = parametros.split('|')[2]; // Almacen 

            conn.query("SELECT * FROM " + categoria + " WHERE Planta = '" + Almacen + "' AND (Clave like '%" + Argumento + "%' OR Nomina like '%" + Argumento + "%' OR Descripcion like '%" + Argumento + "%')", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.BuscarHerramentalID = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            console.log("parametros: " + parametros);
            conn.query("SELECT * FROM Herramienta WHERE id = " + parametros, (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura ' + err);
                } else {
                    console.log(Herramientas);
                    res.json(Herramientas);
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.HerramentalClave = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            console.log("parametros: " + parametros);
            conn.query("SELECT * FROM Herramienta WHERE Clave = '" + parametros + "'", (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura ' + err);
                } else {
                    console.log(Herramientas);
                    res.json(Herramientas);
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


//Editar Herramental
Controller.GuardarCambiosHerramental = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO 

            var id = Object.values(data)[0].id; //obeter datos de un objeto id
            var Clave = Object.values(data)[0].Clave; //obeter datos de un objeto id
            var Descripcion = Object.values(data)[0].Descripcion; //obeter datos de un objeto id
            var Planta = Object.values(data)[0].Planta;
            var Diametro = Object.values(data)[0].Diametro;
            var Caracteristicas = Object.values(data)[0].Caracteristicas;
            var Codigo = Object.values(data)[0].Codigo;
            var Inserto = Object.values(data)[0].Inserto;
            var Marca = Object.values(data)[0].Marca;
            var Seat = Object.values(data)[0].Seat;
            var Clamp = Object.values(data)[0].Clamp;
            var Screw = Object.values(data)[0].Screw;
            var Comentario = Object.values(data)[0].Comentario;

            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("UPDATE Herramienta SET Clave= '" + Clave + "',Planta='" + Planta + "',Descripcion='" + Descripcion + "',Diametro='" + Diametro + "',Caracteristicas='" + Caracteristicas + "',Codigo='" + Codigo +
                    "',Inserto='" + Inserto + "',Marca='" + Marca + "',Seat='" + Seat + "',Clamp='" + Clamp + "',Screw='" + Screw + "',Comentario='" + Comentario + "' WHERE id = " + id, (err, Herramientas) => {
                        if (err) {
                            console.log('Error de lectura' + err);
                        } else {
                            res.json(true)
                        }

                    });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};


//Crea Producto Gaveta
Controller.EliminarHerramental = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id

            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("delete from Herramienta where id =" + id, (err, Herramientas) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                    } else {
                        res.json(true)
                    }
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};


//Crea Producto Herramental
Controller.GuardarNuevoHerramental = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO

            var Clave = Object.values(data)[0].Clave; //obeter datos de un objeto id
            var Descripcion = Object.values(data)[0].Descripcion; //obeter datos de un objeto id
            var Planta = Object.values(data)[0].Planta;
            var Diametro = Object.values(data)[0].Diametro;
            var Caracteristicas = Object.values(data)[0].Caracteristicas;
            var Codigo = Object.values(data)[0].Codigo;
            var Inserto = Object.values(data)[0].Inserto;
            var Marca = Object.values(data)[0].Marca;
            var Seat = Object.values(data)[0].Seat;
            var Clamp = Object.values(data)[0].Clamp;
            var Screw = Object.values(data)[0].Screw;
            var Comentario = Object.values(data)[0].Comentario;

            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("INSERT INTO Herramienta (Clave,Descripcion,Planta,Diametro,Caracteristicas,Codigo,Inserto,Marca,Seat,Clamp,Screw,Comentario)VALUES" +
                    "('" + Clave + "','" + Descripcion + "','" + Planta + "','" + Diametro + "','" + Caracteristicas + "','" + Codigo + "','" + Inserto + "','" + Marca + "','" + Seat + "','" + Clamp + "','" + Screw + "','" + Comentario + "')", (err, Herramientas) => {
                        if (err) {
                            res.json(false)
                            console.log('Error de lectura' + err);
                        } else {
                            res.json(true)
                        }
                    });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.EstadoActualHerramental = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var Almacen = parametros.split('|')[0]; // Almacen
            var categoria = parametros.split('|')[1]; // categoria o tipo de reporte 


            if (Almacen == 'Todo' && categoria == 'Completo') {//Almacen Completo
                conn.query("SELECT * FROM Herramienta order by Maquina", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    }
                    res.json(Herramientas)
                });
            } else if (Almacen == 'Todo' && categoria == 'Almacen') {//Herramienta ambas plantas en almacen
                conn.query("SELECT * FROM Herramienta where Cantidad = 1", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    }
                    res.json(Herramientas)
                });
            } else if (Almacen == 'Todo' && categoria == 'Maquina') {//Herramienta ambas plantas en maquinas
                conn.query("SELECT * FROM Herramienta where Cantidad = 0 order by Maquina", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    }
                    res.json(Herramientas)
                });
            } else if (Almacen != 'Todo' && categoria == 'Completo') {//Herramienta 1 planta Completa
                conn.query("SELECT * FROM Herramienta where Planta = '" + Almacen + "' order by Maquina", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    }
                    res.json(Herramientas)
                });
            } else if (Almacen != 'Todo' && categoria == 'Almacen') {//Herramienta 1 planta en almacen
                conn.query("SELECT * FROM Herramienta where Cantidad = 1 AND Planta = '" + Almacen + "'", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    }
                    res.json(Herramientas)
                });
            } else if (Almacen != 'Todo' && categoria == 'Maquina') {//Herramienta 1 planta en Maquina
                conn.query("SELECT * FROM Herramienta where Cantidad = 0 AND Planta = '" + Almacen + "' order by Maquina", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    }
                    res.json(Herramientas)
                });
            } else {
                res.json([0])
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.HerramentalDano = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var Planta = parametros.split('|')[0]; // Almacen
            var inicio = parametros.split('|')[1]; // categoria o tipo de reporte 
            var Fin = parametros.split('|')[2]; // categoria o tipo de reporte 

            if (Planta == 'Todo') {
                conn.query("SELECT * FROM RetornoHerramental where Estado = 'Dañado' AND Fecha BETWEEN '" + inicio + "' AND '" + Fin + "'", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    } else {
                        res.json(Herramientas)
                    }
                });
            } else {
                conn.query("SELECT * FROM RetornoHerramental where Planta = '" + Planta + "' AND Estado = 'Dañado' AND Fecha BETWEEN '" + inicio + "' AND '" + Fin + "'", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    } else {
                        res.json(Herramientas)
                    }
                });
            }

        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.GuardarPDFDanado = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const data = req.body;

            var Clave = Object.values(data)[0].Clave;
            var Planta = Object.values(data)[0].Planta;
            var OT = Object.values(data)[0].OT;
            var Fecha = Object.values(data)[0].Fecha;
            var Descripcion = Object.values(data)[0].Descripcion;
            var Comentario = Object.values(data)[0].Comentario;
            var Causante = Object.values(data)[0].Causante;
            var ResponsableH = Object.values(data)[0].ResponsableH;
            var ResponsableP = Object.values(data)[0].ResponsableP;
            var SelectNegligencia = Object.values(data)[0].SelectNegligencia;
            var PDFDano = 1;
            console.log(Fecha + " - " + Clave + Causante + ResponsableP)


            conn.query("call GuardarPDFDanado('" + Clave + "','" + Planta + "','" + OT + "','" + Descripcion + "','" + Comentario + "','" + Causante + "','" + ResponsableH + "','" + ResponsableP + "'," + PDFDano + ",'" + SelectNegligencia + "')", true, (err, rows, fields) => {
                if (err) {
                    res.json(err);
                    console.log('Error al actualizar notas' + err);
                } else {
                    res.json(true);
                    console.log('Se actualizó notas');
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};





Controller.HistorialReportesDaños = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;

            conn.query("SELECT * FROM PDFHerramientaDanada where Clave = '" + parametros + "' ORDER by id DESC LIMIT 1", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                } else {
                    console.log(Herramientas);
                    res.json(Herramientas)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



///////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////// == SALIDA == //////////////////// == SALIDA == ///////////////////// == SALIDA == ///////////////////////////////////////////////////////////////
Controller.BuscarHerramientasUbicacion = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Ubicacion
            } = req.params;

            const planta = req.session.planta;
            const area = req.session.area;

            if (area == 'Admin') {
                console.log("Entre como admin")
                conn.query("SELECT * FROM gavetas where ubicacion = '" + Ubicacion + "'", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    }
                    res.json(Herramientas);
                });
            } else {
                conn.query("SELECT * FROM gavetas where ubicacion = '" + Ubicacion + "' AND Planta = '" + planta + "'", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    }
                    res.json(Herramientas);
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};



//Se registra una auditoria
Controller.RegistrarAuditoria = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id
            var Cantidad = Object.values(data)[0].Cantidad; //obeter datos de un objeto Clave
            var CantidadAjuste = Object.values(data)[0].CantidadAjuste; //obeter datos de un objeto Producto 
            var Planta = Object.values(data)[0].Planta; //obeter datos de un objeto Producto 
            var Ubicacion = Object.values(data)[0].Ubicacion; //obeter datos de un objeto Producto 
            var Clave = Object.values(data)[0].Clave; //obeter datos de un objeto Producto 
            var Descripcion = Object.values(data)[0].Descripcion; //obeter datos de un objeto Producto 
            var Comentario = Object.values(data)[0].Comentario; //obeter datos de un objeto Producto 
            const nombre = req.session.nombre;

            console.log("id " + id + "','" + Cantidad + "','" + CantidadAjuste + "," + nombre);
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("call SPRegistrarAuditoria(" + id + "," + Cantidad + "," + CantidadAjuste + ",'" + nombre + "','" + Planta + "','" + Ubicacion + "','" + Clave + "','" + Descripcion + "','" + Comentario + "');", true, (err, rows, fields) => {
                    if (err) {
                        console.log('Error al registrar folios' + err);
                        res.json(false);
                    } else {
                        res.json(true);
                    }
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};



Controller.MostrarAuditoria = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Ubicacion
            } = req.params;

            const planta = "Almacen " + req.session.planta;
            const area = req.session.area;
            conn.query("select * from AuditoriaGavetas where ubicacion = '" + Ubicacion + "' order by FechaAjuste desc", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Herramientas);
            });

        });
    } else {
        res.render('Admin/Login.html');
    }
};



//Se registra una auditoria
Controller.ResumenAuditoria = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {

            const planta = req.session.planta;
            console.log(planta)
            conn.query("call ResumenAuditoria('" + planta + "');", true, (err, rows, fields) => {
                if (err) {
                    console.log('Error al sp: ' + err);
                    res.json(false);
                } else {
                    console.log(rows[0]);
                    res.json(rows[0])
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.ConsultaArticulosNuevos = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Articulo
            } = req.params;
            console.log("con data")

            if (Articulo == '-') {
                console.log("con data")
                conn.query("select * from almacen order by FechaCreacion desc", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    }
                    res.json(Herramientas);
                });
            } else {
                console.log("sin data")
                conn.query("select * from almacen where Clave like '%" + Articulo + "%' order by FechaCreacion desc", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    }
                    res.json(Herramientas);
                });
            }


        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.BuscarHerramienta = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Herra
            } = req.params;
            var Herramienta = TranformerReporte(Herra.split('|')[0]);
            const planta = "Almacen " + req.session.planta;
            conn.query("SELECT * FROM almacen WHERE producto = '" + Herramienta + "' AND Almacen = '" + planta + "'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                console.log("Herramienta a buscar: " + Herramienta);
                console.log(Herramientas);
                res.json(Herramientas);
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



//============================================================================================================================================================================================================================================
///////// == REPORTE Herramienta == ////////////////////////////// == REPORTE Herramienta == ////////////////////////////// == REPORTE Herramienta == ////////////////////////// == REPORTE Herramienta == //////////////////// == REPORTE Herramienta == ///////////////////// == REPORTE == ////////////
//============================================================================================================================================================================================================================================
Controller.ReporteConsumoBasico = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                Herramienta
            } = req.params;

            /*   var Articulo = TranformerReporte(Herramienta.split('|')[0]); */
            var fechaInicio = Herramienta.split('|')[0]; // Fecha inicial
            var fechafin = Herramienta.split('|')[1]; // Fecha limite
            var Planta = Herramienta.split('|')[2]; // Fecha limite
            var descripcion = Herramienta.split('|')[3]; // Fecha limite
            var Almacen = "Almacen " + Planta; // Fecha limite
            let PermisoPrecios = req.session.PermisoPrecios;

            // console.log("Articulo: " + Articulo + " con fecha " + fechaInicio + " y " + fechafin + "  es de " + Almacen)

            if (fechaInicio == null || fechaInicio == '') {
                console.log("sin fecha ")
                conn.query("SELECT * FROM itemprestado WHERE (Producto like '%" + Articulo + "%' OR OT = '" + Articulo + "') AND Almacen = '" + Almacen + "' ORDER BY Salida Desc", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura' + err);
                    }
                    res.json([Herramientas, PermisoPrecios])
                });
            } else if (descripcion == null || descripcion == '') {
                console.log("Articulo: " + " con fecha " + fechaInicio + " y " + fechafin + "  es de " + Almacen + "descripcion " + descripcion)
                conn.query("SELECT SUM(i.Utilizado) AS Total,i.Producto,a.Clave,a.Familia,a.Almacen,a.Stock,a.StockMin,a.StockMax,a.StockUsado,a.StockAfilado,a.Precio,a.Moneda,a.OC, a.Proveedor,a.TiempoEntrega FROM itemprestado i INNER JOIN almacen a where (i.Producto = a.Producto) AND (i.Almacen = '" + Planta + "' AND a.Almacen = '" + Almacen + "') AND (i.Salida) BETWEEN '" + fechaInicio + "' AND '" + fechafin + "' group by i.Producto;", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura' + err);
                    }
                    console.log(Herramientas);
                    res.json([Herramientas, PermisoPrecios])
                });
            } else {
                console.log("Articulo: " + " con fecha " + fechaInicio + " y " + fechafin + "  es de " + Almacen + "descripcion " + descripcion)
                conn.query("SELECT SUM(i.Utilizado) AS Total,i.Producto,a.Clave,a.Familia,a.Almacen,a.Stock,a.StockMin,a.StockMax,a.StockUsado,a.StockAfilado,a.Precio,a.Moneda,a.OC, a.Proveedor,a.TiempoEntrega FROM itemprestado i INNER JOIN almacen a where (i.Producto = '" + descripcion + "') AND (i.Producto = a.Producto) AND (i.Almacen = '" + Planta + "' AND a.Almacen = '" + Almacen + "') AND (i.Salida) BETWEEN '" + fechaInicio + "' AND '" + fechafin + "' group by i.Producto;", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura' + err);
                    }
                    console.log(Herramientas);
                    res.json([Herramientas, PermisoPrecios])
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};




Controller.ReporteHerramientaIngresos = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                Herramienta
            } = req.params;

            var Articulo = TranformerReporte(Herramienta.split('|')[0]);
            var fechaInicio = Herramienta.split('|')[1]; // Fecha inicial
            var fechafin = Herramienta.split('|')[2]; // Fecha limite
            var Almacen = Herramienta.split('|')[3]; // Fecha limite

            console.log("Articulo: " + Articulo + " con fecha " + fechaInicio + " y " + fechafin + "  es de " + Almacen)

            //Reporte solo Articulo sin fecha
            if (fechaInicio == null || fechaInicio == '') {
                console.log("sin fecha ")
                conn.query("select * from AjustebasicoAlmacen WHERE Producto LIKE '%" + Articulo + "%' AND Planta = '" + Almacen + "' order by FechaAjuste desc", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura' + err);
                    }
                    console.log(Herramientas);
                    res.json(Herramientas)
                });
            } else {//Reporte Articulo Con fecha
                console.log("Articulo: " + Articulo + " con fecha " + fechaInicio + " y " + fechafin + "  es de " + Almacen)
                conn.query("select * from AjustebasicoAlmacen WHERE Producto LIKE '%" + Articulo + "%' AND Planta = '" + Almacen + "' AND FechaAjuste BETWEEN '" + fechaInicio + "' AND  '" + fechafin + "'  order by FechaAjuste asc", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura' + err);
                    }
                    console.log(Herramientas);
                    res.json(Herramientas)
                });
            }



        });
    } else {
        res.render('Admin/Login.html');
    }
};



///////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////// == SALIDA == //////////////////// == SALIDA == ///////////////////// == SALIDA == ///////////////////////////////////////////////////////////////
Controller.BuscarHerramientasOC = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                Herra
            } = req.params;
            var Herramienta = Tranformer(Herra);
            const planta = "Almacen " + req.session.planta;
            const area = req.session.area;
            console.log(Herramienta)

            conn.query("SELECT * FROM ordenCompra WHERE Producto = '" + Herramienta + "' order by FechaRegistro desc limit 4", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Herramientas);
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.ExistenciaTotalHerramientas = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;

            var consulta = ''
            if (parametros == 'Todo') {
                consulta = "SELECT * FROM herramienta order by Planta,Caracteristicas asc";
            } else {
                consulta = "SELECT * FROM herramienta WHERE Planta = '" + parametros + "' order by Caracteristicas asc";
            }
            conn.query(consulta, (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura' + err);
                }

                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.MostrarReporteHerramientaGaveta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                Herramienta
            } = req.params;


            var fechaInicio = Herramienta.split('|')[0]; // Fecha inicial
            var fechafin = Herramienta.split('|')[1]; // Fecha limite
            var Planta = Herramienta.split('|')[2]; // Fecha limite
            var Articulo = TranformerReporte(Herramienta.split('|')[3]);

            console.log("Articulo: " + Articulo + " con fecha " + fechaInicio + " y " + fechafin + "  es de " + Planta)

            //Reporte solo Articulo sin fecha
            if (fechaInicio == null || fechaInicio == '') {
                console.log("sin fecha gaveta")
                conn.query("select * from SalidaGaveta where (Producto LIKE '%" + Articulo + "%' or OT = '" + Articulo + "') AND Planta = '" + Planta + "' order by Salida desc", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura' + err);
                    }
                    res.json(Herramientas)
                });
            } else if (Articulo == null || Articulo == '') {//Reporte Articulo Con fecha 
                console.log("solo fecha gaveta")
                conn.query("SELECT * FROM SalidaGaveta WHERE Salida BETWEEN '" + fechaInicio + "' AND '" + fechafin + "' order by Salida desc;", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura' + err);
                    }
                    res.json(Herramientas)
                });
            } else {//Reporte Articulo Con fecha 
                console.log("completo gaveta")
                conn.query("SELECT * FROM SalidaGaveta WHERE(Producto LIKE '%" + Articulo + "%' or OT = '" + Articulo + "') AND Planta = '" + Planta + "'  AND Salida BETWEEN '" + fechaInicio + "' AND '" + fechafin + "' order by Salida desc;", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura' + err);
                    }
                    res.json(Herramientas)
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};



Controller.BuscarCajaOperador = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametro
            } = req.params;
            console.log("Cnsultar: " + parametro);
            var consulta = "SELECT CajaOperador.Cantidad, CajaOperador.Estado,CajaOperador.Nomina, CajaArticulos.Articulo,CajaOperador.Fecha,CajaArticulos.Categoria FROM" +
                " CajaOperador INNER JOIN CajaArticulos ON CajaOperador.idArticulo = CajaArticulos.id and CajaOperador.Nomina = " + parametro +
                " order by CajaArticulos.Categoria;"
            console.log(consulta);
            conn.query(consulta, (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura' + err);
                }
                //console.log(Herramientas.length );
                res.json(Herramientas)
            });

        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.BuscarModalCajaOperador = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametro
            } = req.params;
            console.log(parametro);
            var consulta = "SELECT CA.id,CA.Articulo,CA.Categoria,CO.Cantidad FROM CajaArticulos as CA" +
                " LEFT JOIN CajaOperador as CO ON CA.id = CO.idArticulo and CO.Nomina = " + parametro +
                " GROUP BY CA.id, CA.Articulo order by CA.Categoria;"
            conn.query(consulta, (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura' + err);
                }
                console.log(Herramientas.length);
                res.json(Herramientas)
            });

        });
    } else {
        res.render('Admin/Login.html');
    }
};



Controller.GaurdarCajaOperador = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO

            // Extraemos solo el arreglo amigos
            const { arreglo } = data;
            console.log(Object.values(data)[0][0]);
            console.log(data);
            // Ahora accedemos a los elementos del arreglo
            const idArticulo = Object.values(data)[0][0];
            const CantidadArticulo = Object.values(data)[0][1]
            const Nomina = Object.values(data)[0][2]
            
            console.log(idArticulo +" - " +CantidadArticulo+ " - " +Nomina);

            conn.query("call GaurdarCajaOperador("+ idArticulo +",'"+CantidadArticulo+"','"+Nomina+"');", true, (err, rows, fields) => {
                if (err) {
                    console.log('Error al sp: ' + err);
                    res.json(false);
                } else {
                    console.log(rows[0]);
                    res.json(rows[0])
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

module.exports = Controller;






