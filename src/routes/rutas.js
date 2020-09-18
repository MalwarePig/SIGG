const express = require('express'); //guardar express en una variable de servidor
const router = express.Router(); //usar modulo de router de ex´press
const OTController = require('../Controllers/OTController');
const UserController = require('../Controllers/UserController');
const cPlanerController = require('../Controllers/cPlanerController');
const VencidasController = require('../Controllers/VencidasController');
const MaquinariaController = require('../Controllers/MaquinariaController');
const EmpleadosController = require('../Controllers/EmpleadosController');
const HorariosController = require('../Controllers/HorariosController');
const AlmacenController = require('../Controllers/AlmacenController');
const PruebasController = require('../Controllers/PruebasController');
const CRMController = require('../Controllers/CRM_Controller');
const ProcesosController = require('../Controllers/ProcesosController');
/////////////////////////////////////////////////////////////////////////// USUARIOS /////////////////////////////////////////////////////////////////////////////////
//Acceder a login
var reinicio = router.get('/', (req, res) => {
	//res.send('holoo');
	res.render('Login.html');
});

//Iniciar logueo
router.post('/Login', UserController.login);

//Acceder formulario Registrar usuario
router.get('/Signup', (req, res) => {
	if (req.session.loggedin) {
		res.render('Signup.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Login.html');
	}
	res.end();
});

//Registrar usuario en db
router.post('/AddUser', UserController.save);

/////////////////////////////////////////////////////////////////////////// ENTRAR A HOME ///////////////////////////////////////////////////////////////////////////////
//Carga pagina principal
router.get('/home', function (request, response) {
	if (request.session.loggedin) {
		response.render('index.html', {
			title: 'Gemak'
		});
		//response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Tu sesión expiró!');
	}
	response.end();
});

/////////////////////////////////////////////////////////////////////////// ENTRAR A cPlaner /////////////////////////////////////////////////////////////////////////////
router.get('/cPlaner', function (request, response) {
	if (request.session.loggedin) {
		response.render('Producción/cPlaner.html', {
			title: 'Gemak'
		});
		//response.send('Welcome back, ' + request.session.username + '!');
	} else {
		reinicio;
	}
	response.end();
});

router.post('/postCplaner', cPlanerController.saveCP);
/////////////////////////////////////////////////////////////////////////// Maquinas //////////////////////////////////////////////////////////////////////////////////////
router.get('/Maquinas', OTController.listMaquinas);
router.get('/update/:id', OTController.edit);
router.post('/update/:id', OTController.update);

/////////////////////////////////////////////////////////////////////////// ENTRAR A Ordenes ///////////////////////////////////////////////////////////////////////////////
router.get('/Ordenes', OTController.list);
router.post('/addOrden', OTController.save);
router.get('/delete/:id', OTController.delete);
//router.post('/add', OTController.save);

/////////////////////////////////////////////////////////////////////////// ENTRAR A Vencidas //////////////////////////////////////////////////////////////////////////////
router.get('/Vencidas', VencidasController.listVencidas);

/////////////////////////////////////////////////////////////////////////// REGISTRO DE MAQUINARIA CNC /////////////////////////////////////////////////////////////////////
//Acceder formulario Registrar Maquina
router.get('/Alta_Maquina', (req, res) => {
	if (req.session.loggedin) {
		res.render('Alta_Maquina.html', {
			title: 'Gemak'
		});
	} else {
		res.send('Tu sesión expiró!');
	}
	res.end();
});

//Registrar Maquinas en db
router.post('/AddMaquina', MaquinariaController.save);

/////////////////////////////////////////////////////////////////////////// MENU ADMIN //////////////////////////////////////////////////////////////////////////////
//Acceder Menu admin
router.get('/Admin', (req, res) => {
	if (req.session.loggedin) {
		console.log("Nivel: " + req.session.nivel);
		if (req.session.nivel == "Admin") {
			res.render('Admin.html', {
				title: 'Gemak'
			});
		} else {
			res.render('index.html', {
				title: 'Gemak'
			});
		}
	} else {
		res.send('Tu sesión expiró!');
	}
	res.end();
});

/////////////////////////////////////////////////////////////////////////// HORARIOS //////////////////////////////////////////////////////////////////////////////
router.get('/Horarios', HorariosController.list);
router.post('/postHorarios', HorariosController.save);
/////////////////////////////////////////////////////////////////////////// Empleados //////////////////////////////////////////////////////////////////////////////
/*router.get('/Empleados', (req, res) => {
	if(req.session.loggedin){
		res.render('Empleados.html',{title: 'Gemak'});
	}else {
		res.send('Tu sesión expiró!');
	}
	res.end();
});*/

router.get('/Empleados', EmpleadosController.list);
router.post('/addEmpleados', EmpleadosController.save);
router.get('/deleteEmpleado/:id', EmpleadosController.delete);

