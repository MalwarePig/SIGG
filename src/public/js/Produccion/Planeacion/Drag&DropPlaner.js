const lista = document.getElementById('Maquinas'); //crear lista de elementos
const centro = document.getElementById('Cola'); //crear lista de elementos
const derecho = document.getElementById('Libres'); //crear lista de elementos

function TipoTabla(tipo) {
    if (tipo == 'Unitabla') {
        Sortable.create(lista, {
            animation: 150,
            group: "Empleados",
            store: { //GUARDAR ORDEN DE LA LISTA
                /**
                 * Get the order of elements. Called once during initialization.
                 * @param   {Sortable}  sortable
                 * @returns {Array}
                 */
                get: function (sortable) { //crga el orden de la lista
                    var order = localStorage.getItem(sortable.options.group.name); // obtener el orde guardado de los elementos
                    return order ? order.split('|') : []; //si exite el areglo, dividir string por | sino devovler arreglo vacio
                },

                /**
                 * Save the order of elements. Called onEnd (when the item is dropped).
                 * @param {Sortable}  sortable
                 */
                set: function (sortable) { //Guarda el orde de los elementos en un arreglo
                    var order = sortable.toArray();
                    localStorage.setItem(sortable.options.group.name, order.join('|')); //convertir a String arreglo y separarlo por | (parametro nombre de grupo,array)
                },
            }
        })
    } else {
        new Sortable(centro, {
            swap: true, // Enable swap plugin
            swapClass: 'highlight', // The class applied to the hovered swap item
            filter: '.filtered', //No se podra arrastar divs con esta clase
            //group: 'G-Centro',
            group: 'G',
            animation: 150
        });

        new Sortable(derecho, {
            filter: '.filtered', //No se podra arrastar divs con esta clase
            draglass: 'selected',
            // group: 'G-Derecho',
            group: 'G',
            animation: 150,
            onEnd: () => {
                var ArrayTDosDivs = document.getElementById("Libres");
                var ObjetosTrabajadores = ArrayTDosDivs.getElementsByTagName('*'); //Obtener nodos hijos div Padre
                for (var i = 0; i < ObjetosTrabajadores.length; ++i) {
                    var ValorTrabajador = '-';
                    ObjetoT = ObjetosTrabajadores[i]; //Obtner el nodo del arreglo
                    ValorTrabajador = ObjetoT.innerHTML; //Obtener el valor del nodo
                    console.log(ObjetoT.innerHTML)
                } //For*/
            } //OnEnd
        }); //Sortable Empleados Libres

    } //condicion de tipo de Drag & drop (Fila o unifila)
} //Fin de funcion

function MostrarFila(Maquina) {
    Eliminar()
    document.getElementById("SpanMaquina").innerHTML = Maquina;
    $.ajax({
        url: '/OTMaquinando/' + Maquina,
        success: function (data) {
            console.table(data)
            let DivCola = document.getElementById("Cola");
            for (let index = 0; index < data.length; index++) {

                let DivNuevo = document.createElement('div');
                DivNuevo.setAttribute('class', 'list-group-item col-15');
                DivNuevo.setAttribute('data-id', 'data it tal');
                DivNuevo.setAttribute('id', data[index].OT);
                DivNuevo.innerHTML = '[' + data[index].OT + ']' + '    [' + data[index].Parte + ']';
                DivNuevo.setAttribute('ondblclick','Alerta()');
                 

                DivCola.appendChild(DivNuevo);
            }
        } //Funcion success
    });
}

function Alerta(){
    alert("Prueba")
}


function Eliminar() {
    var element = document.getElementById("Cola");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}