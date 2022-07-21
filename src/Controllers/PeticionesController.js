const Controller = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Manda linea a Tratamiento externos
Controller.SolicitarCompra = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body;

            var Folio = Object.values(data)[0].Folio;
            var OT = Object.values(data)[0].OT;
            var PN = Object.values(data)[0].PN;
            var Fecha = Object.values(data)[0].Fecha;
            var Nombre = Object.values(data)[0].Nombre;
            var Correo = Object.values(data)[0].Correo;
            var Producto = Object.values(data)[0].Producto;
            var Cantidad = Object.values(data)[0].Cantidad;
            var Link = Object.values(data)[0].Link;
            var Notas = Object.values(data)[0].Notas;
 
            //Insert la linea en la nueva area
            conn.query("INSERT INTO SoliCompra(Folio,OT,PN,Nombre,Correo,Producto,Cantidad,Link,Notas)VALUES('"+Folio+"','" + OT + "','" + PN + "','" + Nombre + "','" + Correo + "','" + Producto + "',"+Cantidad+",'" + Link + "','" + Notas + "')", true, (err, rows) => {
                if (err) {
                    console.log('Error al Transferir' + err);
                } else { 

                }
            });

        });
    } else {
        res.render('Admin/Login.html');
    }
};


// Manda linea a Tratamiento externos
Controller.ActualizarCompra = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body;

            var Folio = Object.values(data)[0].Folio;
            var OT = Object.values(data)[0].OT;
            var PN = Object.values(data)[0].PN;
            var Fecha = Object.values(data)[0].Fecha;
            var Nombre = Object.values(data)[0].Nombre;
            var Correo = Object.values(data)[0].Correo;
            var Producto = Object.values(data)[0].Producto;
            var Cantidad = Object.values(data)[0].Cantidad;
            var Link = Object.values(data)[0].Link;
            var Notas = Object.values(data)[0].Notas;
 
            //Insert la linea en la nueva area
            conn.query("UPDATE SoliCompra SET OT = '" + OT + "',PN ='" + PN + "',Nombre='" + Nombre + "',Correo='" + Correo + "',Producto ='" + Producto + "', Cantidad="+Cantidad+", Link='" + Link + "',Notas='" + Notas + "' WHERE Folio = '"+Folio+"'", true, (err, rows) => {
                if (err) {
                    console.log('Error al actualizar' + err);
                } else { 

                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

// Manda linea a Tratamiento externos
Controller.EliminarCompra = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body;

            var Folio = Object.values(data)[0].Folio;
 
            //Insert la linea en la nueva area
            conn.query("DELETE FROM SoliCompra WHERE Folio = '" + Folio + "'", true, (err, rows) => {
                if (err) {
                    console.log('Error al actualizar' + err);
                } else { 

                }
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};



///////// == Pronostico Show == ////////////////////////////// == Pronostico Show == ////////////////////////////// == Pronostico Show == ////////////////////////// == Pronostico Show == //////////////////// 

Controller.BuscarPeticion = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            var {
                Folio
            } = req.params;
            conn.query("SELECT * FROM SoliCompra WHERE Folio = '" + Folio + "'", (err, data) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(data)
            });
        });
    } else {
        res.render('Login.html');
    }
};
module.exports = Controller;