/////////////////////////////////////////////////////////////////////////// ALMACEN //////////////////////////////////////////////////////////////////////////////
//====== Administración ========
router.get('/wh_Admin', (req, res) => {
	if (req.session.loggedin) {
		if (req.session.nivel == "Admin" && req.session.area == "Almacen") {
			res.render('Almacen/wh_Admin.html', {
				title: 'Gemak'
			});
		} else {
			res.render('index.html', {
				title: 'Gemak'
			});
		}
	} else {
		res.render('index.html', {
			title: 'Gemak'
		});
	}
	res.end();
});

router.get('/wh_Retorno', AlmacenController.listRetorno);
//====== Salidas ========
router.get('/BuscarHerramientas/:Herra', AlmacenController.search);
router.get('/wh_Salidas', AlmacenController.list);
router.get('/Folio', AlmacenController.Folio);
router.get('/Num_Nomina', AlmacenController.Num_Nomina);
router.get('/listaMaquinas/:familia', AlmacenController.Maquinas);
router.post('/GuardarNota', AlmacenController.GuardarNota);

//====== Salidas ========
router.get('/wh_Retorno', AlmacenController.listRetorno);
router.get('/BuscarHerrRetorno/:Maquina', AlmacenController.searchRetorno);
router.get('/FolioRetorno', AlmacenController.FolioRetorno);
router.post('/GuardarNotaRetorno', AlmacenController.GuardarNotaRetorno);

//====== Recepción ========
//Abre pagina principal para recepcion
router.get('/wh_Recepcion', AlmacenController.MainRecepcion);


//====== Requisicion ========
//Abre pagina principal para requerir
router.get('/wh_Requisicion', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/wh_Requisicion.html', {
			title: 'Gemak'
		});
	} else {
		res.render('index.html', {
			title: 'Gemak'
		});
	}
	res.end();
});
//Guarda nota de requisicion
router.post('/SaveRequest', AlmacenController.GuardarRequisicion);

/////////////////////////////////////////////////////////////////////////// CRM //////////////////////////////////////////////////////////////////////////////
router.get('/Contactos', CRMController.list);
router.post('/addCliente', CRMController.save);
router.post('/UpdateCliente', CRMController.Update);
router.get('/delete/:id', CRMController.delete);
router.post('/AddVendedor', CRMController.AddVendedor);
router.get('/Tareas', CRMController.listWorks);

router.get('/Tareas', (req, res) => {
	if (req.session.loggedin) {

		res.render('CRM/Tareas.html', {
			title: 'Gemak'
		});
	} else {
		res.send('Tu sesión expiró!');
	}
	res.end();
});

router.get('/AdminCRM', (req, res) => {
	if (req.session.loggedin) {

		res.render('CRM/AdminCRM.html', {
			title: 'Gemak'
		});
	} else {
		res.send('Tu sesión expiró!');
	}
	res.end();
});

router.get('/AddVendedores', (req, res) => {
	if (req.session.loggedin) {

		res.render('CRM/AddVendedores.html', {
			title: 'Gemak'
		});
	} else {
		res.send('Tu sesión expiró!');
	}
	res.end();
});
/////////////////////////////////////////////////////////////////////////// Materiales //////////////////////////////////////////////////////////////////////////////
router.get('/CargaMateriales', (req, res) => {
	if (req.session.loggedin) {

		res.render('Materiales/Entrada.html', {
			title: 'Gemak'
		});
	} else {
		res.send('Tu sesión expiró!');
	}
	res.end();
});

/////////////////////////////////////////////////////////////////////////// Proceso //////////////////////////////////////////////////////////////////////////////
//====== Cargar  ========
router.get('/VerInventario', (req, res) => {
	if (req.session.loggedin) {

		res.render('Proceso/ReporteInventario.html', {
			title: 'Gemak'
		});
	} else {
		res.send('Tu sesión expiró!');
	}
	res.end();
});
//====== Salidas ========
router.get('/VerAlmacen/:Herramienta', ProcesosController.searchPlanta);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;

/*ESTA ES UNA VERSION DIRECTA SIN VERIFICAR LOGIN
router.get('/home', (req, res) => {
    //res.send('holoo');
    res.render('index.html',{title: 'Gemak'});
});*/

/*
router.get('/Maquinas', (req, res) => {
    res.render('Maquinas.html',{title: 'Maquinas'});
});*/

/*
//rutas
app.get('/', (req, res) => {
    //res.sendFile(path.join(__dirname,'/views/index.html'));//Obtiene ruta de este archiv Js + ruta del archivo a mostrar
    //console.log(__dirname);//Muestra ruta generica de archivo que lo ejecuta
    //console.log(path.join(__dirname,'views/index.html'));
    res.render('index',{title: 'Gemak'});
});
*/