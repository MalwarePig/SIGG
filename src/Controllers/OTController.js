const Controller = {};
var OP = require('../public/js/Funciones.js');
var fun = require('../Functions/ajusteFechas');
const express = require('express');//guardar express en una variable de servidor
var pruebasql = require('../Functions/MySQL');

/////////////////////////////////////////////////////////////////////--------------- ORDENES  ----------------------/////////////////////////////////////////////////////////////////////
/*
Controller.list = (req,res)=> {
    //res.send('Metodo Get list');
    req.getConnection((err,conn) => {
        conn.query('SELECT * FROM OT',(err, ot) =>{
            if(err){
                res.json(err);
                console.log('Error de lectura');
            }
            res.render('Ordenes.html', {
                data: ot
            });
        });
    });
};*/

//LLenado manual de orden en Ordenes.html
Controller.save = async (req,res) => {
    const data = req.body;
    const NumPart = req.body.NumPart;
    const OT = req.body.OT;
    const Cantidad = req.body.Cantidad;
    const Horas = req.body.Horas;
    const Maquina = req.body.ListMaquina;
    const Estatus =req.body.Estatus;
    const FechaVenc =  req.body.vencimiento;
    let Planta = req.session.planta;
    var inicio = new Date(req.body.Inicio);
    inicio.setMinutes(inicio.getMinutes() + inicio.getTimezoneOffset());//SE AJUSTA FECHA Y HORA
    console.log(NumPart,inicio,Horas,Cantidad,Maquina,Planta);
    await OP.Funciones.CalcularFechaFin(NumPart,inicio,Horas,Cantidad,Maquina,Estatus,FechaVenc,OT,Planta);
    /*===========================   SE RETRASA 2 SEGUNDOS ANTES DE LANZAR LA PAGINA   ================================*/
    var myVar = setInterval(myTimer, 2000);
    function myTimer() {
        res.redirect('/Ordenes');
        clearTimeout(myVar);//se resetea el timer para evitar autoejecucion
    }
}

Controller.ActualizarOT = (req, res) => {
    if (req.session.loggedin) {
        req.getConnection((err, conn) => {
            const data = req.body; //TRAE TODO EL OBJETO
          console.log(data)

                var OT = Object.values(data)[0][0]; //obeter datos de un objeto id
                var Parte = Object.values(data)[0][1]; //obeter datos de un objeto Item
                var Estatus = Object.values(data)[0][2]; //obeter datos de un objeto Cantidad
                var Cantidad = Object.values(data)[0][3]; //obeter datos de un objeto id
                var Horas = Object.values(data)[0][4]; //obeter datos de un objeto Item
                var vencimiento = Object.values(data)[0][5]; //obeter datos de un objeto Cantidad
                var Planta = Object.values(data)[0][6]; //obeter datos de un objeto id
                var Maquina = Object.values(data)[0][7]; //obeter datos de un objeto Item

                console.log(OT,Parte,Estatus,Cantidad,Horas,vencimiento,Planta,Maquina);
                conn.query("UPDATE controlplaner SET Maquina ='"+Maquina+"' WHERE OT = '"+OT+"'",(err, ot) =>{
                    if(err){
                        res.json(err);
                        console.log('Error de lectura'+err);
                    }
                    res.json(ot);
                });
        });
    }else{
        res.render('Admin/Login.html');
    }
};


/*
Controller.save = (req,res) => {
    const data = req.body;
    req.getConnection((err,conn) => {
        conn.query('INSERT INTO OT set ?',[data], (err, ot) =>{
           //console.log(ot);
            res.redirect('/Ordenes');
        });
    })
   /* console.log(req.body);//se obtienen los datos del formulario a traves del req.body
    res.send('works');
}*/

Controller.delete = (req,res) => {
    const { id } = req.params;
    req.getConnection((err,conn) => {
        conn.query('DELETE FROM controlplaner WHERE id = ?',[id], (err, rows) =>{
            res.redirect('/Ordenes');
        });
    })
};

