const Controller = {};
var fun = require('../Functions/FuncionesHorarios');

/////////////////////////////////////////////////////////////////////--------------- REGISTRO HORARIOS  ----------------------/////////////////////////////////////////////////////////////////////

//============================== GUARDAR HORARIO =======================================
Controller.save = (req,res) => {
    const data = req.body;//TRAE TODO EL OBJETO
    var TablaHorarios = {
        Maquina : Object.values(data)[0],//obeter datos de un objeto
        TrabajadorUno : Object.values(data)[1],//obeter datos de un objeto
        TrabajadorDos : Object.values(data)[2],//obeter datos de un objeto
    }
   
    req.getConnection((err,conn) => {
        conn.query('INSERT INTO horarios set ? ',[TablaHorarios],  (err, fields) =>{
            if(err){
                console.log(err);
            }
            console.log(fields);
            //res.redirect('/cPlaner');
        });
    })
    
  console.log(req.body);//se obtienen los datos del formulario a traves del req.body
    res.send('works');
}

//============================== LISTAR MAQUINAS =======================================


Controller.list = (req,res)=> {
    if(req.session.loggedin){
        req.getConnection((err,conn) => {
            conn.query('SELECT Nombre FROM maquinas order by Familia',(err, Maquinas) =>{//consulta Maquinas
                if(err){
                    res.json(err);
                    console.log('Error de lectura de Maquinas');
                }
                conn.query("SELECT * FROM empleados", [], (err, rows) => {//consulta Empleados
                    if(err){
                    console.log("Error en lectura de empleados: " + err);
                    }
                    res.render('Producción/Horarios.html', {
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