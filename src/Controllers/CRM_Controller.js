const Controller = {};
var OP = require('../public/js/Funciones.js');
var fun = require('../Functions/ajusteFechas');
const express = require('express');//guardar express en una variable de servidor
const router = express.Router(); //usar modulo de router de ex´press

/////////////////////////////////////////////////////////////////////--------------- CLIENTES  ----------------------/////////////////////////////////////////////////////////////////////
Controller.list = (req,res)=> {
    if(req.session.loggedin){
        //res.send('Metodo Get list');
        req.getConnection((err,conn) => {
            conn.query('SELECT * FROM Clientes',(err, clientes) =>{
                if(err){
                    res.json(err);
                    console.log('Error de lectura');
                }
                /*----------------*/ 
                conn.query('call Estadistica();',true,(err, rows,fields) =>{
                    if(err){
                        res.json(err);
                        console.log('Error de lectura 2');
                    }
                    console.log("Estadisticas seca: "+ Object.values(rows[0][0]));
                    console.log("Estadisticas unitario: " + Object.values(rows[0][0])[0]);
                    var obj = {
                       Clientes : Object.values(rows[0][0])[0],//es el campo activos de la consulta de SP
                       Contactos : Object.values(rows[0][0])[1],//es el campo Vencidos de la consulta de SP
                       Nuevos : Object.values(rows[0][0])[2]//es el campo Total de la consulta de SP
                    }
                    console.log("obj: " + Object.values(obj));
                    res.render('CRM/Contactos.html', {
                        data: clientes, 
                        Estadistica:  obj                 
                    });
                });

                /*-----------------*/
            });
        });
    }else{
        res.render('Login.html');
    }
};

Controller.save = (req,res) => {
    const data = req.body;
    console.log(data);
    req.getConnection((err,conn) => {

        conn.query('INSERT INTO Clientes set ?',[data], (err, ot) =>{
            if(err){
                console.log(err);
            }
            res.redirect('/Contactos');
        });
    })
}


Controller.AddVendedor = (req,res) => {
    const data = req.body;
    console.log(data);
    req.getConnection((err,conn) => {

        conn.query('INSERT INTO Vendedor set ?',[data], (err, ot) =>{
            if(err){
                console.log(err);
            }
            res.redirect('/Contactos');
        });
    })
}
Controller.delete = (req,res) => {
    const { id } = req.params;
    req.getConnection((err,conn) => {
        conn.query('DELETE FROM ControlPlaner WHERE id = ?',[id], (err, rows) =>{
            res.redirect('/Ordenes');
        });
    })
};


//ACTUALIZA REGISTROS EN DB
Controller.Update = (req,res) => {
    const data = req.body;//TRAE TODO EL OBJETO
    var id = Object.values(data)[0];//obeter datos de un objeto
    var TablaClientes = {
        id : Object.values(data)[0],//obeter datos de un objeto
        Cliente : Object.values(data)[1],//obeter datos de un objeto
        Pagina : Object.values(data)[2],//obeter datos de un objeto
        Direccion : Object.values(data)[3],//obeter datos de un objeto
        Pais : Object.values(data)[4],//obeter datos de un objeto
        Estado : Object.values(data)[5],//obeter datos de un objeto
        Planta : Object.values(data)[6],//obeter datos de un objeto
        contacto : Object.values(data)[7],//obeter datos de un objeto
        Correo : Object.values(data)[8],//obeter datos de un objeto
        Puesto : Object.values(data)[9],//obeter datos de un objeto
        Telefono : Object.values(data)[10],//obeter datos de un objeto
        Celular : Object.values(data)[11],//obeter datos de un objeto
        Fuente : Object.values(data)[13],//obeter datos de un objeto
        Industria : Object.values(data)[14],//obeter datos de un objeto
        Estatus : Object.values(data)[15],//obeter datos de un objeto
        Gasto : Object.values(data)[16],//obeter datos de un objeto
        Comentarios : Object.values(data)[17],//obeter datos de un objeto
    }
    req.getConnection((err,conn) => {
        conn.query('UPDATE Clientes SET ? WHERE id = ?',[TablaClientes,id],  (err, fields) =>{
            if(err){
                console.log(err);
            }
        });
    })
}
/////////////////////////////////////////////////////////////////   TAREAS    /////////////////////////////////////////////////////////////////////////////////

Controller.listTareas = (req,res)=> {
    if(req.session.loggedin){
        //res.send('Metodo Get list');
        req.getConnection((err,conn) => {
            conn.query('SELECT * FROM Tareas',(err, Tareas) =>{
                if(err){
                    res.json("Error json: " + err);
                    console.log('Error de lectura');
                }
                res.render('CRM/Tareas.html', {
                    data: Tareas,
                });
            });
        });
    }else{
        res.render('Login.html');
    }
};


// ===================================================  TAREAS   ================================================================//
Controller.listWorks = (req,res)=> {
    if(req.session.loggedin){
        //res.send('Metodo Get list');
        req.getConnection((err,conn) => {
            conn.query('SELECT * FROM Tareas',(err, tareas) =>{
                if(err){
                    res.json(err);
                    console.log('Error de lectura');
                }
                conn.query('SELECT * FROM Clientes',(err, Clientes) =>{
                    if(err){
                        res.json(err);
                        console.log('Error de lectura');
                    }
                    conn.query('SELECT * FROM vendedor',(err, vendedor) =>{
                        if(err){
                            res.json(err);
                            console.log('Error de lectura');
                        }
                        res.render('CRM/Tareas.html', {
                            data: tareas,
                            cliente: Clientes,
                            vendedores: vendedor              
                        });
                    });
                });
            });
        });
    }else{
        res.render('Login.html');
    }
};

module.exports = Controller;