const Controller = {};
const express = require('express');//guardar express en una variable de servidor
 

Controller.saveCP = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const data = req.body;//TRAE TODO EL OBJETO
            let longitud = Object.values(data)[0].length;
        
            for (let index = 0; index < longitud; index++) {
                let id = Object.values(data)[0][index].id
                let Clave = Object.values(data)[0][index].Clave
                let Producto = Object.values(data)[0][index].Producto
                let Almacen = Object.values(data)[0][index].Almacen
                let Stock = Object.values(data)[0][index].Stock
                let StockMin = Object.values(data)[0][index].StockMin
                let StockMax = Object.values(data)[0][index].StockMax
                let StockUsado = Object.values(data)[0][index].StockUsado
                let Ubicacion = Object.values(data)[0][index].Ubicacion
                let Estado = Object.values(data)[0][index].Estado
                let Categoria = Object.values(data)[0][index].Categoria
                let Familia = Object.values(data)[0][index].Familia
                let Ordenado = Object.values(data)[0][index].Ordenado
                let Cotizado = Object.values(data)[0][index].Cotizado
                let VISIBLE = Object.values(data)[0][index].VISIBLE
                let Proveedor = Object.values(data)[0][index].Proveedor
                let ProveedorSec = Object.values(data)[0][index].ProveedorSec
                let Precio = Object.values(data)[0][index].Precio
                let TiempoEntrega = Object.values(data)[0][index].TiempoEntrega
                let Moneda = Object.values(data)[0][index].Moneda
                let OC = Object.values(data)[0][index].OC
                let FechaCreacion = Object.values(data)[0][index].FechaCreacion
                let Creador = Object.values(data)[0][index].Creador
                let Stockafilado = Object.values(data)[0][index].Stockafilado 
                 
                let QueryString = "insert into almacen(Clave,Producto,Almacen,Stock,StockMin,StockMax,StockUsado,Ubicacion,Estado,Categoria,Familia,Ordenado,Cotizado,Visible,Proveedor,ProveedorSec,Precio,Moneda,TiempoEntrega,OC,Creador,FechaCreacion,Stockafilado) Values "
                conn.query(QueryString + "('"+Clave+"','"+Producto+"','"+Almacen+"',"+Stock+","+StockMin+","+StockMax+","+StockUsado+",'"+Ubicacion+"','"+Estado+"','"+Categoria+"','"+Familia+"',"+Ordenado+","+Cotizado+","+VISIBLE+",'"+Proveedor+"','"+ProveedorSec+"','"+Precio+"','"+Moneda+"','"+TiempoEntrega+"','"+OC+"','"+Creador+"','"+FechaCreacion+"',"+Stockafilado+")", (err, Herramientas) => {
                    if (err) {
                        console.log('Error de lectura' + err);
                    }else{
                        console.log(Herramientas)
                    }
                    //res.json(Herramientas);
                }); 
            }
        });
    } else {
        res.render('Admin/Login.html');
    }
};


 







module.exports = Controller;