const Controller = {};
const OS = require("os");
/////////////////////////////////////////////////////////////////////--------------- REGISTRO ----------------------/////////////////////////////////////////////////////////////////////
Controller.save = (req,res) => {
    const data = req.body;
    const nombre = req.body.Planta;
    req.getConnection((err,conn) => {

        conn.query('INSERT INTO usuarios set ?',[data], (err, ot) =>{
            res.redirect('/Signup');
        });
    })
   /* console.log(req.body);//se obtienen los datos del formulario a traves del req.body
    res.send('works');*/
}


Controller.EliminarUsuario = (req,res) => {
    const data = req.body;
    const nombre = req.body.Planta;
    req.getConnection((err,conn) => {

        var id = Object.values(data)[0].id;

        conn.query("delete from usuarios WHERE id = '"+id+"'", (err, ot) =>{
            res.json(true);
        });
    })
   /* console.log(req.body);//se obtienen los datos del formulario a traves del req.body
    res.send('works');*/
}

/////////////////////////////////////////////////////////////////////--------------- LOGIN ----------------------/////////////////////////////////////////////////////////////////////
Controller.login = (req,res) => {
    req.session.Usuario = req.body.username;
    const username = req.body.username;
    const password = req.body.pass;
    req.getConnection((err,conn) => {
        conn.query('SELECT * FROM usuarios WHERE usuario = ? AND pass = ?',[username, password], (error, results, fields) =>{
            if(error){
                console.log(error);
                res.redirect('/');
                console.log('error en query' + error);
            }
            else if (Object.keys(results).length > 0)//si contiene almenso 1 resultado entra
            {
                const id = results[0].id//Obtener contraseña de la consulta
                const pass = results[0].pass//Obtener contraseña de la consulta
                const planta = results[0].Planta//Obtener contraseña de la consulta
                const nivel = results[0].Nivel//Obtener nivel de la consulta
                const Area = results[0].Area//Obtener nivel de la consulta
                const Turno = results[0].Turno//Obtener nivel de la consulta
                const Nombre = results[0].Nombre//Obtener nivel de la consulta
                if(password == pass){//si las contraseñas coinciden entran
                    req.session.loggedin = true;
                    req.session.idDB = id;
                    req.session.username = username;
                    req.session.planta = planta;
                    req.session.nivel = nivel;
                    req.session.area = Area;
                    //req.session.nombre = OS.hostname();
                    req.session.nombre = Nombre;
                    req.session.turno = Turno;
                    let ip = req.connection.remoteAddres;

                        conn.query("SELECT * FROM usuarios WHERE usuario = '"+username+"'", (err, user) => {
                            if (err) {
                 
                                console.log('Error de lectura ' +err);
                            }
                           /* let ip = Object.values(req)[33].slice(7);
                            user[0].ip = ip;//Se registra la ip del cliente
                            console.log(user[0]);*/
                            console.log(req.session.area)
                            if(req.session.username == 'operadorm' || req.session.username == 'operadorb'){
                                res.render('Calidad/Inspeccion/RegistrarInspeccion.html', {
                                    title: 'Gemak'
                                });
                            }else{
                                res.render('index.html', {
                                    data: user
                                });
                            }
                            
                        });
                    //res.send('works');
                }else{//si las contraseñas no coinciden
                    res.redirect('/');
                }
            }else //sin resultados
            {
                res.redirect('/');
                console.log('Error usaurio o contraseña' +error);
			}			
			//response.end();
        });        
    })
}

/////////////////////////////////////////////////////////////////////--------------- SignUp ----------------------/////////////////////////////////////////////////////////////////////
Controller.SignUp = (req,res) => {
    req.getConnection((err,conn) => {
        if (req.session.loggedin) {
            conn.query('SELECT * FROM usuarios',[], (error, results, fields) =>{
                if(error){
                    console.log(error);
                    res.redirect('/');
                    console.log('error en query');
                }
                else if (Object.keys(results).length > 0)//si contiene almenso 1 resultado entra
                {
                    res.render('Admin/Signup.html', {
                        data: results
                    });
                }
            });
       } else {
        res.redirect('/');
       }      
    })
}

/////////////////////////////////////////////////////////////////////--------------- HOME ----------------------/////////////////////////////////////////////////////////////////////
Controller.HOME = (req,res) => {
    req.getConnection((err,conn) => {
        if (req.session.loggedin) {
            console.log("EN home");
                conn.query("SELECT * FROM usuarios WHERE usuario = '"+ req.session.username+"'", (err, user) => {
                    if (err) {
                        console.log('Error de lectura');
                    }
                    console.log(user);
                    res.render('index.html', {
                        data: user
                    });
                });
       } else {
        res.redirect('/');
       }      
    })
}




module.exports = Controller;