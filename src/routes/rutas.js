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
const MaterialesController = require('../Controllers/MaterialesController');
const LogisiticaController = require('../Controllers/LogisticaController');
const FlujoController = require('../Controllers/FlujoController');
const PNCController = require('../Controllers/PNCController');
const RHController = require('../Controllers/RHController');
const PeticionesController = require('../Controllers/PeticionesController');
const CalidadController = require('../Controllers/CalidadController');
const ControlImagenesController = require('../Controllers/ControlImagenesController');

var fs = require('fs'); 
/* const fs = require('node:fs') */
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

/////////////////////////////////////////////////////////////////////////// USUARIOS /////////////////////////////////////////////////////////////////////////////////
//Acceder a login
var reinicio = router.get('/', (req, res) => {
	//res.send('holoo');
	res.render('Admin/Login.html');
});

//Iniciar logueo
router.post('/Login', UserController.login);
//Acceder formulario Registrar usuario

//Iniciar logueo
router.get('/Signup', UserController.SignUp);

//Registrar usuario en db
router.post('/AddUser', UserController.save);

//Eliminar usuario en db
router.post('/EliminarUsuario', UserController.EliminarUsuario);

router.get('/LogueoActivo', (req, res) => {
	//res.send('holoo');
	console.log(req.session.area)
	res.json(req.session.area);
});



var reinicio = router.get('/Usuarios', (req, res) => {
	//res.send('holoo');
	res.render('Admin/Usuarios.html');
});

//Registrar usuario en db
router.get('/listarUsuarios', UserController.listarUsuarios);
/////////////////////////////////////////////////////////////////////////// ENTRAR A HOME ///////////////////////////////////////////////////////////////////////////////
//Carga pagina principal
router.get('/home', UserController.HOME);

/////////////////////////////////////////////////////////////////////////// ENTRAR A cPlaner /////////////////////////////////////////////////////////////////////////////
router.get('/cPlaner', function (request, response) {
	if (request.session.loggedin) {
		response.render('Producción/cPlaner.html', {
			title: 'Gemak'
		});
		//response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.render('Admin/Login.html');
	}
});

router.get('/Planeacion', function (request, response) {
	if (request.session.loggedin) {
		response.render('Producción/Planeacion/Planeacion.html', {
			title: 'Gemak'
		});
		//response.send('Welcome back, ' + request.session.username + '!');
	} else {
		reinicio;
	}
	response.end();
});

//Obtener lista de familias
router.get('/ListaFamilias', OTController.ListaFamilias);
router.get('/Listado/:parametros', OTController.FiltroMaquinas);
router.get('/OTMaquinando/:parametros', OTController.OTMaquinando);
/*
router.get('/Desarrollo', function (request, response) {
	if (request.session.loggedin) {
		response.render('Admin/snake.html', {
			title: 'Gemak'
		});
		//response.send('Welcome back, ' + request.session.username + '!');
	} else {
		reinicio;
	}
	response.end();
}); 
*/





router.post('/postCplaner', cPlanerController.saveCP);
/////////////////////////////////////////////////////////////////////////// Maquinas //////////////////////////////////////////////////////////////////////////////////////
router.get('/Maquinas', OTController.listMaquinas);
router.get('/MaquinasFamilias', OTController.MaquinasFamilias);
router.get('/update/:id', OTController.edit);
router.post('/update/:id', OTController.update);

