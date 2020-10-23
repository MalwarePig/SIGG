const Controller = {};
const express = require('express'); //guardar express en una variable de servidor

///////// == Pronostico Show == ////////////////////////////// == Pronostico Show == ////////////////////////////// == Pronostico Show == ////////////////////////// == Pronostico Show == //////////////////// 

Controller.list = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            conn.query("SELECT pronostico.id,pronostico.Clave, pronostico.Producto, pronostico.Cantidad, almacen.Stock, pronostico.OT, pronostico.Comentarios, pronostico.Planta, pronostico.EmpleadoReq, pronostico.FechaReq, pronostico.Estatus FROM pronostico" +
                " INNER JOIN almacen ON pronostico.Producto = almacen.Producto WHERE Estatus = 'Viva'", [], (err, Pronostico) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error al registrar despacho de herramienta');
                    }
                    res.render('Compras/Pronosticos.html', {
                        data: Pronostico
                    });
                });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


///////// == Resumen == ////////////////////////////// == Resumen == ////////////////////////////// == Resumen == ////////////////////////// == Resumen == //////////////////// == Resumen == ///////////////////// == Resumen 
Controller.Resumen = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {Herr} = req.params;
            var Herramienta = Tranformer(Herr);
            var Planta = "Almacen " + req.session.planta;
            conn.query("SELECT pronostico.id,pronostico.Clave, pronostico.Producto, pronostico.Cantidad, almacen.Stock, pronostico.OT, pronostico.Comentarios, pronostico.Planta, pronostico.EmpleadoReq, pronostico.FechaReq, pronostico.Estatus FROM pronostico" +
            " INNER JOIN almacen ON pronostico.Producto = '" +Herramienta+ "' AND almacen.Producto = '"+Herramienta+"' AND pronostico.Planta = '"+Planta+"' AND almacen.Almacen = '"+Planta+"'", [], (err, Pronostico) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.json(Pronostico)
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};

///////// == NotaCompras Save == ////////////////////////////// == NotaCompras Save == ////////////////////////////// == NotaCompras Save == ////////////////////////// == NotaCompras Save == //////////////////// 
Controller.NotaCompras = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
            var Folio = Object.values(data)[0]; //obeter datos de un objeto Folio
            var Clave = Object.values(data)[1]; //obeter datos de un objeto Folio
            var Producto = Object.values(data)[2]; //obeter datos de un objeto Folio
            var Cantidad = Object.values(data)[3]; //obeter datos de un objeto Folio
            var OT = Object.values(data)[4]; //obeter datos de un objeto Folio
            var Comentarios = Object.values(data)[5]; //obeter datos de un objeto Folio
            var Empleado = req.session.nombre; //obeter datos de un objeto Folio
            var Planta = req.session.planta;
            var Estatus = 'Requerido';

            if (err) {
                console.log("Conexion: " + err);
            }
            console.log(Folio + " -Clave " +Clave + " -producto " + Producto + " -Cantidad " + Cantidad + " -OT " + OT + " -Comentario " + Comentarios + " - Empleado" + Empleado + " -Planta " + Planta + " -Estatus " + Estatus);
            conn.query('INSERT INTO requisiciones(Folio, Clave, Producto, CantidadReq, OT, Comentarios, EmpleadoReq, Planta, Estatus)values(?,?,?,?,?,?,?,?,?)', [Folio, Clave, Producto, Cantidad, OT, Comentarios, Empleado, Planta, Estatus], (err, ot) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error al registrar requerimiento');
                }
                conn.query("UPDATE pronostico SET Estatus = 'Por requerir' WHERE Producto = '"+Producto + "' AND OT = '"+OT+"'", [Folio, Clave, Producto, Cantidad, OT, Comentarios, Empleado, Planta, Estatus], (err, ot) => {
                    if (err) {
                        res.json("Error json: " + err);
                        console.log('Error al registrar s');
                    }
                });
            });
        });
    } else {
        res.render('Admin/Login.html');
    }
};


//Intercambiar el diagonal por otro simbolo para no tener problemas con el url
function Tranformer (variable){
    var Herramienta = "";
    for(var q = 0; q< variable.length;q++){
       if(variable.charAt(q) == '|'){
           Herramienta += '/';
       }else{
        Herramienta += variable.charAt(q);
       }
    }
    return Herramienta;
}


module.exports = Controller;


