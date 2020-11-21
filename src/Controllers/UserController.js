const Controller = {};

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

/////////////////////////////////////////////////////////////////////--------------- LOGIN ----------------------/////////////////////////////////////////////////////////////////////
Controller.login = (req,res) => {
    req.session.Usuario = req.body.username;
    const username = req.body.username;
    const password = req.body.pass;
    const nombre = req.body.nombre;
    req.getConnection((err,conn) => {
        conn.query('SELECT * FROM usuarios WHERE usuario = ? AND pass = ?',[username, password], (error, results, fields) =>{
            if(error){
                console.log(error);
                res.redirect('/');
                console.log('error en query');
            }
            else if (Object.keys(results).length > 0)//si contiene almenso 1 resultado entra
            {
                const id = results[0].id//Obtener contraseña de la consulta
                const pass = results[0].pass//Obtener contraseña de la consulta
                const planta = results[0].Planta//Obtener contraseña de la consulta
                const nivel = results[0].Nivel//Obtener nivel de la consulta
                const Area = results[0].Area//Obtener nivel de la consulta
                const Turno = results[0].Turno//Obtener nivel de la consulta
                if(password == pass){//si las contraseñas coinciden entran
                    req.session.loggedin = true;
                    req.session.idDB = id;
                    req.session.username = username;
                    req.session.planta = planta;
                    req.session.nivel = nivel;
                    req.session.area = Area;
                    req.session.nombre = nombre;
                    req.session.turno = Turno;
                    conn.query("UPDATE usuarios SET Nombre = '"+nombre+"' WHERE id = "+id+"",[], (error, results, fields) =>{
                        if(error){
                            console.log(error);
                            res.redirect('/');
                            console.log('error al actualizar nombres');
                        }
                        res.redirect('/home');
                    }); 
                    //res.send('works');
                }else{//si las contraseñas no coinciden
                    console.log('error de contraseña');
                }
            }else //sin resultados
            {
                res.redirect('/');
                console.log('Error usaurio o contraseña');
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




module.exports = Controller;