Controller.list = (req,res)=> {
    if(req.session.loggedin){
        //res.send('Metodo Get list');
        req.getConnection((err,conn) => {
            res.render('Producción/Ordenes.html', {
                                  
            });
        });
    }else{
        res.send('Please login to view this page!');
    }
};


Controller.CargarTodoOT = (req,res)=> {
    if(req.session.loggedin){
        //res.send('Metodo Get list');
        req.getConnection((err,conn) => {
            conn.query('SELECT * FROM controlplaner',(err, ot) =>{
                if(err){
                    res.json(err);
                    console.log('Error de lectura');
                }
                res.json(ot);
            });
        });
    }else{
        res.send('Please login to view this page!');
    }
};


/////////////////////////////////////////////////////////////////////--------------- MAQUINAS ----------------------/////////////////////////////////////////////////////////////////////
/*
router.post('/test', function (req, res, next) {
    db.query("select COLUMN_NAME from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'registros'; ", (error, results, fields) => {
        if (error) throw error;
        db.query("SELECT * FROM registros", (error, resp, fields) => {
            if (error) throw error;
            res.render('test', {
                dataRegistros: resp,
                columnNames: results
            });
        });
    });
});*/
//**********************************************************************************
Controller.listMaquinas = (req,res)=> {
    if(req.session.loggedin){//se verifica si el usuario esta logueado
        //res.send('Metodo Get list');
        req.getConnection((err,conn) => {
            conn.query('SELECT * FROM controlplaner',(err, ot) =>{
                if(err){
                    res.json(err);
                    console.log('Error de lectura');
                }
                conn.query("SELECT * FROM maquinas", [], (err, rows) => {//consulta OT siguienes a pivote [C]
                    if(err){
                    console.log("No funciona sql: " + err);
                    }
                    res.render('Producción/Maquinas.html', {
                        data: ot,
                        Maquinas: rows                       
                    });
                });
            });
        });
    }else{
        res.send('Please login to view this page!');
    }
};

//ENVIA INFORMACION A LA PAGINA PARA SER EDITADA
Controller.edit = (req,res)=> {
    const { id } = req.params;//recibir valores del formulario
    req.getConnection((err, conn) =>{
        if(err){
            console.log("Tipo de error mysql: " + err);
        }
        conn.query('SELECT * FROM controlplaner WHERE id = ?', [id], (err, ordenes) => {
            if(err){
                console.log("Tipo de error: " + err);
            }
            res.render('Producción/Update.html', {
                data: ordenes[0]
            });
        });
    });
};

//ACTUALIZA REGISTROS EN DB
Controller.update = (req,res)=> {
    try{
        //recibir valores del formulario
        const { id } = req.params;
        var numPart = req.body.numPart;
        var maquina = req.body.maquina;
        var FechaInicio = req.body.FechaInicio;
        var FechaProd = req.body.FechaProd;
        //recibir valores del formulario
        const newOT = req.body;
        //Objetos
        var Pivote;
        req.getConnection((err, conn) =>{
            //conn.query('SELECT * FROM ControlPlaner WHERE id = ?', [id], (err, ordenes) => {           
            conn.query("SELECT * FROM controlplaner WHERE id = '"+ id + "'", [], (err, consulta) => {//CONSULTA DE OT REFERENTE A LA ID [A]
                if(err){
                    console.log(err);
                }
                //console.log(ordenes);
                Pivote = consulta;
            });
            
            fun.Funciones(id,newOT,Pivote,maquina,numPart,FechaInicio,res);
            /*//ACTUALIZAR DB
            conn.query('UPDATE ControlPlaner SET ? WHERE id = ?', [newOT, id], (err, ordenes) => {// UPDATE  A[B]
                if(err){
                    console.log(err);
                }
                res.redirect('/Maquinas');
            });*/
        });
    }catch(err){
        console.log("Error: " + err);
        res.redirect('/');
    }
};
    










module.exports = Controller;