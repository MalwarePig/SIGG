const Controller = {};
var fun = require('../Functions/FuncionesHorarios');

/////////////////////////////////////////////////////////////////////--------------- REGISTRO ----------------------/////////////////////////////////////////////////////////////////////
Controller.save = (req,res) => {
    const data = req.body;
    req.getConnection((err,conn) => {

        conn.query('INSERT INTO Horarios set ?',[data], (err, ot) =>{
            res.redirect('/Admin');
        });
    })
}
/*
Controller.list = (req,res)=> {
    if(req.session.loggedin){
        req.getConnection((err,conn) => {
            conn.query('SELECT Nombre FROM Maquinas order by Familia',(err, Maquinas) =>{//consulta Maquinas
                if(err){
                    res.json(err);
                    console.log('Error de lectura de Maquinas');
                }
                console.log("Ni hay maquinas:" + Object.values(Maquinas[0]));
                res.render('Pruebas.html', {                   
                    data: Maquinas                              
                });
            });
        });
    }else{
        res.send('Please login to view this page!');
    }
};*/


Controller.list = (req,res)=> {
    if(req.session.loggedin){
        req.getConnection((err,conn) => {
            conn.query('SELECT Nombre FROM Maquinas order by Familia',(err, Maquinas) =>{//consulta Maquinas
                if(err){
                    res.json(err);
                    console.log('Error de lectura de Maquinas');
                }
                conn.query("SELECT * FROM Empleados", [], (err, rows) => {//consulta Empleados
                    if(err){
                    console.log("Error en lectura de empleados: " + err);
                    }
                    res.render('Pruebas.html', {
                        data: Maquinas,
                        Empleados: rows                                 
                    });
                });
            });
        });
    }else{
        res.send('Please login to view this page!');
    }
};


module.exports = Controller;