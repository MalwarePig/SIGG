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
            console.log("Salida: " + Herramienta + " Planta: " + planta);
            conn.query("SELECT * FROM almacen WHERE producto LIKE '%" + Herramienta + "%' AND Almacen = '" + planta + "'", (err, Herramientas) => {
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
                if (Estado[0].Estado == "0") { //Si no se ha realizado la auditoria debe entrar
                    if (Turno == "Dia") {
                        if (FechaActual.getDay() == 1) { //Si es lunes
                            var FechaFinal = new Date();
                            var FechaInicial = new Date();
                            FechaInicial.setDate(FechaInicial.getDate() - 2);
                            console.log(typeof(FechaInicial) + " Y " + typeof(FechaFinal.toISOString().slice(0, 10)));
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
                            console.log(typeof(FechaInicial) + " Y " + typeof(FechaFinal.toISOString().slice(0, 10)));
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
                        console.log(typeof(FechaInicial) + " Y " + typeof(FechaFinal.toISOString().slice(0, 10)));
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
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            conn.query("SELECT * from maquinas where Familia ='" + familia + "' AND Planta = '" + planta + "'", (err, maquinas) => {
                if (err) {
                    console.log('Error de lectura');
                }
                res.json(maquinas);
            });
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
 
                console.log("Indice: " + i+" Folio: " +Folio + " Producto " + Producto + " -Entregado " +  Entregado + " -Estado " +  Estado + " -OT " +  OT + " -OTEstatus " +  OTEstatus + " -Maquina " +  Maquina + " -Empleado " +  Empleado + " -Turno " +  Turno + " -Comentario " +  Comentario + " -Movimiento " +  Movimiento + " -Planta " +  Planta + " -Usuario " +  Usuario)
                conn.query('INSERT INTO itemprestado(Folio, Producto, Entregado, Estado, OT,OTEstatus, Maquina, Empleado, Turno, Comentarios, Movimiento, Almacen, Usuario,Parcial)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [Folio, Producto, Entregado, Estado, OT, OTEstatus, Maquina, Empleado, Turno, Comentario, Movimiento, Planta, Usuario, Parcial], (err, ot) => {
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
                });
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
            for(var i = 0; i < limite; i ++){
                var Producto = Object.values(data)[0][i][0]; //obeter datos de un objeto Producto
                var Cantidad = Object.values(data)[0][i][1]; //obeter datos de un objeto Cantidad
                var Nota = Object.values(data)[0][i][2]; //obeter datos de un objeto Nota
    
                var Planta = req.session.planta;
                var Usuario = req.session.nombre;
 
                console.log("Producto "+Producto+ " Cantidad: " + Cantidad+ " Usuario: " + Usuario+ " Planta: "+ Planta+   " Nota: " +Nota);
                conn.query("INSERT INTO RegistrosFaltantes(Producto, Cantidad, Auditor,Almacen, Notas) values ('"+Producto+"',"+ Cantidad+",'"+ Usuario+"','"+ Planta+"','"+ Nota+"')", [], (err, ot) => {
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
            for(var i = 0; i < limite; i ++){
                var Producto = Object.values(data)[0][i][0]; //obeter datos de un objeto Producto
                var Contado = Object.values(data)[0][i][1]; //obeter datos de un objeto Cantidad
                var Stock = Object.values(data)[0][i][2]; //obeter datos de un objeto Cantidad
                //console.log("Producto: " + Producto+ " Contado: " + Contado + " Stock:" + Stock);
                conn.query('INSERT INTO AudiCiclico(id,Producto, Contado,Stock, Auditor,Almacen,Fecha)values(?,?,?,?,?,?,?)', [0, Producto, Contado, Stock, Usuario, Planta, FechaReq], (err, ot) => {
                    if (err) {
                        res.json("Error json: " + err);
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
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
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
                let Entregado = Object.values(data)[0][i][2]; //obeter datos de un objeto Entregado
                let Usuario = req.session.nombre; //obeter datos de un objeto nombre
                let Estatus = "N/A"; //obeter datos de un objeto Folio
                console.log("Producto: " +Producto+" Ordenado: " +Ordenado + " Entregado: "+Entregado);

                if (err) {
                    console.log("Conexion: " + err);
                }

                conn.query('INSERT INTO Recepcion(Producto, Ordenado, Entregado, Usuario, Estatus)values(?,?,?,?,?)', [Producto, Ordenado, Entregado, Usuario, Estatus], (err, ot) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error al registrar recepcion');
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

Controller.Asignar = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            var limite = Object.values(data)[0].length;
            for(var i = 0; i < limite; i++){
                var id = Object.values(data)[0][i][0]; //obeter datos de un objeto id
                var Item = Object.values(data)[0][i][1]; //obeter datos de un objeto Item
                var Cantidad = Object.values(data)[0][i][2]; //obeter datos de un objeto Cantidad
                var Planta = Object.values(data)[0][i][3]; //obeter datos de un objeto Planta
                console.log( id + "','"+Item +"','"+Cantidad+"','"+Planta);
 
                conn.query("call Asignar('" + id + "','" + Item + "','" + Cantidad + "','" + Planta + "')", true, (err, rows, fields) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    } else {
                        console.log('Se asigno herramienta a almacen');
                    }
                });
            }//For
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

Controller.GuardarRecoleccion = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            let Planta = "Almacen " + req.session.planta; //obeter datos de un objeto Planta
            let Usuario = req.session.nombre; //obeter datos de un objeto nombre
            var limite = Object.values(data)[0].length;
            for(var i = 0; i < limite; i++){
                var id = Object.values(data)[0][i][0]; //obeter datos de un objeto id
                var Item = Object.values(data)[0][i][1]; //obeter datos de un objeto Item
                var Cantidad = Object.values(data)[0][i][2]; //obeter datos de un objeto Cantidad
                console.log("id " + id + "','" + Item + "','" + Cantidad + "','" + Planta + "," + Usuario);
 
                conn.query("call Recolectar(" + id + ",'" + Item + "'," + Cantidad + ",'" + Planta + "','" + Usuario + "')", true, (err, rows, fields) => {
                    if (err) {
                        res.json(err);
                        console.log('Error al Recolectar' + err);
                    } else {
                        console.log('Se recolectó herramienta a almacen');
                    }
                });
            }
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
            var id = Object.values(data)[0]; //obeter datos de un objeto id
            var Clave = Object.values(data)[1]; //obeter datos de un objeto Clave
            var Producto = Object.values(data)[2]; //obeter datos de un objeto Producto
            var Ubicacion = Object.values(data)[3]; //obeter datos de un objeto Ubicacion

            console.log("id " + id + "','" + Clave + "','" + Producto + "','" + Ubicacion);
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("call ActualizarProducto(" + id + ",'" + Clave + "','" + Producto + "','" + Ubicacion + "')", true, (err, rows, fields) => {
                    if (err) {
                        res.json(err);
                        console.log('Error al actualizar' + err);
                    } else {
                        console.log('Se actualizó herramienta de almacen');
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
///////// == REPORTE Herramienta == ////////////////////////////// == REPORTE Herramienta == ////////////////////////////// == REPORTE Herramienta == ////////////////////////// == REPORTE Herramienta == //////////////////// == REPORTE Herramienta == ///////////////////// == REPORTE == ////////////
//============================================================================================================================================================================================================================================

Controller.MostrarReporteHerramienta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {Herramienta} = req.params;
            var Articulo = Tranformer(Herramienta);
            conn.query("SELECT * FROM itemprestado WHERE Producto = '"+Articulo+"' ORDER BY Salida Desc", (err, Herramientas) => {
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
            let Producto = Object.values(data)[0]; //obeter datos de un objeto Producto
            let Cantidad = Object.values(data)[1]; //obeter datos de un objeto Cantidad
            let Estado = Object.values(data)[2]; //obeter datos de un objeto OT
            let Empleado = Object.values(data)[3]; //obeter datos de un objeto OT
            let Comentario = Object.values(data)[4]; //obeter datos de un objeto OT
            let Estatus = 'Pendiente';
            let Planta = req.session.planta;

            if (err) {
                console.log("Conexion: " + err)
            }

            conn.query('INSERT INTO IntercambioActivo(Producto, Cantidad, Estado, Empleado, Planta,Comentario,Estatus)values(?,?,?,?,?,?,?)', [Producto, Cantidad, Estado, Empleado, Planta, Comentario, Estatus], (err, ot) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error al registrar despacho de herramienta' + err);
                }
            });
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
            var Item = Object.values(data)[0]; //obeter datos de un objeto Item
            var Cantidad = Object.values(data)[1]; //obeter datos de un objeto Cantidad
            var Estado = Object.values(data)[2]; //obeter datos de un objeto Cantidad
            let Planta = "Almacen " + req.session.planta; //obeter datos de un objeto Planta
            console.log(Item + "','" + Cantidad + "','" + Planta);
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("call GuardarIntercambio('" + Item + "'," + Cantidad + ",'" + Planta + "','" + Estado + "')", true, (err, rows, fields) => {
                    if (err) {
                        res.json(err);
                        console.log('Error al Recolectar' + err);
                    } else {
                        console.log('Se recolectó herramienta a almacen');
                        conn.query("UPDATE IntercambioActivo SET Estatus = 'Completado' WHERE Producto = '" + Item + "' AND Planta != '" + req.session.planta + "'", (err, Herramientas) => {
                            if (err) {
                                res.json("Error json: " + err);
                                console.log('Error de lectura');
                            }
                            res.json(Herramientas);
                        });
                    }
                });
            }
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

module.exports = Controller;