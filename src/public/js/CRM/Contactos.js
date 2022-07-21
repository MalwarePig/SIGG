//Rellenar formulario desde tabla al hacer clic
function SelectElements() {
	var rows = document.getElementById("RegistroClientes").rows;
	for (i = 0; i < rows.length; i++) {
		rows[i].onclick = function () {
			return function () {
				document.getElementById("FormClientes").reset(); //Resetea fromulario
				var id = this.cells[0].innerHTML;
				var Cliente = this.cells[1].innerHTML;
				var Pagina = this.cells[2].innerHTML;
				var Direccion = this.cells[3].innerHTML;
				var Pais = this.cells[4].innerHTML;
				var Estado = this.cells[5].innerHTML;
				var Planta = this.cells[6].innerHTML;
				/////////////////////////////////////
				var contacto = this.cells[7].innerHTML;
				var Correo = this.cells[8].innerHTML;
				var Puesto = this.cells[9].innerHTML;
				var Telefono = this.cells[10].innerHTML;
				var Celular = this.cells[11].innerHTML;
				var FechaInicio = this.cells[12].innerHTML;
				var Fuente = this.cells[13].innerHTML;
				var Industria = this.cells[14].innerHTML;
				var Estatus = this.cells[15].innerHTML;
				var Gasto = this.cells[16].innerHTML;
				var Comentarios = this.cells[17].innerHTML;
				document.getElementById("id").value = id;
				document.getElementById("Cliente").value = Cliente;
				document.getElementById("Pagina").value = Pagina;
				document.getElementById("Direccion").value = Direccion;
				document.getElementById("Pais").value = Pais;
				document.getElementById("Estado").value = Estado;
				///////////////////////////////////////
				document.getElementById("contacto").value = contacto;
				document.getElementById("Correo").value = Correo;
				document.getElementById("Puesto").value = Puesto;
				document.getElementById("Telefono").value = Telefono;
				document.getElementById("Celular").value = Celular;
				document.getElementById("Gasto").value = Gasto;
				document.getElementById("Comentarios").value = Comentarios;
				//===========================================   list Planta    ==================================================//
				var indice = document.getElementById("Planta").options.length; //OBTENER TOTAL DE ELEMENTOS
				for (var i = 0; i < indice; i++) {
					var valor = document.getElementById("Planta").options[i].text; //OBTENER LOS VALORES DEL SELECT
					if (Planta == valor) {
						document.ready = document.getElementById("Planta").value = valor; //setear la maquina en un indice
					}
				}
				//===========================================   list Fuente    ==================================================//
				var indice = document.getElementById("Fuente").options.length; //OBTENER TOTAL DE ELEMENTOS
				for (var i = 0; i < indice; i++) {
					var valor = document.getElementById("Fuente").options[i].text; //OBTENER LOS VALORES DEL SELECT
					if (Fuente == valor) {
						document.ready = document.getElementById("Fuente").value = valor; //setear la maquina en un indice
					}
				}
				//===========================================   list Industria    ==================================================//
				var indice = document.getElementById("Industria").options.length; //OBTENER TOTAL DE ELEMENTOS
				for (var i = 0; i < indice; i++) {
					var valor = document.getElementById("Industria").options[i].text; //OBTENER LOS VALORES DEL SELECT
					if (Industria == valor) {
						document.ready = document.getElementById("Industria").value = valor; //setear la maquina en un indice
					}
				}
				//===========================================   list Estatus    ==================================================//
				var indice = document.getElementById("Estatus").options.length; //OBTENER TOTAL DE ELEMENTOS
				for (var i = 0; i < indice; i++) {
					var valor = document.getElementById("Estatus").options[i].text; //OBTENER LOS VALORES DEL SELECT
					if (Estatus == valor) {
						document.ready = document.getElementById("Estatus").value = valor; //setear la maquina en un indice
					}
				}
				//===========================================   Date    ==================================================//
				document.getElementById("FechaInicio").defaultValue = FechaInicio;
			};
		}(rows[i]);
	}
}

//Guardar Cambios
async function Update() {
	//Crear Objeto para guardar
	var ObjetoTabla = {
		id: document.getElementById("id").value,
		Cliente: document.getElementById("Cliente").value,
		Pagina: document.getElementById("Pagina").value,
		Direccion: document.getElementById("Direccion").value,
		Pais: document.getElementById("Pais").value,
		Estado: document.getElementById("Estado").value,
		Planta: document.getElementById("Planta").value,
		contacto: document.getElementById("contacto").value,
		Correo: document.getElementById("Correo").value,
		Puesto: document.getElementById("Puesto").value,
		Telefono: document.getElementById("Telefono").value,
		Celular: document.getElementById("Celular").value,
		FechaInicio: document.getElementById("FechaInicio").value,
		Fuente: document.getElementById("Fuente").value,
		Industria: document.getElementById("Industria").value,
		Estatus: document.getElementById("Estatus").value,
		Gasto: document.getElementById("Gasto").value,
		Comentarios: document.getElementById("Comentarios").value
	}
	console.log("Tabla" + ObjetoTabla);
	//guardar objeto en BD
	const valores = $.post("/UpdateCliente", // url
		{
			ObjetoTabla
		}, // data to be submit
		function (objeto, estatus) { // success callback
			console.log("objeto: " + objeto + "Estatus: " + estatus);
		});
	console.log(valores);

	setInterval("actualizar()", 1000);
}

function actualizar() {
	location.reload(true);
}
//Función para actualizar cada 4 segundos(4000 milisegundos)