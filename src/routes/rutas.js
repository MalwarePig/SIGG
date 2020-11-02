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
const ComprasController = require('../Controllers/ComprasController');
/////////////////////////////////////////////////////////////////////////// USUARIOS /////////////////////////////////////////////////////////////////////////////////
//Acceder a login
var reinicio = router.get('/', (req, res) => {
	//res.send('holoo');
	res.render('Admin/Login.html');
});

//Iniciar logueo
router.post('/Login', UserController.login);
 
//Acceder formulario Registrar usuario
router.get('/Signup', (req, res) => {
	if (req.session.loggedin) {
		res.render('Admin/Signup.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	//res.end();
});

//Registrar usuario en db
router.post('/AddUser', UserController.save);

router.get('/Desarrollo', (req, res) => {
	//res.send('holoo');
	res.render('Almacen/ML.html');
});

/////////////////////////////////////////////////////////////////////////// ENTRAR A HOME ///////////////////////////////////////////////////////////////////////////////
//Carga pagina principal
router.get('/home', function (request, response) {
	if (request.session.loggedin) {
		response.render('index.html', {
			title: 'Gemak'
		});
		//response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.render('Admin/Login.html');
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
		res.render('Producción/Alta_Maquina.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
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
		var nivel = "Admin";
		if (req.session.nivel.toLowerCase() == nivel.toLowerCase()) {
			res.render('Admin/Admin.html', {
				title: 'Gemak'
			});
		} else {
			res.render('index.html', {
				title: 'Gemak'
			});
		}
	} else {
		res.render('Admin/Login.html');
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
		if ((req.session.nivel == "Admin" && req.session.area == "Almacen") || (req.session.nivel == "Admin" && req.session.area == "Admin")) {
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
	res.render('Admin/Login.html');
});

//====== Salidas ========
router.get('/BuscarHerramientas/:Herra', AlmacenController.search);
router.get('/wh_Salidas', AlmacenController.list);
router.get('/Folio', AlmacenController.Folio);
router.get('/Num_Nomina', AlmacenController.Num_Nomina);
router.get('/listaMaquinas/:familia', AlmacenController.Maquinas);
router.post('/GuardarNota', AlmacenController.GuardarNota);
router.post('/CheckAuditoria', AlmacenController.SavePreAudit);
router.post('/EstatusAudi', AlmacenController.UpdatePreAudit);
router.post('/AudiCiclica', AlmacenController.AudiCiclica);
router.get('/StockActual/:Herramienta', AlmacenController.StockActual);
//====== Salidas ========
router.get('/wh_Retorno', AlmacenController.listRetorno);
router.get('/BuscarHerrRetorno/:Maquina', AlmacenController.searchRetorno);
router.get('/FolioRetorno', AlmacenController.FolioRetorno);
router.post('/GuardarNotaRetorno', AlmacenController.GuardarNotaRetorno);

//====== Recepción ========
//Abre pagina principal para recepcion
router.get('/wh_Recepcion', AlmacenController.MainRecepcion);
router.post('/PostRecepcion', AlmacenController.GuardarRecepcion);
router.get('/ConsultaRecepcion', AlmacenController.ConsultaRecepcion);
router.post('/Asignar', AlmacenController.Asignar);
router.get('/ConsultaFlotante', AlmacenController.ConsultaFlotante);
router.get('/MostrarRecoleccion', AlmacenController.MostrarRecoleccion);
router.post('/GuardarRecoleccion', AlmacenController.GuardarRecoleccion);
//====== Editar Herramienta ========
//Abre pagina principal para editar
router.get('/wh_Editar', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/wh_Editar.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.render('Admin/Login.html');
	//res.end();
});

router.post('/ActualizarProducto', AlmacenController.ActualizarProducto);
//====== Ajuste Inventario ========
//Abre pagina principal para editar
router.get('/AjusteInventario', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/wh_AjustesInventario.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.render('Admin/Login.html');
});
//====== Requisicion ========
//Abre pagina principal para requerir
router.get('/wh_Requisicion', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/wh_Requisicion.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.render('Admin/Login.html');
});
//Guarda nota de requisicion
router.post('/SaveRequest', AlmacenController.GuardarRequisicion);

//====== Reporte Herramienta ========
//Abre pagina principal para requerir
router.get('/wh_Reporte', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/wh_Reporte.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

//Muestra reporte de entradas y salidas de herramienta
router.get('/TipoReporte/:parametros', AlmacenController.MostrarReporte);
//====== Intercambios ========
//Abre pagina principal para recepcion
router.get('/wh_Intercambio', AlmacenController.Intercambio);
//Guarda nota de intercambio
router.post('/CrearIntercambio', AlmacenController.CrearIntercambio);
//Abre pagina principal para recepcion
router.get('/MostrarIntercambio', AlmacenController.MostrarIntercambio);
router.post('/GuardarIntercambio', AlmacenController.GuardarIntercambio);
router.get('/MostrarCancelacion', AlmacenController.MostrarCancelacion);
router.get('/CancelarIntercambio/:Producto', AlmacenController.CancelarIntercambio);
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
		res.render('Admin/Login.html');
	}
	res.end();
});

router.get('/AddVendedores', (req, res) => {
	if (req.session.loggedin) {

		res.render('CRM/AddVendedores.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
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
		res.render('Admin/Login.html');
	}
	res.end();
});

/////////////////////////////////////////////////////////////////////////// Proceso //////////////////////////////////////////////////////////////////////////////
//====== Cargar Reporte Inventario ========
router.get('/VerInventario', (req, res) => {
	if (req.session.loggedin) {
		res.render('Proceso/ReporteInventario.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});

//====== Cargar Reporte Pronosticos ========
router.get('/Pronosticos', (req, res) => {
	if (req.session.loggedin) {
		res.render('Proceso/PronosticoOT.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
}); 
//====== Buscar Herramientas ========
router.get('/VerAlmacen/:Herramienta', ProcesosController.searchPlanta);
//====== Guardar Pronostico ========
router.post('/GuardarPronostico', ProcesosController.SavePronostico);
//====== Mostrar Pronostico ========
router.get('/PronosticosProcesos', ProcesosController.list);
/////////////////////////////////////////////////////////////////////////// Compras //////////////////////////////////////////////////////////////////////////////////////
//====== Mostrar Pronostico ========
router.get('/ComprasPronosticos', ComprasController.list);
//====== Mostrar Pronostico ========
router.get('/RPronosticos/:Herr', ComprasController.Resumen);
//====== Guardar Nota de Compras ========
router.post('/GuardarNotaCompras', ComprasController.NotaCompras);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;

/*ESTA ES UNA VERSION DIRECTA SIN VERIFICAR LOGIN
router.get('/home', (req, res) => {
    //res.send('holoo');
    res.render('index.html',{title: 'Gemak'});
});*/

/*router.get('/Maquinas', (req, res) => {
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