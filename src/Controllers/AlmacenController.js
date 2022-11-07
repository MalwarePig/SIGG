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
            var Herramienta = Tranformer(Herra);
            const planta = "Almacen " + req.session.planta;
            const area = req.session.area;
            
            if (area == 'Admin') {
                console.log("Entre como admin")
                conn.query("SELECT * FROM almacen WHERE producto LIKE '%" + Herramienta + "%' OR Clave = '" + Herramienta + "'", (err, Herramientas) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    }
                    res.json(Herramientas);
                });
            } else {
                conn.query("SELECT * FROM almacen WHERE producto LIKE '%" + Herramienta + "%' AND Almacen = '" + planta + "'", (err, Herramientas) => {
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

                let Almacen = 'Almacen ' +Planta;


                conn.query("call DespachoAlmacen('"+Folio+"','"+Producto+"',"+Entregado+",'"+Estado+"','"+OT+"','"+OTEstatus+"','"+Maquina+"','" 
                +Empleado+"','"+Parcial+"','"+Comentario+"','"+Turno+"','"+Movimiento+"','"+Planta+"','"+Usuario+"','"+Almacen+"');", true, (err, rows, fields) => {
                    if (err) {
                        console.log('Error al registrar folios' + err);
                    }else{
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

            conn.query("select * from itemprestado WHERE Maquina = '" + Maquina + "' AND Devuelto < Entregado", (err, Herramientas) => {
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
                let Turno = req.session.turno; //obeter datos de un objeto Folio
                let Movimiento = 'Retorno';
                let Planta = req.session.planta;
                let Usuario = req.session.username;
                console.log("Producto : " + Producto + " Cantidad a retornar: " + Cantidad);
                //console.log(Folio + " - " + Producto + " - " + Cantidad + " - " + Estado + " - " + OT + " - " + Maquina + " - " + Empleado + " - " + Turno + " - " + Comentarios + " - " + Movimiento + " - " + Planta + " - " + Usuario)
                conn.query('INSERT INTO itemretorno(Folio,Producto,Cantidad,Estado,Empleado,Turno,Maquina,Comentarios,Movimiento,Usuario,Almacen)values(?,?,?,?,?,?,?,?,?,?,?)', [Folio, Producto, Cantidad, Estado, Empleado, Turno, Maquina, Comentarios, Movimiento, Usuario, Planta], (err, ot) => {
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

            conn.query("INSERT INTO almacen(Clave,Producto,Almacen,Stock,StockMin,StockMax,StockUsado,Ubicacion,Categoria,Familia)VALUES('" + Clave + "','" + Producto + "','" + Almacen + "'," + Stock + "," + StockMin + "," + StockMax + "," + StockUsado + ",'" + Ubicacion + "','" + Categoria + "','" + Familia + "')", (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura' + err);
                }
                res.json(Herramientas)
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
            
            console.log("id " + id + "','" + Clave + "','" + Producto + "','" + StockNuevo + "','" + StockUsado + "','" + StockMinimo + "','" + StockMaximo+ "','" +Motivo+ "','" +Nombre+ "','" +NuevaCantidad+ "','" +Planta);
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("call ActualizarProducto(" + id + ",'" + Clave + "','" + Producto + "','" + StockNuevo + "','" + StockUsado + "','" + StockMinimo + "','" + StockMaximo + "','" + Categoria + "','" + Familia 
                + "','" +Motivo+"','"+Nombre+"',"+NuevaCantidad+",'"+Planta+"')", true, (err, rows, fields) => {
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

            console.log("id " + id + "','" + Clave + "','" + Producto + "','" + Ubicacion);
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("UPDATE almacen SET Clave = '" + Clave + "', Producto = '" + Producto + "', Ubicacion = '" + Ubicacion + "' WHERE id = " + id, (err, Herramientas) => {
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


//============================================================================================================================================================================================================================================
///////// == REPORTE Herramienta == ////////////////////////////// == REPORTE Herramienta == ////////////////////////////// == REPORTE Herramienta == ////////////////////////// == REPORTE Herramienta == //////////////////// == REPORTE Herramienta == ///////////////////// == REPORTE == ////////////
//============================================================================================================================================================================================================================================

Controller.MostrarReporteHerramienta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                Herramienta
            } = req.params;
            var Articulo = Tranformer(Herramienta);
            conn.query("SELECT * FROM itemprestado WHERE Producto LIKE '%" + Articulo + "%' ORDER BY Salida Desc", (err, Herramientas) => {
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

                console.log(Item + "'," + Cantidad + ",'" + Planta + "','" + Estado )
   
                conn.query("call GuardarIntercambio('" + Item + "'," + Cantidad + ",'" + Planta + "','" + Estado + "')", true, (err, rows, fields) => {
                    if (err) {
                        console.log('Error al Recolectar' + err);
                    } else {
                        conn.query("call IntercambioActivo('" + Item + "','" + Planta + "')", true, (err, rows, fields) => {
                            if (err) {
                                console.log('Error al Recolectar' + err);
                            } else {
                                console.log(Item + "'," + Cantidad + ",'" + Planta + "','" + Estado )
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
            var Herramienta = Tranformer(Herra);
            const planta = "Almacen " + req.session.planta;
            console.log("Salida: " + Herramienta + " Planta: " + planta);
            conn.query("SELECT * FROM almacen WHERE producto LIKE '%" + Herramienta + "%' OR Clave = '%" + Herramienta + "%' AND Almacen = 'Gaveta'", (err, Herramientas) => {
                if (err) {

                    console.log('Error de lectura ' + err);
                }
                res.json(Herramientas);
            });
        });
    } else {
        res.render('Admin/Login.html');
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
            var Herramienta = Tranformer(Herra);
            const planta = "Almacen " + req.session.planta;
            console.log("Salida: " + Herramienta + " Planta: " + planta);
            conn.query("SELECT * FROM almacen WHERE producto LIKE '%" + Herramienta + "%' OR Clave LIKE '%" + Herramienta + "%'", (err, Herramientas) => {
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
                }else{
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

            Almacen == 'Todo' ? Almacen = ' IS not null' : Almacen = " = 'Almacen " + Almacen + "'";
            Categoria == 'Todo' ? Categoria = ' AND Categoria IS not null' : Categoria = " AND Categoria = '" + Categoria + "'";
            Familia == 'Todo' ? Familia = ' AND Familia IS not null' : Familia = " AND Familia = '" + Familia + "'";

            let consulta = "SELECT id,Clave,Producto,Almacen,Stock,StockMin,StockMax,StockUsado,Ubicacion,Familia,Categoria,Cotizado FROM almacen WHERE Almacen" + Almacen + Categoria + Familia;

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
                
                console.log("OC: " + OCGemak + " OT: " + OT + " Producto: " + Producto + " PoCliente" + PO + " Ensamble: " + ENS + " Cantidad: " +Cantidad  + " Ubicacion: " + Ubicacion );

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
            var Cantidad = Object.values(data)[0].Cantidad; 
            var Nombre = Object.values(data)[0].Nombre;
            var CantidadAnterior = Object.values(data)[0].CantidadAnterior;
            var Producto = Object.values(data)[0].Producto;
            var Planta = Object.values(data)[0].Planta;
            console.log(id + " - " + Cantidad+ Nombre + CantidadAnterior+Producto +Planta)

            conn.query("call AjusteBasico("+id+",'"+Producto+"','"+Planta+"','"+Nombre+"',"+Cantidad + ","+CantidadAnterior+")", true, (err, rows, fields) => {
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

            let consulta = "Select * from `categoriaalmacen` where Planta = '"+parametros+"' order by Nombre";

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


Controller.CambiarCotizacion = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            

            let id = Object.values(data)[0].id;
            let estado = Object.values(data)[0].estado;
            console.log(data)
            console.log(id)
            console.log(estado)
            conn.query("UPDATE almacen SET Cotizado = "+estado+" WHERE id = "+id , (err, data) => {
                if (err) {
                    console.log('Error de lectura '+err);
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




Controller.ListaDeCotizaciones = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => { 
            let consulta = "select * from almacen WHERE Cotizado = true AND Ordenado = false"; 

            conn.query(consulta, (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura' + err);
                }else{
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
            console.log(IndiceProducto,Cantidad,Folio)
            conn.query("INSERT INTO Ordenado(idAlmacen,Cantidad,Folio)VALUES(" + IndiceProducto + "," + Cantidad + ",'"+Folio+"')", (err, data) => {
                if (err) {
                    console.log(err);
                }else{
                    conn.query("UPDATE almacen SET Ordenado = true WHERE id = "+IndiceProducto, (err, data) => {
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

            conn.query("UPDATE almacen Set Cotizado = false, Ordenado = false WHERE id = "+IndiceProducto, (err, data) => {
                if (err) {
                    console.log(err);
                }else{ 
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

            conn.query("call CancelarOrdenados("+IndiceProducto+",'"+Producto+"','"+Almacen+"')", true, (err, rows, fields) => {
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
             
            console.log(IndiceOrden,Recibido,Factura) 

            conn.query("call ActualizarOrdenar("+IndiceOrden+","+Recibido+",'"+Factura+"')", true, (err, rows, fields) => {
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
              
            console.log(Recibido+','+idAlmacen+','+idOrdenado)
            conn.query("call RecolectarAlmacen("+Recibido+','+idAlmacen+','+idOrdenado+','+idRecepcion+")", true, (err, rows, fields) => {
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

            conn.query("SELECT * from almacen WHERE Cotizado = true AND Almacen = '"+Req_Almacen+"'", (err, data) => {
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

            conn.query("SELECT o.id,a.Producto, a.Stock, a.Almacen, o.Cantidad,o.Folio,o.Factura,o.FechaOrdenado,o.Estatus  FROM almacen a, ordenado o WHERE a.id = o.idAlmacen AND o.Recibido < o.Cantidad AND o.FechaOrdenado BETWEEN '" + Req_inicio + "' AND '" + Req_fin+"'", (err, data) => {
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


            console.log(id + " - " + CantidadFinal+ Nombre + CantidadAnterior+Producto +Planta +Ingreso)

            conn.query("call RecolectarBasico("+id+",'"+Producto+"','"+Planta+"','"+Nombre+"',"+CantidadAnterior + ","+Ingreso+","+CantidadFinal+")", true, (err, rows, fields) => {
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

module.exports = Controller;