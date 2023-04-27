const Controller = {};
const express = require('express');//guardar express en una variable de servidor
 

Controller.saveCP = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const data = req.body;//TRAE TODO EL OBJETO
            let longitud = Object.values(data)[0].length;
        
            for (let index = 0; index < longitud; index++) {
                let Clave = Object.values(data)[0][index].Clave
                let Producto = Object.values(data)[0][index].Producto
                let Almacen = Object.values(data)[0][index].Almacen
                let Min = Object.values(data)[0][index].Min
                let Max = Object.values(data)[0][index].Max
                let Proveedor = Object.values(data)[0][index].Proveedor
                let Precio = Object.values(data)[0][index].Precio
                let Moneda = Object.values(data)[0][index].Moneda
                let tEntrega = Object.values(data)[0][index].tEntrega
                console.log(Producto + "|"+Almacen+ "|"+Min+ "|"+Max+ "|"+Proveedor+ "|"+Precio+ "|"+Moneda+ "|"+tEntrega)
                conn.query("UPDATE Almacen SET StockMin = "+Min+", StockMax = "+Max+",Proveedor = '"+Proveedor+"',Precio = "+Precio+", Moneda ='"+Moneda+"',TiempoEntrega = '" +tEntrega +"' WHERE Producto = '"+Producto+"'", (err, Herramientas) => {
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