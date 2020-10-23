const Controller = {};
const express = require('express'); //guardar express en una variable de servidor


///////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////////// == SALIDA == ////////////////////////// == SALIDA == //////////////////// == SALIDA == ///////////////////// == SALIDA == ///////////////////////////////////////////////////////////////
Controller.searchPlanta = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {Herramienta} = req.params;
            var Herramientas = Tranformer(Herramienta);
            console.log("HErramienta; " + Herramientas)
            var Planta = "Almacen " + req.session.planta;
            conn.query("SELECT * FROM almacen WHERE Producto LIKE '%"+ Herramientas + "%' AND Almacen = '" + Planta + "'", (err, Herramientas) => {
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

///////// == Pronostico Save == ////////////////////////////// == Pronostico Save == ////////////////////////////// == Pronostico Save == ////////////////////////// == Pronostico Save == //////////////////// 
Controller.SavePronostico = (req,res) => {
    req.getConnection((err,conn) => {
        
        const data = req.body;
        var Clave = Object.values(data)[0];
        var Producto = Object.values(data)[1];
        var Cantidad = Object.values(data)[2];
        var OT = Object.values(data)[3];
        var Comentarios = Object.values(data)[4];
        var Estatus = Object.values(data)[5];
        var Planta = "Almacen " + req.session.planta;
        var EmpleadoReq = req.session.nombre;
    
        console.log(Clave + " "  + Producto);

        conn.query('INSERT INTO pronostico(Clave,Producto,Cantidad,OT,Comentarios,Planta,Estatus,EmpleadoReq)VALUES(?,?,?,?,?,?,?,?)',[Clave,Producto,Cantidad,OT,Comentarios,Planta,Estatus,EmpleadoReq], (err, ot) =>{
            if(err){
                console.log(err);
            }
        });
    })
}

///////// == Pronostico Show == ////////////////////////////// == Pronostico Show == ////////////////////////////// == Pronostico Show == ////////////////////////// == Pronostico Show == //////////////////// 

Controller.list = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            if (err) {
                console.log("Conexion: " + err)
            }
            var Planta = "Almacen " + req.session.planta;
            conn.query("SELECT Clave,Producto,OT,Cantidad,Estatus FROM pronostico WHERE Planta = '" + Planta + "' order by OT,FechaReq", (err, Pronostico) => {
                if (err) {
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.render('Proceso/PronosticoOT.html', {
                    data: Pronostico,
                });
            });
        });
    } else {
        res.render('Login.html');
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