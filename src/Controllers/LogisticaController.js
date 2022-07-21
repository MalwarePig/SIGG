const Controller = {};

Controller.NuevaImportacion = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
           
            var limite = Object.values(data).length;
            //console.log("Tamaño " + Object.values(data).length + " keys " +  Object.values(data)[0][1]  );
            for (var i = 0; i < limite; i++) {
 
                var Pedimento = Object.values(data)[i][0];
                var Origen = Object.values(data)[i][1];
                var Proveedor = Object.values(data)[i][2];
                var Factura = Object.values(data)[i][3];
                var Monto = Object.values(data)[i][4];
                var Cantidad = Object.values(data)[i][5];
                var OT = Object.values(data)[i][6];
                var OC = Object.values(data)[i][7];
                var Descripcion = Object.values(data)[i][8];
                var Diametro = Object.values(data)[i][9];
                var DiametroIn = Object.values(data)[i][10];
                var Largo = Object.values(data)[i][11];
                var LBS = Object.values(data)[i][12];
                var KG = Object.values(data)[i][13];
                var Colada = Object.values(data)[i][14];
                var Tarima = Object.values(data)[i][15];

                conn.query("INSERT INTO Importaciones(Pedimento,Origen,Proveedor,Factura,Monto,Cantidad,OT,OC,Descripcion,Diametro,DiametroIn,Largo,LBS,KG,Colada,Tarima)values('"+Pedimento + "','" + Origen + "','" + Proveedor + "','" + Factura + "','" + Monto +  "','"  + Cantidad + "','" + OT + "','" + OC + "','" + Descripcion + "','" + Diametro + "','" + DiametroIn + "','" + Largo + "','" + LBS + "','" + KG + "','" + Colada + "','" + Tarima +"')", [], (err, ot) => {
                    if (err) {
                        console.log('Error al registrar recepcion' + err);
                    } else {
                        console.log('Recepcion exitosa: ' + i);
                    }
                });
            }
        });
    } else {
        //res.render('Admin/Login.html');
    }
};

///////// == Pedimento == ////////////////////////////// == Pedimento == ////////////////////////////// == Pedimento == ////////////////////////// == Pedimento == //////////////////// == Pedimento == ///////////////////// == Pedimento == ///////////////////////////////////////////////////////////////
Controller.BuscarPedimento = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {Variable} = req.params;
            console.log("Variable: "+ Variable);
            conn.query("SELECT * FROM Importaciones WHERE CONCAT_WS(Pedimento,Origen, Proveedor, Factura, OT, OC, Descripcion, Colada) LIKE '%"+Variable+"%'", (err, Herramientas) => {
                if (err) {
                    console.log('Error de lectura' + err);
                }
                console.table(Herramientas);
                res.json(Herramientas);
            });
        });
    } else {
        res.render('Login.html');
    }
};


///////// == Kits == ////////////////////////////// == Kits == ////////////////////////////// == Kits == ////////////////////////// == Kits == //////////////////// == Kits == ///////////////////// == Kits == ////////////////
Controller.Kits = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {Variable} = req.params;
            conn.query("SELECT * FROM Kits WHERE Parte = '"+Variable+"'", (err, Kits) => {
                if (err) {
                    console.log('Error de lectura');
                }
                console.table(Kits);
                res.json(Kits);
            });
        });
    } else {
        res.render('Login.html');
    }
};

///////// == Componentes == ////////////////////////////// == Componentes == ////////////////////////////// == Componentes == ////////////////////////// == Componentes == //////////////////// == Componentes == ///////////////////// == Componentes == ////////////////
Controller.Componentes = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {Variable} = req.params;
            conn.query("SELECT * FROM Componentes WHERE PO = '"+Variable+"'", (err, Componentes) => {
                if (err) {
                    console.log('Error de lectura');
                }
                console.table(Componentes);
                res.json(Componentes);
            });
        });
    } else {
        res.render('Login.html');
    }
};

///////// == SubComponentes == ////////////////////////////// == SubComponentes == ////////////////////////////// == SubComponentes == ////////////////////////// == SubComponentes == //////////////////// == SubComponentes == ///////////////////// == SubComponentes == ////////////////
Controller.SubComponentes = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {Variable} = req.params;
            conn.query("SELECT * FROM SubComponentes WHERE Parte = '"+Variable+"'", (err, Componentes) => {
                if (err) {
                    console.log('Error de lectura');
                }
                console.table(Componentes);
                res.json(Componentes);
            });
        });
    } else {
        res.render('Login.html');
    }
};






 


module.exports = Controller;