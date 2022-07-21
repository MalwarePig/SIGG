const Controller = {};
const express = require('express'); //guardar express en una variable de servidor
const xlsxFile = require('read-excel-file/node');
var Obj_Flujo = require('../Functions/EntradaFlujo');

//Muestra la carga de flujo de un area
Controller.list = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            let Planta = parametros.split(' ')[0]; // categoria o tipo de reporte
            let ListArea = parametros.split(' ')[1]; // categoria o tipo de reporte

            console.log(Planta + " - " + ListArea);
            if (ListArea == 'controlplaner') {
                conn.query("SELECT * FROM " + ListArea + " WHERE Planta = '" + Planta + "' AND Origen != 'Inicial' AND Fisico != 'Original' AND Estatus != 'Cerrada' AND Estatus != 'Espera' AND Enviadas < (CantOt + Extra) AND FechaInicio IS NOT NULL ORDER BY FechaInicio Asc", [], (err, Lineas) => {
                    if (err) {
                        console.log('Error al registrar despacho de herramienta' + err);
                    }
                    res.json(Lineas)
                });
            } else {
                conn.query("SELECT * FROM " + ListArea + " WHERE Planta = '" + Planta + "' AND Estatus = 'Abierta' AND Enviadas < (CantOt) AND FechaInicio IS NOT NULL ORDER BY FechaInicio Asc", [], (err, Lineas) => {
                    if (err) {
                        console.log('Error al registrar despacho de herramienta' + err);
                    }
                    res.json(Lineas)
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

//Muestra la carga de flujo de lineas terminadas no embarcadas
Controller.listEspera = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var Planta = parametros.split(' ')[0]; // categoria o tipo de reporte
            var Area = parametros.split(' ')[1]; // categoria o tipo de reporte
            console.log(Planta + " - " + Area);
            conn.query("SELECT * FROM " + Area + " WHERE Planta = '" + Planta + "' AND Estatus = 'Espera' ORDER BY FechaInicio Asc", [], (err, Lineas) => {
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

//Funcion activa para llenado de flujo
Controller.AlimentarVistaPlanta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const promesa = new Promise((resolve, reject) => {
                setTimeout(() => {
                    var ruta = '//192.168.2.191/Archivos Compartidos Servidor/RecursosSIGG/VISTAPLANTA_DAT.xlsx'
                    xlsxFile(ruta).then((rows) => {
                        console.log("Excel Leido: " + rows.length)
                        conn.query("Select OT from controlplaner WHERE Estatus != 'Cerrada'", [], (err, Historial) => { // UPDATE  A[B]
                            if (err) {
                                console.log('sin lectura: ' + err);
                            } else {
                                if (Historial.length == 0) {
                                    console.log("Sin Historial")
                                } else { 
                                    //console.log(rows);
                                    var limite = Object.keys(rows).length; 
                                    //console.log("Limite:" + limite)
                                    var Arreglo = [];
                                    var coincidencia = false;
                                    for (var index = 1; index < limite; index++) {
                                        coincidencia = false;
                                        for (var H = 0; H < Historial.length; H++) {
                                            //console.log("Historial: " + H + " Excel: " + index + " coincidencia " + coincidencia);
                                            if (Historial[H].OT == rows[index][1]) {
                                                coincidencia = true;
                                                //console.log(H + " Comparando historial: " + Historial[H].OT + " rows: " + rows[index][1] + " " + coincidencia + typeof(coincidencia));
                                            }
                                        } //For historial
                                        //console.log('***************************');
                                        if (coincidencia == false) {
                                            //console.log(H + " Sin historial: " + rows[index][1] + " " + coincidencia);
                                            var Estatus = rows[index][0];
                                            let Cliente = rows[index][3];
                                            var OT = rows[index][1];
                                            var Parte = rows[index][5];
                                            var Cantidad = rows[index][7];
                                            var FechaVencimiento = rows[index][10];
                                            var Planta;
                                            if (rows[index][14] != null && rows[index][14] != '' && rows[index][14] != 'null') {
                                                Planta = rows[index][14].trim();
                                            }
                                            
                                            switch (Planta) {
                                                case 'CM1MORELOS':
                                                case 'CM3DMORELOS':
                                                case 'CMCHICOSMORELOS':
                                                case 'CMGRANDEMORELOS':
                                                case 'MAQCHMORELOS':
                                                case 'MAQGMORELOS':
                                                case 'MAQMMORELOS':
                                                case 'PLMORELOS':
                                                case 'TORNOCHM':
                                                case 'TORNOCHMOR1':
                                                case 'TORNOMM':
                                                case 'ZAYER':
                                                    Planta = 'Morelos';
                                                    break;
                                                case 'MAQGBRAVO':
                                                case 'MAQMBRAVO':
                                                case 'TORNOCHB':
                                                case 'TORNOEG':
                                                case 'TORNOGB':
                                                case 'TORNOMB':
                                                    Planta = 'Bravo';
                                                    break;
                                                default:
                                                    Planta = "No Planta";
                                                    break;
                                            }
                                            if (Planta === 'Morelos' || Planta === 'Bravo') {
                                                var x = [Estatus, OT, Parte, Cantidad, FechaVencimiento, Planta, Cliente];
                                                Arreglo.push(x);
                                            } //if Plantas habiles
                                            coincidencia = false;
                                        }
                                    } //For rows
                                   
                                    var newLimit = Arreglo.length; 
                                    //console.log(newLimit);
                                    if(newLimit == 0){//Si no se encuentran nuevas OT terminar proceso
                                        resolve(true)
                                    }else{
                                        for (let index = 0; index < newLimit; index++) {
                                            console.log("insetnando for: " +index)
                                            var Estatus = Arreglo[index][0];
                                            var OT = Arreglo[index][1];
                                            var Parte = Arreglo[index][2];
                                            var CantOt = Arreglo[index][3];
                                            var m = new Date(Arreglo[index][4]);
                                            var FechaVenc = FormatoFechas(m);
                                            var Planta = Arreglo[index][5];
                                            let Cliente = Arreglo[index][6];
                                            console.log("Insertando: " +OT)
                                            conn.query("INSERT INTO controlplaner(Estatus,OT,Parte,CantOt,FechaVenc,Planta,Recibido,Cliente,Fisico,Origen,Comentarios) VALUES ('Cola','" + OT + "','" + Parte + "','" + CantOt + "','" + FechaVenc + "','" + Planta + "'," + 0 + ",'" + Cliente + "','Original','Inicial','"+Parte+"')", [], (err, dato) => {
                                                if (err) {
                                                    console.log('error de insert: ' + err + " " + Planta);
                                                }
                                                if (index == (newLimit - 1)) {
                                                    resolve(true)
                                                }
                                            });
                                        } //Else sin historial
                                    }
                                    
                                } //Si encontro un registro pivote
                            }
                        });
                    })
                }, 1000);
            }) //Fin de promesa

            promesa.then(resp => {
                console.log("Fin de promesa");
                res.json({
                    "Estatus": "Terminado"
                });
            }).catch(error => {
                console.error(error);
            });

        });
    } else {
        res.render('Admin/Login.html');
    }
};


/*
//Funcuin activa para llenado de flujo
Controller.AlimentarVistaPlanta = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            var ruta = '//192.168.2.191/Archivos Compartidos Servidor/RecursosSIGG/VISTAPLANTA_DAT.xls.xlsx'
            console.log(ruta);
            xlsxFile(ruta).then((rows) => {
                Obj_Flujo.CompararHistorial(rows);
            })

            
        });
    } else {
        res.render('Admin/Login.html');
    }
};*/

Controller.AlimentarFlujo = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {

            var ruta = '//192.168.2.191/Archivos Compartidos Servidor/RecursosSIGG/Data.xlsx'
            console.log(ruta);
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
            let AreaUsuario = req.session.planta;
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

            //conn.query("SELECT * FROM " + AreaOrigen + " WHERE FechaInicio IS NULL AND Estatus != 'Cerrada' AND Estatus != 'Espera'", true, (err, rows) => {493
            conn.query("SELECT * FROM " + AreaOrigen + " WHERE Planta = '"+AreaUsuario+"' AND Enviadas < CantOT AND Estatus != 'Cerrada' AND Estatus != 'Espera' AND Estatus != 'Linea' AND Enviadas < (CantOt + Extra)", true, (err, rows) => {
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
            //console.table(Object.values(data)[0][0][0]);
            var limite = Object.values(data)[0].length;

            var AreaOrigen = req.session.area;
            console.log("IniciarProdFlujo: " + AreaOrigen);
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

            console.log("Actualizar : " + AreaOrigen + " id: " + Object.values(data)[0][0][0]);
            if (AreaOrigen == 'controlplaner') {
                console.log("Limite: " + limite)
                for (let index = 0; index < limite; index++) {
                    conn.query("UPDATE " + AreaOrigen + " SET FechaInicio = now(), Maquina = '" + Object.values(data)[0][index][4] + "',Estatus = 'Linea', Fisico = 'Linea', Usuario = '"+req.session.username+"', Recibe = '"+req.session.nombre+"', Origen = '"+AreaOrigen+"' WHERE OT = '" + Object.values(data)[0][index][1] + "' AND id = " + Object.values(data)[0][index][0], true, (err, rows) => {
                        if (err) {
                            console.log('Error al asignar: ' + err);
                        } else {
                              if(index == (limite-1)){
                                  res.json(true)
                              }
                        }
                    });
                }
            } 
            
            else { //Otras areas
                for (var i = 0; i < limite; i++) {
                    console.log("id: " + Object.values(data)[0][i][0] + " AreaOrigen: " + AreaOrigen);
                    conn.query("UPDATE " + AreaOrigen + " SET FechaInicio = (now()), Recibido = " + Object.values(data)[0][i][3] + ", Usuario = '" +req.session.username+"' WHERE id = " + Object.values(data)[0][i][0], true, (err, rows) => {
                        if (err) {
                            console.log('Error al asignar' + err);
                        } else {
                            console.log("Se actualizo " + AreaOrigen)
                        }
                    });
                }
                res.json(true); //Actualizo correctamente
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Asignar a la cola
Controller.AsignarCola = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {

            const data = req.body;
            //console.table(Object.values(data)[0][0][0]);
            var limite = Object.values(data)[0].length;
            
            let id = Object.values(data)[0][0][0];
            let OT = Object.values(data)[0][0][1];
            let Parte = Object.values(data)[0][0][2];
            let CantidadOT = Object.values(data)[0][0][3];
            let Inicial = Object.values(data)[0][0][4];
            let Extra = Object.values(data)[0][0][5];
            let Maquina = Object.values(data)[0][0][6];
            let Usuario = req.session.username;
            let Materialista =  req.session.nombre;
   
            console.log("id: " +id+ " OT: " +OT+" CantidadOT: "+CantidadOT+" Maquina: " +Maquina + " Inicial: " + Inicial+" Extra: "+ Extra+ " Usuario: "+Usuario + " Materialista:" +Materialista+ " limite: " +limite)
  
            conn.query("call AsignarCola("+id+",'"+OT+"','"+CantidadOT+"',"+Inicial+ ","+Extra+",'"+Maquina+ "',"+limite+",'"+Usuario+"','"+Materialista+"')", true, (err, rows, fields) => {
                if (err) {
                    console.log('Error al asignar' + err);
                } else {
                            var TotalEncontrado = rows[0].length
                        for (let index = 0; index < rows[0].length; index++) {
                            console.log(rows[0][index].id)
                            let idActual = rows[0][index].id
                            let Inicial = Object.values(data)[0][index][4];
                            let Extra = Object.values(data)[0][index][5];
                            let MaquinaActual = Object.values(data)[0][index][6];
                            console.log(idActual ,Inicial,Extra ,MaquinaActual)
 
                            conn.query("UPDATE controlplaner SET Maquina = '"+MaquinaActual+"', Recibido = '"+Inicial+"',Extra='"+Extra+"' WHERE id = "+idActual  , true, (err, rows) => {
                                if (err) {
                                    console.log('Error al asignar: ' + err);
                                } else {
                                  if(index == (TotalEncontrado-1)){
                                      res.json(true)
                                  }
                                }
                            }); 
                        }
                }
            });
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
            var cantidadOT = parseInt(Object.values(data)[0].CantidadOT);
            var cantidadDestino = Object.values(data)[0].cantidadDestino;
            var cantidadActual = Object.values(data)[0].cantidadActual;
            var Recibido = Object.values(data)[0].Recibido;
            var Planta = Object.values(data)[0].Planta;;
            var Inicio = Object.values(data)[0].Inicio;
            var Fin = Object.values(data)[0].Fin;
            var AreaDestino = Object.values(data)[0].AreaDestino;
            var Caso = Object.values(data)[0].Caso;
            var Extra = Object.values(data)[0].Extra;
            var PNC = Object.values(data)[0].PNC;

            var AreaOrigen = req.session.area;
            console.log("Area antes de switch" + AreaOrigen);
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

            console.log("Area despues de switch" + AreaOrigen);
            //=========================================================================== BLOQUE PARCIAL ======================================================================================= 
            console.clear();
            console.log("Caso: " + Caso + " AreaOrigen: " + AreaOrigen);
            if (Caso == 'Parcial') {
                console.log('Parcial************************');

                //Insert la linea en la nueva area
                conn.query("INSERT INTO " + AreaDestino + "(Estatus,OT,Parte,CantOT,FechaVenc,Planta,Origen,Recibido)VALUES('Abierta','" + OT + "','" + Parte + "','" + cantidadOT + "','" + Fin + "','" + Planta + "','" + AreaOrigen + "'," + cantidadDestino + ")", true, (err, rows) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    } else {
                        console.log("Tranferencia realizada");
                    }
                });

                conn.query("SELECT Enviadas,PNC FROM " + AreaOrigen + " WHERE id = " + id, true, (err, rows) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    } else {
                        var EnviadasActual = (parseInt(cantidadDestino) + parseInt(rows[0].Enviadas));
                        let TotalPNC = parseInt(rows[0].PNC) + parseInt(PNC);
                        console.log("PNC ANTES: " + parseInt(rows[0].PNC) + " Total: " + TotalPNC + " Llego: " + PNC);
                        console.log("La condicion es que " + EnviadasActual + " Sea >=  " + Recibido)
                        if (EnviadasActual >= Recibido) { //Cambia estado de Abierta a Esperando
                            console.log("Ya son todas weee Enviadas previamente: " + parseInt(rows[0].Enviadas) + " Nuevo valor de enviadas: " + (parseInt(cantidadDestino) + parseInt(rows[0].Enviadas)));
                            conn.query("UPDATE " + AreaOrigen + " SET Enviadas = " + (parseInt(cantidadDestino) + parseInt(rows[0].Enviadas)) + ", FechaProd = now(),  Estatus = 'Espera', PNC = " + TotalPNC + " WHERE id = " + id, true, (err, rows) => {
                                if (err) {
                                    console.log('Error al asignar' + err);
                                } else {
                                    console.log("linea actualizada ");
                                    res.json(true);
                                }
                            });
                        } else {
                            console.log("Aun faltan Enviadas previamente: " + parseInt(rows[0].Enviadas) + " Nuevo valor de enviadas: " + (parseInt(cantidadDestino) + parseInt(rows[0].Enviadas)));
                            conn.query("UPDATE " + AreaOrigen + " SET Enviadas = " + (parseInt(cantidadDestino) + parseInt(rows[0].Enviadas)) + ", FechaProd = now(), PNC = " + TotalPNC + " WHERE id = " + id, true, (err, rows) => {
                                if (err) {
                                    console.log('Error al transferir' + err);
                                } else {
                                    console.log("linea actualizada ");
                                    res.json(true);
                                }
                            });
                        }
                    }
                });
            }
            //======================================================================================================================================================================= 
            else if (Caso == 'Cerrado') {
                //Insert la linea en la nueva area
                conn.query("INSERT INTO " + AreaDestino + "(Estatus,OT,Parte,CantOT,FechaVenc,Planta,Origen,Recibido)VALUES('Abierta','" + OT + "','" + Parte + "','" + cantidadOT + "','" + Fin + "','" + Planta + "','" + AreaOrigen + "'," + cantidadDestino + ")", true, (err, rows) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    } else {
                        console.log("Tranferencia realizada");
                    }
                });

                conn.query("SELECT Enviadas,PNC FROM " + AreaOrigen + " WHERE id = " + id, true, (err, rows) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    } else {
                        let TotalPNC = parseInt(rows[0].PNC) + parseInt(PNC);
                        conn.query("UPDATE " + AreaOrigen + " SET Enviadas = " + (parseInt(cantidadDestino) + parseInt(rows[0].Enviadas)) + ", FechaProd = now(), Estatus = 'Espera', PNC = " + TotalPNC + " WHERE id = " + id, true, (err, rows) => {
                            if (err) {
                                console.log('Error al asignar' + err);
                            } else {
                                console.log("linea actualizada ");
                                res.json(true);
                            }
                        });
                    }
                });
            } else if (Caso == 'Extra') { //if Caso cerrado
                //Insert la linea en la nueva area
                conn.query("INSERT INTO " + AreaDestino + "(Estatus,OT,Parte,CantOT,FechaVenc,Planta,Origen,Recibido)VALUES('Abierta','" + OT + "','" + Parte + "','" + cantidadOT + "','" + Fin + "','" + Planta + "','" + AreaOrigen + "'," + cantidadDestino + ")", true, (err, rows) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    } else {
                        console.log("Tranferencia realizada");
                    }
                });
                conn.query("SELECT Enviadas,PNC FROM " + AreaOrigen + " WHERE id = " + id, true, (err, rows) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    } else {
                        let TotalPNC = parseInt(rows[0].PNC) + parseInt(PNC);
                        conn.query("UPDATE " + AreaOrigen + " SET Enviadas = " + (parseInt(cantidadDestino) + parseInt(rows[0].Enviadas)) + ",FechaProd = now(), Estatus = 'Espera' WHERE id = " + id, true, (err, rows) => {
                            if (err) {
                                console.log('Error al asignar' + err);
                            } else {
                                console.log("linea actualizada ");
                                res.json(true);
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Guarda los cambios en las cantidades del flujo
Controller.SaveCantFlujo = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body;
            var id = Object.values(data)[0].id;
            var CantRecibida = Object.values(data)[0].CantRecibida;
            var CantExtra = Object.values(data)[0].CantExtra;
            console.log("Actualizar id: " + id + " CantRecibida: " + CantRecibida + " CantExtra: " + CantExtra)

            //Insert la linea en la nueva area
            conn.query("UPDATE controlplaner SET Recibido = " + CantRecibida + ", Extra = " + CantExtra, true, (err, rows) => {
                if (err) {
                    console.log('Error al asignar' + err);
                } else {
                    console.log("Registro Actualizado");
                }
            });

        });
    } else {
        res.render('Admin/Login.html');
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Manda linea a Tratamiento externos
Controller.MandarTrat = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body;

            var id = Object.values(data)[0].id;
            var OT = Object.values(data)[0].OT;
            var Parte = Object.values(data)[0].Parte;
            var cantidadDestino = Object.values(data)[0].cantidadDestino;
            var cantidadActual = Object.values(data)[0].cantidadActual;
            var Servicio = Object.values(data)[0].Servicio;
            var Proveedor = Object.values(data)[0].Proveedor;
            var Retrabajo = Object.values(data)[0].Retrabajo;
            var cantidadOT = Object.values(data)[0].cantidadOT;
            console.log("Servicio: " + Servicio + " Proveedor: " + Proveedor + " Retrabajo: " + Retrabajo + " Actualizar id: " + id + " OT: " + OT + " Parte: " + Parte + " cantidadDestino: " + cantidadDestino + " cantidadActual: " + cantidadActual)

            //Insert la linea en la nueva area
            conn.query("INSERT INTO TratamientosExterno(Estatus,OT,Parte,CantOt,Servicio,Proveedor,Recibidas,Retrabajo)VALUES('Servicio','" + OT + "','" + Parte + "','" + cantidadOT + "','" + Servicio + "','" + Proveedor + "','" + cantidadDestino + "','" + Retrabajo + "')", true, (err, rows) => {
                if (err) {
                    console.log('Error al Transferir' + err);
                } else {
                    console.log("Linea transferida");
                    conn.query("SELECT Enviadas,Recibido FROM areatratamientos WHERE id = " + id, true, (err, rows) => {
                        if (err) {
                            console.log('Error al asignar' + err);
                        } else {
                            var EnviadasActual = (parseInt(cantidadDestino) + parseInt(rows[0].Enviadas))
                            console.log("La condicion es que " + EnviadasActual + " Sea >=  " + rows[0].Recibido)
                            if (EnviadasActual >= rows[0].Recibido) { //Cambia estado de Abierta a Esperando
                                conn.query("UPDATE areatratamientos SET Enviadas = " + (parseInt(cantidadDestino) + parseInt(rows[0].Enviadas)) + ",FechaProd = now(), Estatus = 'Espera' WHERE id = " + id, true, (err, rows) => {
                                    if (err) {
                                        console.log('Error al asignar' + err);
                                    } else {
                                        console.log("linea actualizada Completa ");
                                    }
                                });
                            } else {
                                conn.query("UPDATE areatratamientos SET Enviadas = " + (parseInt(cantidadDestino) + parseInt(rows[0].Enviadas)) + ", Estatus = 'Abierta' WHERE id = " + id, true, (err, rows) => {
                                    if (err) {
                                        console.log('Error al asignar' + err);
                                    } else {
                                        console.log("linea actualizada Parcial");
                                    }
                                });
                            }
                        }
                    });
                }
            });

        });
    } else {
        res.render('Admin/Login.html');
    }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Muestra las lineas en tratamientos
