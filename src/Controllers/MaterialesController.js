const Controller = {};


Controller.MostrarReporte = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const {
                parametros
            } = req.params;
            console.log(parametros)
            var Planta = parametros.split('|')[0]; // categoria o tipo de reporte
            var fechaInicio = parametros.split('|')[1]; // Fecha inicial
            var fechafin = parametros.split('|')[2]; // Fecha limite
  
            conn.query("SELECT * FROM controlplaner WHERE Planta = '" + Planta + "' AND FechaRegistro BETWEEN '" + fechaInicio + "' AND '" + fechafin + "'", (err, Herramientas) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                console.table(Herramientas)
                res.json(Herramientas)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


Controller.ActualizarMaterial = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            console.log(Object.values(data)[0]);
            var id = Object.values(data)[0].id; //obeter datos de un objeto id
            var Comentarios = Object.values(data)[0].Comentarios; //obeter datos de un objeto Producto
            let Materialista = req.session.username;
            console.log("id " + id + "','" + Comentarios  + " " + Materialista);
            if (err) {
                console.log("Conexion: " + err)
            } else {

                conn.query("UPDATE controlplaner SET Comentarios = '"+Comentarios+"'  WHERE id = "+id, (err, data) => {
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




























Controller.CargaMaterial = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
          //console.log("Tamaño " + Object.values(data).length + " keys " +  Object.values(data)[0][0][1]  );
           var limite = Object.values(data)[0].length;
           for(var i = 0; i < limite; i ++){
            var OT = Object.values(data)[0][i][0];//[No se][indice de fila][indice de columna]
            var NoParte = Object.values(data)[0][i][1];
            var Proveedor = Object.values(data)[0][i][2];
            var Colada = Object.values(data)[0][i][3];
            var OD = Object.values(data)[0][i][4];
            var InD = Object.values(data)[0][i][5];
            var LG = Object.values(data)[0][i][6];
            var QTY = Object.values(data)[0][i][7];
            var SPEC = Object.values(data)[0][i][8];
            var Ubicacion = Object.values(data)[0][i][9];
            var PESO = Object.values(data)[0][i][10];
            var Entrada =  Object.values(data)[0][i][11];
            var Salida =  Object.values(data)[0][i][12];
            var Entregado =  Object.values(data)[0][i][13];
            var Status =  Object.values(data)[0][i][14];
            var Sobran =  Object.values(data)[0][i][15];
            var Usado =  Object.values(data)[0][i][16];
            var Notas =  Object.values(data)[0][i][17];
 
            conn.query("INSERT INTO StockMateriales(OT, NoParte, Proveedor, Colada, OD, InD, LG, QTY, SPEC, Ubicacion, PESO, Entrada, Salida, Entregado, Status, Sobran, Usado, Notas)values('"+OT +"','"+ NoParte+"','"+ Proveedor+"','"+ Colada+"','"+ OD+"','"+ InD+"','"+ LG+"','"+ QTY+"','"+ SPEC+"','"+ Ubicacion+"','"+ PESO+"','"+ Entrada+"','"+ Salida+"','"+ Entregado+"','"+ Status+"','"+ Sobran+"','"+ Usado+"','"+ Notas+"')", [], (err, ot) => {
                if (err) {
                     
                    console.log('Error al registrar recepcion'+err);
                }else{
                    console.log('Recepcion exitosa: '+i);
                }
            });
           }//For
           
        });
    } else {
        //res.render('Admin/Login.html');
    }
};

Controller.listaMateriales = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }else{
                conn.query("SELECT * FROM stockmateriales", (err, Materiales) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error de lectura');
                    }
                    res.render('Materiales/ListadoMaterial.html', {
                        data: Materiales,
                    });
                });
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};










module.exports = Controller;
















