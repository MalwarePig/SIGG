const Controller = {};

///////// == Resumen == ////////////////////////////// == Resumen == ////////////////////////////// == Resumen == ////////////////////////// == Resumen == //////////////////// == Resumen == ///////////////////// == Resumen 
Controller.Resumen = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnection((err, conn) => {
            const {Variabl} = req.params;

            var Planta = "Almacen " + req.session.planta;
            conn.query("", [], (err, Pronostico) => {
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


module.exports = Controller;