/////////////////////////////////////////////////////////////////////////// ENTRAR A Ordenes ///////////////////////////////////////////////////////////////////////////////
router.get('/Ordenes', OTController.list);
router.post('/addOrden', OTController.save);
router.get('/delete/:id', OTController.delete);
router.get('/CargarTodoOT/', OTController.CargarTodoOT);
router.post('/ActualizarOT/', OTController.ActualizarOT);
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
/////////////////////////////////////////////////////////////////////////// FLUJO ///////////////////////////////////////////////////////////////////////////////
router.get('/Flujo', (req, res) => {
	if (req.session.loggedin) {
		res.render('Producción/Flujo/Flujo.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});


router.get('/ResetFlujo/', FlujoController.ResetFlujo);

//Consulta un area en el flujo
router.get('/ConsultaFlujo/:parametros', FlujoController.list);
//Consulta un area en el flujo con ordenes sin embarcar
router.get('/ConsultaFlujoEspera/:parametros', FlujoController.listEspera);
//Trae todas las fechas de los departamentes en el flujo
router.get('/FechasFlujo/:OT', FlujoController.FechasFlujo);
//Verifica excel para alimentar controlplaner
//router.get('/AlimentarFlujo', FlujoController.AlimentarFlujo);
router.get('/AlimentarVistaPlanta', FlujoController.AlimentarVistaPlanta);
//Consulta la lista de pendientes de produccion
router.get('/Pen_FlujoProd', FlujoController.Pen_FlujoProd);
//inicia la lista de ot en el flujo de produccion
router.post('/IniciarProdFlujo', FlujoController.IniciarProdFlujo);
//Asignar OT a cola
router.post('/AsignarCola', FlujoController.AsignarCola);
//Transferir linea de un area a la siguiente
router.post('/TransFlujo', FlujoController.TransFlujo);
//Guarda los cambios en las cantidades del flujo
router.post('/SaveCantFlujo', FlujoController.SaveCantFlujo);
//Transferir linea a servicio externo
router.post('/MandarTrat', FlujoController.MandarTrat);
//Transferir linea a servicio externo
router.get('/EnTratamientos', FlujoController.EnTratamientos);
//Retorna lineas de tratamiento

router.post('/FinalizarTrat', FlujoController.FinalizarTrat);
//Cerrar las lineas en el flujo

router.post('/CerrarLineas', FlujoController.CerrarLineas);
//Eliminar lineas en el flujo

router.post('/EliminarOTFlujo', FlujoController.EliminarOTFlujo);
//Leer HistorialFlujo
router.get('/LeerHistorial/:variable', FlujoController.LeerHistorial);
//Registrar eficiencia
router.post('/RegistrarEficiencia/', FlujoController.RegistrarEficiencia);
//total registros
router.get('/RegistrosArea/:parametros', FlujoController.RegistrosArea);
//Registrar eficiencia
router.post('/NuevoProceso/', FlujoController.NuevoProceso);


/////////////////////////////////////////////////////////////////////////// Materiales ///////////////////////////////////////////////////////////////////////////////
router.get('/Materiales', (req, res) => {
	if (req.session.loggedin) {
		res.render('Producción/Materiales/Materiales.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});

router.get('/ConsultaMateriales/:parametros', MaterialesController.MostrarReporte);
router.post('/ActualizarMaterial/', MaterialesController.ActualizarMaterial);

/////////////////////////////////////////////////////////////////////////// Eficiencia ///////////////////////////////////////////////////////////////////////////////
router.get('/Eficiencia', (req, res) => {
	if (req.session.loggedin) {
		res.render('Producción/Eficiencia/Eficiencia.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});

//Leer Eficiencias
router.get('/LeerEficiencias/:OT', FlujoController.LeerEficiencias);

//Leer Eficiencias
router.get('/LeerEficienciaMensual/:parametros', FlujoController.LeerEficienciaMensual);
router.get('/LeerEficienciaNomina/:parametros', FlujoController.LeerEficienciaNomina);

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
			res.render('Admin/Login.html');
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
router.post('/Subir', EmpleadosController.Subir);
/////////////////////////////////////////////////////////////////////////// ALMACEN //////////////////////////////////////////////////////////////////////////////
//====== Administración ========
router.get('/wh_Admin', (req, res) => {
	if (req.session.loggedin) {
		if ((req.session.nivel == "Admin" && req.session.area == "Almacen") || (req.session.nivel == "Admin" && req.session.area == "Admin")) {
			res.render('Almacen/wh_Admin.html', {
				title: 'Gemak'
			});
		} else {
			res.render('Admin/Login.html');
		}
	} else {
		res.render('Admin/Login.html');
	}
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
//====== Retorno ========
router.get('/wh_Retorno', AlmacenController.listRetorno);
router.get('/BuscarHerrRetorno/:Maquina', AlmacenController.searchRetorno);
router.get('/FolioRetorno', AlmacenController.FolioRetorno);
router.post('/GuardarNotaRetorno', AlmacenController.GuardarNotaRetorno);

//====== Geveta ========
router.post('/GuardarNotaGaveta', AlmacenController.GuardarNotaGaveta);
router.get('/BuscarHerrRetornoGaveta/:Param', AlmacenController.BuscarHerrRetornoGaveta);
router.post('/GuardarNotaRetornoGaveta', AlmacenController.GuardarNotaRetornoGaveta);
//====== Recepción ========
//Abre pagina principal para recepcion
router.get('/wh_Recepcion', AlmacenController.MainRecepcion);
router.post('/PostRecepcion', AlmacenController.GuardarRecepcion);
router.get('/ConsultaRecepcion', AlmacenController.ConsultaRecepcion);
router.post('/Asignar', AlmacenController.Asignar);
router.get('/ConsultaFlotante', AlmacenController.ConsultaFlotante);
router.get('/MostrarRecoleccion', AlmacenController.MostrarRecoleccion);
router.post('/GuardarRecoleccion', AlmacenController.GuardarRecoleccion);
router.get('/CancelarFlotante/:id', AlmacenController.CancelarFlotante);
router.get('/EliminarRecepcion/:id', AlmacenController.EliminarRecepcion);

//============================== Almacen Aajuste ==============================//
router.get('/BuscarHerramientasAjuste/:Herra', AlmacenController.searchAjuste);
//============================== Almacen Editar ==============================//
router.get('/BuscarHerramientasEditar/:Herra', AlmacenController.BuscarAlmacenEditar);

//============================== Almacen  ==============================//
//====== Tornilleria ========
//Abre pagina principal para tornilleria
router.get('/ReporteConsumos', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/ReporteConsumos/wh_ReporteConsumosMes.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});


//============================== Criticos  ==============================//
//====== Tornilleria ========
//Abre pagina principal para tornilleria
router.get('/wh_Criticos', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/ReporteCritico/wh_Reporte.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});


//Muestra la lista de herramientas despachadas por almacen
router.get('/MinCritico/', AlmacenController.MinCritico);

//Muestra la lista de herramientas despachadas por almacen
router.get('/ListadoDespacho/:parametros', AlmacenController.ListadoDespacho);
//Muestra el consumo por cada herramienta
router.get('/SumaMensual/:parametros', AlmacenController.SumaMensual);
//Muestra detalle de las herramienta
router.get('/DetalleHerramienta/:parametros', AlmacenController.DetalleHerramienta);

router.get('/TodoDespachos', AlmacenController.TodoDespachos);

//====== DashBoard ========
var reinicio = router.get('/DashboardAlmacen', (req, res) => {
	//res.send('holoo');
	res.render('Almacen/DashboardAlmacen.html');
});
//Cargar TareasAbiertas vistas por el servidor
router.get('/DashboardStatus/:Argumento', AlmacenController.DashboardStatus);
//Cargar TareasAbiertas vistas por el servidor
router.get('/TopDespachos/', AlmacenController.TopDespachos);


//====== Tornilleria ========
//Abre pagina principal para tornilleria
router.get('/wh_Accesorios', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Accesorios/Accesorios.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});

router.post('/RegistrarAccesorio', AlmacenController.RegistrarAccesorio);
//============================== Almacen Aajuste ==============================//
router.get('/LeerAccesorios/:variable', AlmacenController.LeerAccesorios);
router.get('/HistorialAccesorios/:variable', AlmacenController.HistorialAccesorios);
router.post('/ActualizarAccesorios', AlmacenController.ActualizarAccesorios);
router.post('/ImportarAccesorios', AlmacenController.ImportarAccesorios);
router.get('/CargaCapturasPendientes/', AlmacenController.CargaCapturasPendientes);
router.get('/CargaCapturasEntregado/', AlmacenController.CargaCapturasEntregado);
router.get('/FolioAccesorios/', AlmacenController.FolioAccesorios);
router.post('/ActuaUbicacionAcces', AlmacenController.ActuaUbicacionAcces);
router.post('/EliminarAccesorio', AlmacenController.EliminarAccesorio);

//====== Trabajo Interno ========
//Abre pagina principal para tornilleria
router.get('/wh_TrabajoInterno', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/TrabajoInterno/TrabajoInterno.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});

router.post('/RegistrarTrabajoIn', AlmacenController.RegistrarTrabajoIn);
router.get('/LeerTrabajosIn/:variable', AlmacenController.LeerTrabajosIn);
router.post('/ActualizarTrabajoIn', AlmacenController.ActualizarTrabajoIn);
router.get('/FolioTrabajoIn/', AlmacenController.FolioTrabajoIn);
router.post('/EliminarTrabajoIn', AlmacenController.EliminarTrabajoIn);
router.get('/CargaCapturasEntregadoTI/', AlmacenController.CargaCapturasEntregadoTI);
router.get('/CargaCapturasPendientesTI/', AlmacenController.CargaCapturasPendientesTI);


//================================== MODULO DE GAVETAS =================================// 
//Abre pagina principal para editar
router.get('/AdminGaveta', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Gaveta/wh_Admin.html');
	} else {
		res.render('Admin/Login.html');
	}
});


router.get('/GavetaRetorno', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Gaveta/wh_RetornoGaveta.html');
	} else {
		res.render('Admin/Login.html');
	}
});


//Transfiere de gaveta almacen
router.post('/DescontarGaveta', AlmacenController.DescontarGaveta);
//Busca Herramientas en Gaveta
router.get('/BuscarHerramientasGav/:Herra', AlmacenController.BuscarHerramientasGav);
//Busca Herramientas en Gaveta por planta
router.get('/BuscarHerramientasGavPlanta/:parametros', AlmacenController.BuscarHerramientasGavPlanta);
//Busca Herramientas en Gaveta por id
router.get('/BuscarGavetaId/:parametros', AlmacenController.BuscarGavetaId);
//Busca Pendientes de recolectar en gaveta
router.get('/MostrarRecoleccionGav', AlmacenController.MostrarRecoleccionGav);
//Guarda la recoleccion en gaveta
router.post('/GuardarRecoleccionGaveta', AlmacenController.GuardarRecoleccionGaveta);
//Existencias Gaveta 
router.get('/ExistenciasGaveta/:Almacen', AlmacenController.ExistenciasGaveta);

router.post('/addNuevoProducto', AlmacenController.NuevoProducto);

//Guarda la recoleccion en gaveta
router.post('/postAjusteGaveta', AlmacenController.postAjusteGaveta);

router.get('/ListaFamiliasGaveta', AlmacenController.ListaFamiliasGaveta);
//Guarda la recoleccion en gaveta
router.post('/GuardarCambiosGaveta', AlmacenController.GuardarCambiosGaveta);
router.post('/GuardarNuevoGaveta', AlmacenController.GuardarNuevoGaveta);
router.post('/EliminarGaveta', AlmacenController.EliminarGaveta);
//============================== Almacen Gaveta Despacho (Oficina) ==============================//
router.get('/GavetaDespacho', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Gaveta/wh_SalidasGaveta.html');
	} else {
		res.render('Admin/Login.html');
	}
});

//Abre pagina principal para editar
router.get('/wh_ProdNuevo', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/NuevoProducto/wh_ProdNuevo.html');
	} else {
		res.render('Admin/Login.html');
	}
});

//Abre pagina principal para editar
router.get('/Gaveta', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/wh_Gaveta.html');
	} else {
		res.render('Admin/Login.html');
	}
});

