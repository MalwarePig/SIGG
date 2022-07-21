const Controller = {};

/////////////////////////////////////////////////////////////////////--------------- REGISTRO ----------------------/////////////////////////////////////////////////////////////////////
Controller.save = (req,res) => {
    const data = req.body;
    const nombre = req.body.Planta;
    req.getConnection((err,conn) => {

        conn.query('INSERT INTO maquinas set ?',[data], (err, ot) =>{
            res.redirect('/Alta_Maquina');
        });
    })
   /* console.log(req.body);//se obtienen los datos del formulario a traves del req.body
    res.send('works');*/
}




module.exports = Controller;