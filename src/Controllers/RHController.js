const Controller = {};
const express = require('express'); //guardar express en una variable de servidor
var nodemailer = require('nodemailer');
const xlsxFile = require('read-excel-file/node');
const path = require('path'); //Traba con directorios identificando el SO // \\
// importa el módulo de node `file-system`
const fs = require('fs')
// Muestra las lineas en tratamientos
Controller.ListarPersonal = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                Planta
            } = req.params;
            var AreaOrigen = req.session.area;
            console.log("Planta: " + Planta)

            conn.query("SELECT * FROM empleados WHERE Planta = '" + Planta + "'", true, (err, rows) => {
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

//Editar Personal
Controller.EditarPersonal = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id
            var Nombre = Object.values(data)[0].Nombre; //obeter datos de un objeto Nombre
            var Nomina = Object.values(data)[0].Nomina; //obeter datos de un objeto Nomina
            var CURP = Object.values(data)[0].CURP; //obeter datos de un objeto CURP
            var Correo = Object.values(data)[0].Correo; //obeter datos de un objeto CURP

            console.log("id " + id + "','" + Nombre + "','" + Nomina + "','" + CURP);
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("UPDATE empleados SET Nombre = '" + Nombre + "', Nomina = '" + Nomina + "', CURP = '" + CURP + "', correo = '" + Correo + "' WHERE id = " + id, (err, rows) => {
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

/////////////////////////////////////////////////////////////////////--------------- Registrar Empleado----------------------/////////////////////////////////////////////////////////////////////
Controller.RegistrarEmpleado = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var Nombre = Object.values(data)[0].Nombre; //obeter datos de un objeto id
            var Nomina = Object.values(data)[0].Nomina; //obeter datos de un objeto Nombre
            var CURP = Object.values(data)[0].CURP; //obeter datos de un objeto Nomina
            var Correo = Object.values(data)[0].Correo; //obeter datos de un objeto CURP
            var Planta = Object.values(data)[0].Planta; //obeter datos de un objeto CURP

            console.log(Nombre + "','" + Nomina + "','" + CURP);
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("INSERT empleados SET Nombre = '" + Nombre + "', Nomina = '" + Nomina + "', curp = '" + CURP + "', correo = '" + Correo + "', Planta = '" + Planta + "'", (err, respuesta) => {
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
}
////////////////////////////////////////////////////--------------- Enviar Correos----------------------/////////////////////////////////////////////////////////////

// Preparar Planta para envio
Controller.PrepararEnvio = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                Planta
            } = req.params;
            var AreaOrigen = req.session.area;
            console.log("Planta: " + Planta)

            conn.query("SELECT * FROM empleados WHERE Planta = '" + Planta + "' AND eNomina = 'On'", true, (err, rows) => {
                if (err) {
                    console.log('Error al cargar' + err);
                } else {
                    res.json(rows);
                    console.table(rows);
                    let Lista = []; //Tabla Completa
                    var TotalCorreos = 0;
                    let ListaFaces = []; //json - Catalogo de correos

                    for (let index = 0; index < rows.length; index++) {
                        let jNombre = rows[index].Nombre;
                        let jNomina = rows[index].Nomina;
                        let jCurp = rows[index].CRUP;
                        let jCorreo = rows[index].correo;

                        ListaFaces.push([{
                            Nombre: jNombre,
                            Nomina: jNomina,
                            Curp: jCurp,
                            Correo: jCorreo,
                        }])
                    }

                    TotalCorreos = ListaFaces.length;
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    //////////////////////////////////////////////////////// CORREOS ////////////////////////////////////////////////////////// 
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    var Indice = 0;

                    function EnviarCorreos() {
                        console.log("TotalCorreos : " + TotalCorreos)
                        var intervalor = setInterval(function () {
                            if (Indice < TotalCorreos) {
                                if (Indice % 2 == 0 && Indice != 0) {
                                    console.log("Pausando servicios");
                                    clearInterval(intervalor);
                                    setTimeout(function () {
                                        console.log("Reanudando");

                                        console.log("Enviando tmb: " + Indice);
                                        EjecutarEnvio();
                                        // EnviarCorreos();
                                    }, 20000);
                                    console.log(Indice)
                                } else {
                                    console.log("else: " + Indice)
                                    //EjecutarEnvio();
                                    // async..await is not allowed in global scope, must use a wrapper
                                }
                            }
                        }, 8000);
                    }

                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



/////////////////////////////////////////////////////////////////////--------------- Registrar Empleado----------------------/////////////////////////////////////////////////////////////////////
Controller.EnviarNomina = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO

            var Nombre = Object.values(data)[0].Nombre; //obeter datos de un objeto id
            var Correo = Object.values(data)[0].Correo; //obeter datos de un objeto Nombre
            var Nomina = Object.values(data)[0].Nomina; //obeter datos de un objeto Nombre
            var Curp = Object.values(data)[0].Curp; //obeter datos de un objeto Nombre
            var Planta = Object.values(data)[0].Planta; //obeter datos de un objeto Nombre
            var Semana = Object.values(data)[0].Semana; //obeter datos de un objeto Nombre
            var NomRuta = "";
            (Planta == 'E2') ? NomRuta = "Mor": NomRuta = "Bvo";
            //console.log(Nombre + "','" + Correo );
            if (err) {
                console.log("Conexion: " + err)
            } else {

                async function main() {
                    // Generate test SMTP service account from ethereal.email
                    // Only needed if you don't have a real mail account for testing
                    //let testAccount = await nodemailer.createTestAccount();

                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: "mail.gemak.com.mx",
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: "recibos@gemak.com.mx", // generated ethereal user
                            pass: "=B]BzvvOB8}d", // generated ethereal password
                        },
                    });
                    var NombrePDF = Planta + '-' + Curp + '-' + Nomina.substr(1) + '-' + Semana + '.pdf';
                    var NombreXML = Planta + '-' + Curp + '-' + Nomina.substr(1) + '-' + Semana + '.xml';

                    var rutaPDF = '//192.168.2.191/Archivos Compartidos Servidor/RecursosSIGG/Nom/' + NomRuta + '/' + NombrePDF;
                    var rutaXML = '//192.168.2.191/Archivos Compartidos Servidor/RecursosSIGG/Nom/' + NomRuta + '/' + NombreXML;
                    // send mail with defined transport object
                    try {
                        if (fs.accessSync(rutaPDF) && fs.accessSync(rutaXML)) {
                            console.log("Archivo existe")
                        }
                    } catch (e) {
                        console.log("Archivo no existe");
                        res.json(false)
                    }

                    let info = await transporter.sendMail({
                        from: '"recibos@gemak.com.mx', // sender address
                        to: Correo, // list of receivers
                        subject: "Nomina - " + Nombre + "✔", // Subject line
                        text: "Entrega de nomina", // plain text body
                        html: "<b>Entrega de nomina: "+Nombre+"</b>", // html body
                        attachments: [{
                                filename: NombrePDF,
                                path: rutaPDF
                                // stream this file
                            },
                            {
                                filename: NombreXML,
                                path: rutaXML
                            }
                        ]
                    });

                    try {
                        fs.unlinkSync(rutaPDF)
                        fs.unlinkSync(rutaXML)
                        console.log('File removed')
                    } catch (err) {
                        console.error('Something wrong happened removing the file', err)
                    }
                    res.json(true);

                    return info.messageId;
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                    // Preview only available when sending through an Ethereal account
                    //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                }
                main().catch(console.error);


            }
        });
    } else {
        res.render('Admin/Login.html');
    }
}





//Editar Personal
Controller.DesactivarPersonal = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id
 
          
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("UPDATE empleados SET eNomina = 'Off' WHERE id = " + id, (err, rows) => {
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


//Editar Personal
Controller.ActivarPersonal = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id
 
            if (err) {
                console.log("Conexion: " + err)
            } else {
                conn.query("UPDATE empleados SET eNomina = 'On' WHERE id = " + id, (err, rows) => {
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

module.exports = Controller;