//Abre pagina principal para editar
router.get('/wh_EditarGaveta', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Gaveta/wh_Editar.html');
	} else {
		res.render('Admin/Login.html');
	}
});

router.get('/ExistenciasGavetas', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Gaveta/wh_ExistenciaGaveta.html');
	} else {
		res.render('Admin/Login.html');
	}
});

router.get('/AjusteGaveta', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Gaveta/wh_AjustesGaveta.html');
	} else {
		res.render('Admin/Login.html');
	}
});

router.get('/HistorialAjusteGaveta', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Gaveta/wh_ReporteAjustes.html');
	} else {
		res.render('Admin/Login.html');
	}
});

//============================== Almacen  Gaveta (Oficina) ==============================//

//====== Crear Herramienta ========

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
});


//Actualiza ajuste
router.post('/ActualizarProducto', AlmacenController.ActualizarProducto);
//Actualiza ajuste usados
router.post('/ActualizarProductoUsado', AlmacenController.ActualizarProductoUsado);
//Actualiza informacion de producto
router.post('/EditarProducto', AlmacenController.EditarProducto);
//Actualiza informacion de producto
router.post('/EliminarProducto', AlmacenController.EliminarProducto);

//Cargar lista de proveedores
router.get('/getProveedores/', AlmacenController.getProveedores);