Controller.EnTratamientos = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                OT
            } = req.params;
            var AreaOrigen = req.session.area;

            conn.query("SELECT * FROM TratamientosExterno WHERE Estatus = 'Servicio'", true, (err, rows) => {
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Manda linea a Tratamiento externos
Controller.FinalizarTrat = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body;

            let OTRetorno = Object.values(data)[0].OTRetorno;
            let ParteRetorno = Object.values(data)[0].ParteRetorno;
            let CantidadRetornoT = Object.values(data)[0].CantidadRetornoT; //Piezas nuevas terminadas
            let AreaDestino = Object.values(data)[0].AreaDestino;
            let id_Retorno = Object.values(data)[0].id_Retorno;
            let TerminadasT = Object.values(data)[0].TerminadasT; //Piezas anteriormente registradas
            let Recibidas = Object.values(data)[0].Recibidas; //Piezas Mandadas a tratamiento externo
            let AreaOrigen = req.session.area;

            console.log("Area antes de switch" + AreaOrigen);
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
            //===============================================================================
            //==== Insertar en la nueva area al retornar de tratamientos externos ===========
            //===============================================================================
            conn.query("SELECT * FROM  controlplaner WHERE OT = '" + OTRetorno + "' AND Parte='" + ParteRetorno + "'", true, (err, rows) => {
                if (err) {
                    console.log('Error al consultar controlplaner' + err);
                } else {
                    parseInt(rows[0].Enviadas)
                    let CantOt = rows[0].CantOt;
                    let FechaVenc = FormatoFechas(rows[0].FechaVenc);
                    let Planta = rows[0].Planta;
                    //console.log("OTRetorno: " + OTRetorno + " ParteRetorno: " + ParteRetorno +  " CantOT: " + CantOt+" CantidadRetornoT: " + CantidadRetornoT + " AreaDestino: " + AreaDestino)
                    //Insert la linea en la nueva area
                    conn.query("INSERT INTO " + AreaDestino + "(Estatus,OT,Parte,CantOt,FechaVenc,Planta,Origen,Recibido)VALUES('Abierta','" + OTRetorno + "','" + ParteRetorno + "','" + CantOt + "','" + FechaVenc + "','" + Planta + "','" + AreaOrigen + "'," + CantidadRetornoT + ")", true, (err, rows) => {
                        if (err) {
                            console.log('Error al asignar' + err);
                        } else {
                            console.log("Tranferencia realizada");
                            conn.query("UPDATE tratamientosexterno SET FechaProd =  now() WHERE id = " + id_Retorno, true, (err, rows) => {
                                if (err) {
                                    console.log('Error al asignar' + err);
                                } else {
                                    console.log("Tranferencia realizada");

                                }
                            });
                        }
                    });
                }
            });

            //=================================================================================
            //====== Actualizar las cantidades retornadas terminadas de Tratamientos Externos =
            //=================================================================================
            let TotalTerminadas = (parseInt(TerminadasT) + parseInt(CantidadRetornoT));
            //Actualizar los datos del area de tratamientos externos
            if (TotalTerminadas < Recibidas) { //Se actualiza con el estatus abierto
                conn.query("UPDATE TratamientosExterno SET Terminadas = " + TotalTerminadas + ", Estatus = 'Servicio' WHERE id = " + id_Retorno, true, (err, rows) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    } else {
                        console.log("Actualizando linea actualizada " + TotalTerminadas + " Terminadas actualmente" + parseInt(TerminadasT) + " Nuevas retorno" + parseInt(CantidadRetornoT) + " ID: " + id_Retorno);
                    }
                });
            } else { //Se actualiza con el estatus cerrado
                conn.query("UPDATE TratamientosExterno SET Terminadas = " + TotalTerminadas + ", Estatus = 'Cerrada' WHERE id = " + id_Retorno, true, (err, rows) => {
                    if (err) {
                        console.log('Error al asignar' + err);
                    } else {
                        console.log("Cerrando linea actualizada " + TotalTerminadas + " Terminadas actualmente" + parseInt(TerminadasT) + " Nuevas retorno" + parseInt(CantidadRetornoT) + " ID: " + id_Retorno);
                    }
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Cierra lineas del flujo
Controller.CerrarLineas = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body;

            let Ot = Object.values(data)[0].Ot;
            let Parte = Object.values(data)[0].Parte;
            let Cantidad = Object.values(data)[0].Cantidad; //Piezas nuevas terminadas
            let id = Object.values(data)[0].id; //Piezas nuevas terminadas

            //=================================================================================
            //======================= Actualiza la salida de la OT ============================
            //=================================================================================
            conn.query("call CerrarLineas('" + Ot + "','" + Parte + "'," + Cantidad + "," + id + ");", true, (err, rows, fields) => {
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

// Cierra lineas del flujo
Controller.EliminarOTFlujo = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body;

            let Area = Object.values(data)[0][0]
            let id = Object.values(data)[0][1]
            console.log("Area" + Area)
            //=================================================================================
            //======================= Actualiza la salida de la OT ============================
            //=================================================================================
            conn.query("DELETE FROM " + Area + " WHERE ID = " + id, true, (err, rows, fields) => {
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


Controller.LeerHistorial = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;
            conn.query("call HistorialFlujo('" + variable + "')", true, (err, rows, fields) => {
                if (err) {
                    console.log('Error al asignar' + err);
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


Controller.ResetFlujo = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                variable
            } = req.params;
            conn.query("call LimpiarAreaFlujos()", true, (err, rows, fields) => {
                if (err) {
                    console.log('Error al limpiar' + err);
                } else {
                    let data = {
                        Estado: true
                    }
                    res.json(data)
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

function FormatoFechas(fecha) {
    var today = new Date(fecha);
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = yyyy + '-' + mm + '-' + dd;
    return today
}




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Registrar Eficiencia
Controller.RegistrarEficiencia = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body;

            let Ef_OT = Object.values(data)[0].Ef_OT;
            let Ef_Operacion = Object.values(data)[0].Ef_Operacion
            let CantOT = Object.values(data)[0].Ef_CantOT;
            let Maquina = Object.values(data)[0].Ef_Maquina;  

            let Nomina = Object.values(data)[0].Ef_Nomina;
            let Nombre = Object.values(data)[0].Ef_Nombre;
            let Turno = Object.values(data)[0].Ef_Turno;

            let TiempoOperacion = Object.values(data)[0].Ef_OperacionT;
            let CantTurno = Object.values(data)[0].Ef_CantidadXTurno;
            let Estimado = Object.values(data)[0].Ef_Estimado;

            let TotalTMuerto = Object.values(data)[0].Ef_TotalTMuerto;
            let Eficiencia = Object.values(data)[0].Ef_Eficiencia;
            
            let Setup = Object.values(data)[0].Setup;
            let Programas = Object.values(data)[0].Programas;
            let Liberacion = Object.values(data)[0].Liberacion;
            let Luz = Object.values(data)[0].Luz;
            let Aditamentos = Object.values(data)[0].Aditamentos;
            let Herramienta = Object.values(data)[0].Herramienta;
            let Material = Object.values(data)[0].Material;
            let Mantenimiento = Object.values(data)[0].Mantenimiento;
            let Planeacion = Object.values(data)[0].Planeacion;
            let Otros = Object.values(data)[0].Otros;

            let FechaInicio = Object.values(data)[0].Ef_FechaInicio;
            let FechaFin = Object.values(data)[0].Ef_FechaFin;
            let Planta = req.session.planta;
            //let Arreglo = [Ef_OT+"'",CantOT,"'"+Maquina+"'","'"+Nomina+"'","'"+Nombre+"'","'"+Turno+"'",TiempoOperacion,CantTurno,Estimado,"'"+TMuertoUno+"'",TMUno,"'"+TMuertoDos+"'",TMDos,"'"+TMuertoTres+"'",TMTres]

            console.log(Eficiencia + " " + FechaFin + " " + Maquina )
            //=================================================================================
            //============================ REGISTRAR EFICIENCIA ===============================
            //=================================================================================
            conn.query("insert into eficiencia(OT,CantOT,Maquina,FechaInicio,FechaFin,Nomina,Nombre,Turno,TiempoOperacion,CantTurno,Estimado,Setup,Programas,Liberacion,Herramienta,Luz,Aditamentos,Material,Mantenimiento,Planeacion,Otros,TotalTMuerto,Eficiencia,Planta,Operacion)Values "+
             "('"+ Ef_OT+"',"+CantOT+",'"+Maquina+"','"+FechaInicio+"','"+FechaFin+"','"+Nomina+"','"+Nombre+"','"+Turno+"',"+TiempoOperacion+","+CantTurno+","+Estimado+","+Setup+","+Programas+","+Liberacion+","+Herramienta+","+Luz+","+Aditamentos+","+Material+","+Mantenimiento +","+Planeacion+","+Otros+","+TotalTMuerto+","+Eficiencia+",'"+Planta+"','"+Ef_Operacion+"')",true, (err, rows) => {
                if (err) {
                    console.log('Error al asignar' + err);
                } else {
                    console.log("Tranferencia realizada" +rows);
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



Controller.LeerEficiencias = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                OT
            } = req.params;
            conn.query("SELECT * FROM eficiencia WHERE OT= '"+OT+"'", true, (err, rows) => {
                if (err) {
                    console.log('Error al registrar folios' + err);
                } else {
                    console.log(rows);
                    res.json(rows);
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

Controller.LeerEficienciaMensual = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {

            const {
                parametros
            } = req.params;

            var fechaInicio = parametros.split('|')[0]; // Fecha inicial
            var fechafin = parametros.split('|')[1]; // Fecha limite
            let planta = parametros.split('|')[2]; // Fecha limite
            console.log("*"+planta+"*"+fechaInicio +'|'+fechafin)
            conn.query("SELECT * FROM eficiencia WHERE Planta = '"+planta+"' AND FechaFin BETWEEN '" + fechaInicio + "' AND '" + fechafin + "' ORDER BY OT", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                console.log(Herramientas)
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.LeerEficienciaNomina = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {

            const {
                parametros
            } = req.params;

            var fechaInicio = parametros.split('|')[0]; // Fecha inicial
            var fechafin = parametros.split('|')[1]; // Fecha limite
            let nomina = parametros.split('|')[2]; // Fecha limite
            console.log(nomina)
            conn.query("SELECT * FROM eficiencia WHERE Nomina = '"+nomina+"' AND FechaFin BETWEEN '" + fechaInicio + "' AND '" + fechafin + "' ", (err, Herramientas) => {
                
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }

                console.log([Herramientas])
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};






/////////////////////////////////////////// Reporte Registros Area /////////////////////////////////
Controller.RegistrosArea = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            var FechaInicio = parametros.split('|')[0]; // categoria o tipo de reporte
            var FechaFin = parametros.split('|')[1]; // Fecha inicial
            var AreaSeleccionada = parametros.split('|')[2];  
 
            console.log(FechaInicio,FechaFin,AreaSeleccionada)
            conn.query("SELECT * FROM controlplaner WHERE FechaInicio BETWEEN  '" + FechaInicio + "' AND '" + FechaFin + "'", (err, data) => {
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Asignar nuevo proceso OT 
Controller.NuevoProceso = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body;
 
            var id = Object.values(data)[0].id;
            var OT = Object.values(data)[0].OT;
            var cantidadDestino = Object.values(data)[0].cantidadDestino;
            var MaquinaDestino = Object.values(data)[0].MaquinaDestino;
            
            var AreaOrigen = req.session.area;
  
            var id = Object.values(data)[0].id;
            var CantRecibida = Object.values(data)[0].CantRecibida;
            var CantExtra = Object.values(data)[0].CantExtra;
            console.log("Actualizar id: " + id + " CantRecibida: " + CantRecibida + " CantExtra: " + CantExtra)

            //Insert la linea en la nueva area
            conn.query("call NuevoProceso("+id+",'"+OT+"',"+cantidadDestino+",'"+MaquinaDestino+"')", true, (err, rows, fields) => {
                if (err) {
                    console.log('Error al limpiar' + err);
                } else {
                    console.log("Intercambio")
                   /*  let data = {
                        Estado: true
                    }
                    res.json(data) */
                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


 

module.exports = Controller;