//====== Tabla Proveedores ========
//Abre pagina principal para editar
router.get('/TablaProvedores', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Proveedores/wh_ProveedorNuevo.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

router.post('/RegistroProveedor', AlmacenController.RegistroProveedor);
router.post('/EliminarProveedor', AlmacenController.EliminarProveedor);

//====== Ajuste Inventario ========
//Abre pagina principal para editar
router.get('/AjusteInventario', (req, res) => {
	if ((req.session.loggedin) && (req.session.PermisoAjuste == 'Activado')) {
		res.render('Almacen/wh_AjustesInventario.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

//====== Ajuste Inventario Basico ========
//Abre pagina principal para editar
router.get('/wh_Ingresos', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/AjusteBasico/AjusteBasico.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

//Actualiza informacion de producto
router.post('/AjusteBasico', AlmacenController.AjusteBasico);
router.get('/reporteAjustesGaveta/:parametros', AlmacenController.reporteAjustesGaveta);

//Abre pagina principal para editar
router.get('/wh_Recolectar', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Recolectar/Recolectar.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

//Actualiza informacion de producto
router.post('/RecolectarBasico', AlmacenController.RecolectarBasico);

//Abre pagina principal para editar
router.get('/ReporteRecolectarBasico', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Recolectar/wh_ReporteRecolectarBasico.html', {
			title: 'Gemak'
		});//
	} else {
		res.render('Admin/Login.html');
	}
});

router.get('/repRecolectarBasico/:parametros', AlmacenController.repRecolectarBasico);


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

//====== Reporte Herramienta ========
//Abre pagina principal para requerir
router.get('/wh_ReporteAjustes', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/wh_ReporteAjustes.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

//====== Reporte Herramienta ========
//Abre pagina principal para requerir
router.get('/wh_ReporteArticulo', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/wh_ReporteArticulo.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

//====== Reporte Herramienta ========
//Abre pagina principal para requerir
router.get('/wh_ReporteArticuloAdmin', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/wh_ReporteArticuloAdmin.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

//====== Reporte Herramienta ========
//Abre pagina principal para requerir
router.get('/ExistenciasAlmacen', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/wh_ExistenciasAlmacen.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

//====== Reporte Herramienta ========
//Abre pagina principal para requerir
router.get('/ExistenciasBasico', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/ExistenciasBasico/ExistenciasBasico.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

//Abre pagina principal para requerir
router.get('/whCompras', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/wh_Compras.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

//Busca Herramientas Cotizadas activadas
router.get('/ListaDeCotizaciones/', AlmacenController.ListaDeCotizaciones);

router.post('/Ordenar/', AlmacenController.Ordenar);

router.post('/CancelarOrden/', AlmacenController.CancelarOrden);

router.post('/ActualizarOrdenar/', AlmacenController.ActualizarOrdenar);

router.post('/CancelarOrdenados/', AlmacenController.CancelarOrdenados);

//Busca Herramientas Ordenadas activadas
router.get('/ListaDeOrdenes/', AlmacenController.ListaDeOrdenes);
//Busca herramienta lista para recolectar
router.get('/MostrarRecepcion/', AlmacenController.MostrarRecepcion);

router.post('/RecolectarAlmacen/', AlmacenController.RecolectarAlmacen);

//Busca Herramientas en 
router.get('/ExistenciasAlmacenBasico/', AlmacenController.ExistenciasAlmacenBasico);

//Busca Herramientas en 
router.get('/ExistenciaTotalAlmacen/:parametros', AlmacenController.ExistenciaTotalAlmacen);

router.get('/MostrarOcultos/', AlmacenController.MostrarOcultos);
//Agregar Categorias
router.post('/addCategoria/', AlmacenController.addCategoria);
//Agregar Familias
router.post('/addFamilia/', AlmacenController.addFamilia);
//Busca Herramientas en 
router.get('/getCategoriaAlmacen/', AlmacenController.getCategoriaAlmacen);
//Busca Herramientas en 
router.get('/getFamiliasAlmacen/', AlmacenController.getFamiliasAlmacen);

//Busca Herramientas en 
router.get('/getFamiliasAlmacenPlanta/:parametros', AlmacenController.getFamiliasAlmacenPlanta);

router.post('/EliminarCategoria/', AlmacenController.EliminarCategoria);
router.post('/EliminarFamiliaAlmacen/', AlmacenController.EliminarFamiliaAlmacen);
router.post('/OcultarFamilia/', AlmacenController.OcultarFamilia);
//Modificar Cotizacion
router.post('/CambiarCotizacion/', AlmacenController.CambiarCotizacion);
router.get('/ReporteRequeridos/:parametros', AlmacenController.ReporteRequeridos);
router.get('/ReporteOrdenados/:parametros', AlmacenController.ReporteOrdenados);
router.post('/RegistrarOC/', AlmacenController.RegistrarOC);
router.get('/OrdenProductoBuscar/:parametros', AlmacenController.OrdenProductoBuscar);

//Muestra reporte de entradas y salidas de herramienta
router.get('/TipoReporte/:parametros', AlmacenController.MostrarReporte);
router.get('/TipoReporteHerramienta/:Herramienta', AlmacenController.MostrarReporteHerramienta);
router.get('/TipoReporteHerramientaAdmin/:Herramienta', AlmacenController.TipoReporteHerramientaAdmin);
router.get('/ExistenciasAlmacen/', AlmacenController.ExistenciasAlmacen);
router.get('/reporteAjustes/:parametros', AlmacenController.reporteAjustes);
router.get('/reporteAjustesBasico/:parametros', AlmacenController.reporteAjustesBasico);
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

//====== Guardar Materiales ========
router.post('/CargaMaterial', MaterialesController.CargaMaterial);
//====== Carga Lista Materiales ========
router.get('/listaMateriales', MaterialesController.listaMateriales);

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
//====== Crear Peticion ========
//Abre pagina principal para editar
router.get('/Peticiones', (req, res) => {
	if (req.session.loggedin) {
		res.render('Compras/Requerimientos/Peticiones.html');
	} else {
		res.render('Admin/Login.html');
	}
});

router.post('/SolicitarCompra', PeticionesController.SolicitarCompra);
router.get('/BuscarPeticion/:Folio', PeticionesController.BuscarPeticion);
router.post('/ActualizarCompra', PeticionesController.ActualizarCompra);
router.post('/EliminarCompra', PeticionesController.EliminarCompra);





//====== Mostrar Pronostico ========
router.get('/ComprasPronosticos', ComprasController.list);
//====== Mostrar Pronostico ========
router.get('/RPronosticos/:Herr', ComprasController.Resumen);
//====== Guardar Nota de Compras ========
router.post('/GuardarNotaCompras', ComprasController.NotaCompras);

//====== Mostrar Logistica ========
router.get('/Logistica', (req, res) => {
	if (req.session.loggedin) {
		res.render('Compras/Logistica.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});

//====== Guardar Lista Logistica ========
router.post('/NuevaImportacion', LogisiticaController.NuevaImportacion);
router.get('/BuscarPedimento/:Variable', LogisiticaController.BuscarPedimento);

//====== Mostrar Kits ========
router.get('/Kits', (req, res) => {
	if (req.session.loggedin) {
		res.render('Compras/Kits.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});

//====== Mostrar Kits ========
router.get('/BuscarKits/:Variable', LogisiticaController.Kits);
router.get('/BuscarComponentes/:Variable', LogisiticaController.Componentes);
router.get('/BuscarSubComponentes/:Variable', LogisiticaController.SubComponentes);
/////////////////////////////////////////////////////////////// Herramientas //////////////////////////////////////////////////////////////////////////////////
//Acceder formulario de etiquetas embarque
router.get('/Etiquetas', (req, res) => {
	if (req.session.loggedin) {
		let area = req.session.area;
		console.log(area);
		if (area == 'Embarques') {
			res.render('Herramientas/Etiquetas.html', {
				title: 'Gemak'
			});
		} else {
			console.log("No area");
			res.redirect('/home');
		}
	} else {
		console.log("No area 2");
		res.render('Admin/Login.html');
	}
	res.end();
});

//Acceder formulario de etiquetas embarque
router.get('/Etiqueta_dos', (req, res) => {
	if (req.session.loggedin) {
		let area = req.session.area;
		console.log(area);
		if (area == 'Embarques') {
			res.render('Herramientas/Daimler.html', {
				title: 'Gemak'
			});
		} else {
			console.log("No area");
			res.redirect('/home');
		}
	} else {
		console.log("No area 2");
		res.render('Admin/Login.html');
	}
	res.end();
});

//Acceder formulario de etiquetas embarque
router.get('/Etiqueta_Baker', (req, res) => {
	if (req.session.loggedin) {
		let area = req.session.area;
		console.log(area);
		if (area == 'Embarques') {
			res.render('Herramientas/Baker.html', {
				title: 'Gemak'
			});
		} else {
			console.log("No area");
			res.redirect('/home');
		}
	} else {
		console.log("No area 2");
		res.render('Admin/Login.html');
	}
	res.end();
});


//Acceder formulario de etiquetas embarque
router.get('/EtiquetasBravo', (req, res) => {
	if (req.session.loggedin) {
		let area = req.session.area;
		console.log(area);
		if (area == 'Embarques') {
			res.render('Herramientas/EtiquetasBravo.html', {
				title: 'Gemak'
			});
		} else {
			console.log("No area");
			res.redirect('/home');
		}
	} else {
		console.log("No area 2");
		res.render('Admin/Login.html');
	}
	res.end();
});

//Acceder formulario de etiquetas embarque
router.get('/Cotizador', (req, res) => {
	if (req.session.loggedin) {
		let area = req.session.area;
		console.log(area);
		if (area == 'Admin') {
			res.render('Herramientas/Cotizador.html', {
				title: 'Gemak'
			});
		} else {
			console.log("No area");
			res.redirect('/home');
		}
	} else {
		console.log("No area 2");
		res.render('Admin/Login.html');
	}
	res.end();
});

/////////////////=============================================== -HERRAMIENTAS- =================================================/////////////////////////////////
//Reinicia cola de impresion
router.get('/Impresoras/', function (req, res) {
	res.download('192.168.2.191/Archivos Compartidos Servidor/RecursosSIGG/Impresoras.bat', 'Impresoras.bat', function (err) {
		//res.download('./src/public/RecursosArchivos/Impresoras.bat', 'Impresoras.bat', function(err){
		if (err) {
			console.log(err);
		} else {
			console.log("Descargado");
		}
	})
});
//Renicializa ip
router.get('/Internet/', function (req, res) {
	res.download('.SIGG/src/public/RecursosArchivos/Red.bat', 'Red.bat', function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Descargado");
		}
	})
});

router.get('/Api/', function (req, res) {
	var Prueba = [
		{
			id: 0,
			Nombre: "Sergio",
			Edad: 28,
			Sexo: "Hombre"
		},
		{
			id: 0,
			Nombre: "Womy",
			Edad: 26,
			Sexo: "Mujer"
		},

	]
	res.json(Prueba);
});

/////////////////=============================================== -PNC- =================================================/////////////////////////////////



/////////////////////////////////////////////////////////////// SOPORTE //////////////////////////////////////////////////////////////////////////////////
//====== Crear Ticket ========
router.get('/CrearTicket', (req, res) => {
	if (req.session.loggedin) {
		res.render('Soporte/CreateTicket.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});

/////////////////////////////////////////////////////////////// RH //////////////////////////////////////////////////////////////////////////////////
//====== Crear Ticket ========
router.get('/RHPersonal', (req, res) => {
	var nivel = "RH";
	if (req.session.nivel.toLowerCase() == nivel.toLowerCase()) {
		res.render('RH/RHPersonal.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});



//====== Listar Personal ========
router.get('/ListarPersonal/:Planta', RHController.ListarPersonal);
//Actualiza informacion de empleados
router.post('/EditarPersonal', RHController.EditarPersonal);
//Mostrar ventana Registrar empleado
router.get('/FormularioAddEmp', (req, res) => {
	var nivel = "RH";
	if (req.session.nivel.toLowerCase() == nivel.toLowerCase()) {
		res.render('RH/RegistrarEmpleado.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});

//Registrar empleado
router.post('/RegistraEmeplado', RHController.RegistrarEmpleado);
//====== Abre modulo de correos ========
router.get('/CorreoNomina', (req, res) => {
	var nivel = "RH";
	if (req.session.nivel.toLowerCase() == nivel.toLowerCase()) {
		res.render('RH/eMailNomina.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});


//====== Listar Personal ========
router.get('/PrepararEnvio/:Planta', RHController.PrepararEnvio);
//Registrar empleado
router.post('/EnviarNomina', RHController.EnviarNomina);

//Actualiza informacion de empleados
router.post('/DesactivarPersonal', RHController.DesactivarPersonal);

//Actualiza informacion de empleados
router.post('/ActivarPersonal', RHController.ActivarPersonal);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//====== Abre modulo de Inspeccion ========
router.get('/Inspeccion', (req, res) => {
	res.render('Calidad/Inspeccion/Inspeccion.html', {
		title: 'Gemak'
	});
});


//====== Abre modulo de Inspeccion ========
router.get('/RegistroInspeccion', (req, res) => {
	res.render('Calidad/Inspeccion/RegistrarInspeccion.html', {
		title: 'Gemak'
	});
});

//====== Abre modulo de Inspeccion ========
router.get('/AdminCalidad', (req, res) => {
	res.render('Calidad/Admin/AdminCalidad.html', {
		title: 'Gemak'
	});
});

//====== Abre modulo de Inspeccion ========
router.get('/InspectoresList', (req, res) => {
	res.render('Calidad/Admin/InspectoresList.html', {
		title: 'Gemak'
	});
});

router.post('/NuevaInspeccion', CalidadController.NuevaInspeccion);
router.get('/CargarInspeccion/', CalidadController.CargarInspeccion);
router.post('/ActualizarOrden/', CalidadController.ActualizarOrden);
router.post('/EliminarOrdenInsp', CalidadController.EliminarOrdenInsp);
router.get('/CargarInspectores/', CalidadController.CargarInspectores);
router.get('/InfoOT/:variable', CalidadController.InfoOT);
router.get('/ListarPersonalCalidad/:variable', CalidadController.ListarPersonal);
//Elimina Inspector
router.get('/EliminarInspector/:variable', CalidadController.EliminarInspector);
//Asignar Inspector
router.get('/ActivarInspector/:variable', CalidadController.ActivarInspector);
//====== Abre modulo de Inspeccion de reportes ========
router.get('/ReporteInspeccion', (req, res) => {
	res.render('Calidad/Inspeccion/ListaInspeccion.html', {
		title: 'Gemak'
	});
});

router.get('/ListaInspecciones/:parametros', CalidadController.ListaInspecciones);

///////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/Ex_Salidas', (req, res) => {
	if (req.session.loggedin) {
		if (req.session.area == "Proceso" || (req.session.nivel == "Admin" && req.session.area == "Admin")) {
			res.render('Externos/Salidas/Ex_Salidas.html', {
				title: 'Gemak'
			});
		} else {
			res.render('Admin/Login.html');
		}
	} else {
		res.render('Admin/Login.html');
	}
});



//============================== Almacen Herramienta Despacho ==============================//
router.get('/HerramientaDespacho', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Herramienta/wh_Salidas.html');
	} else {
		res.render('Admin/Login.html');
	}
});

//====== Despacho ========
router.get('/BuscarHerramental/:Clave', AlmacenController.BuscarHerramental);
router.post('/GuardarNotaHerramienta', AlmacenController.GuardarNotaHerramienta);
//====== Retorno ========
router.get('/BuscarDespachoUnico/:Clave', AlmacenController.BuscarDespachoUnico);
router.post('/GuardarRetornoHerramienta', AlmacenController.GuardarRetornoHerramienta);


//====== Reporte Herramienta ========
//Abre pagina principal para requerir
router.get('/wh_ReporteHerramental', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Herramienta/wh_Reporte.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});



//Muestra reporte de entradas y salidas de herramienta
router.get('/TipoReporteHerramental/:parametros', AlmacenController.TipoReporteHerramental);

//Muestra reporte de entradas y salidas de herramienta
router.get('/MostrarReporteFiltrado/:parametros', AlmacenController.TipoReporteHerramentalFiltro);
//================================== MODULO de Herramental =================================// 
//Abre pagina principal para editar
router.get('/AdminHerramental', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Herramienta/wh_Admin.html');
	} else {
		res.render('Admin/Login.html');
	}
});

//Abre pagina principal para editar
router.get('/wh_EditarHerramental', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Herramienta/wh_Editar.html');
	} else {
		res.render('Admin/Login.html');
	}
});

//Busca Herramientas en Herramental por id
router.get('/BuscarHerramentalID/:parametros', AlmacenController.BuscarHerramentalID);
router.get('/HerramentalClave/:parametros', AlmacenController.HerramentalClave);
router.post('/GuardarCambiosHerramental', AlmacenController.GuardarCambiosHerramental);
router.post('/EliminarHerramental', AlmacenController.EliminarHerramental);
router.post('/GuardarNuevoHerramental', AlmacenController.GuardarNuevoHerramental);




//Abre pagina principal para requerir
router.get('/wh_EstadoActual', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Herramienta/EstadoActual.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

//Muestra reporte de entradas y salidas de herramienta
router.get('/EstadoActualHerramental/:parametros', AlmacenController.EstadoActualHerramental);

//====== Reporte Daños ========
//Abre pagina principal para requerir
router.get('/Danados', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Herramienta/ReporteDanados.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

//Abre pagina principal para requerir
router.get('/ReporteD', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Herramienta/ReporteDanados.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

//Muestra reporte de entradas y salidas de herramienta
router.get('/HerramentalDano/:parametros', AlmacenController.HerramentalDano);
router.post('/GuardarPDFDanado', AlmacenController.GuardarPDFDanado);

router.get('/HistorialReportesDanos/:parametros', AlmacenController.HistorialReportesDaños);




//============================== Gaveta Auditoria ==============================//
router.get('/AuditoriaGaveta', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Gaveta/GavetaAuditoria.html');
	} else {
		res.render('Admin/Login.html');
	}
});


router.get('/UbicacionesGaveta', OTController.UbicacionesGaveta);

router.get('/BuscarHerramientasUbicacion/:Ubicacion', AlmacenController.BuscarHerramientasUbicacion);

//Registra auditoria con un objeto
router.post('/RegistrarAuditoria', AlmacenController.RegistrarAuditoria);

router.get('/MostrarAuditoria/:Ubicacion', AlmacenController.MostrarAuditoria);

router.get('/ResumenAuditoria/', AlmacenController.ResumenAuditoria);


//====== Reporte Herramienta ========
//Abre pagina principal para requerir
router.get('/ArticulosNuevos', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/ArticulosNuevos.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

router.get('/ConsultaArticulosNuevos/:Articulo', AlmacenController.ConsultaArticulosNuevos);

router.get('/BuscarHerramienta/:Herra', AlmacenController.BuscarHerramienta);

//====== Reporte Herramienta ========
//Abre pagina principal para requerir
router.get('/wh_ConsumoBasico', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/ConsumoBasico/wh_ReporteArticulo.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

router.get('/ReporteConsumoBasico/:Herramienta', AlmacenController.ReporteConsumoBasico);

//Abre pagina principal para requerir
router.get('/wh_ReporteIngresos', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/ReporteIngresos/wh_ReporteIngresos.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

router.get('/ReporteHerramientaIngresos/:Herramienta', AlmacenController.ReporteHerramientaIngresos);

router.get('/BuscarHerramientasOC/:Herra', AlmacenController.BuscarHerramientasOC);

//Abre pagina principal para requerir
router.get('/Pruebas', (req, res) => {
	if (req.session.loggedin) {
		res.render('Soporte/Pruebas.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
});

//====== Tornilleria ========
//Abre pagina principal para tomar fotos
router.get('/HistorialOT', (req, res) => {
	if (req.session.loggedin) {
		res.render('Herramientas/HistorialOT.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});


router.post('/UpluadImages', upload.single('avatar'), function (req, res, next) {
	// req.file is the `avatar` file
	// req.body will hold the text fields, if there were any
	//console.log(req); // log to see uploaded file
	//console.log(req.body.avatar); // log to see uploaded file
	console.log(req.file); // log to see uploaded file
	res.send('Recibido')
	saveImage(req.file)
})

function saveImage(file) {
	const newPath = `./src/public/images/HistorialOT/${file.originalname}`;
	//const newPath = `./uploads/${file.originalname}`;
	fs.renameSync(file.path, newPath);
	return newPath;
}

router.get('/HistorialGaleria', (req, res) => {
	if (req.session.loggedin) {
		res.render('Herramientas/GaleriaHistorial.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});


router.get('/HistorialGaleriaGrid', (req, res) => {
	if (req.session.loggedin) {
		res.render('Herramientas/Matriz.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});


router.get('/Importador', (req, res) => {
	if (req.session.loggedin) {
		res.render('Herramientas/Importador.html', {
			title: 'Gemak'
		});
	} else {
		res.render('Admin/Login.html');
	}
	res.end();
});

router.get('/ExistenciaHerramienta', (req, res) => {
	if (req.session.loggedin) {
		res.render('Almacen/Herramienta/ExistenciaHerramienta.html');
	} else {
		res.render('Admin/Login.html');
	}
});

//Busca Herramientas en 
router.get('/ExistenciaTotalHerramientas/:parametros', AlmacenController.ExistenciaTotalHerramientas);

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

//IG0126 - CCMT 32.52-HM YBG202
//GM65352 16-01-24

