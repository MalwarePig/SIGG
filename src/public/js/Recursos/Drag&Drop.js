const lista = document.getElementById('lista');//crear lista de elementos
const izquierdo = document.getElementById('TrabajadorUno');//crear lista de elementos
const centro = document.getElementById('TrabajadorDos');//crear lista de elementos
const derecho = document.getElementById('derecho');//crear lista de elementos

function TipoTabla(tipo){
    if(tipo =='Unitabla'){
        Sortable.create(lista, {
            animation: 150,
            group: "Empleados",
            store: {    //GUARDAR ORDEN DE LA LISTA
                /**
                 * Get the order of elements. Called once during initialization.
                 * @param   {Sortable}  sortable
                 * @returns {Array}
                 */
                get: function (sortable) {  //crga el orden de la lista
                    var order = localStorage.getItem(sortable.options.group.name); // obtener el orde guardado de los elementos
                    return order ? order.split('|') : []; //si exite el areglo, dividir string por | sino devovler arreglo vacio
                },
        
                /**
                 * Save the order of elements. Called onEnd (when the item is dropped).
                 * @param {Sortable}  sortable
                 */
                set: function (sortable) {//Guarda el orde de los elementos en un arreglo
                    var order = sortable.toArray();
                    localStorage.setItem(sortable.options.group.name, order.join('|')); //convertir a String arreglo y separarlo por | (parametro nombre de grupo,array)
                },
            }
        })
    }else{
        new Sortable(izquierdo, {
            //group: 'G-Izquierdo', // set both lists to same group
            group: 'G',
            swap: true, // Enable swap plugin
            filter: '.filtered', //No se podra arrastar divs con esta clase
	        swapClass: 'highlight', // The class applied to the hovered swap item-
            animation: 150
        });
        
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
            onEnd: () =>{
                var ArrayTDosDivs = document.getElementById("derecho");
                var ObjetosTrabajadores = ArrayTDosDivs.getElementsByTagName('*');    //Obtener nodos hijos div Padre
                for (var i = 0; i < ObjetosTrabajadores.length; ++i) {
                    var ValorTrabajador = '-';
            
                    ObjetoT = ObjetosTrabajadores[i];  //Obtner el nodo del arreglo
                    ValorTrabajador = ObjetoT.innerHTML;  //Obtener el valor del nodo
                    //Nota solo falta compara el div para crear debajo el nuevo div vacio
                    if(i == 0 && ValorTrabajador != '-'){
                     console.log("Trabajador: "+ValorTrabajador);
                         //crear div para trabajador vacio
                         var newDiv = document.createElement("div"); 
                         var texto = document.createTextNode("-"); 
                         newDiv.appendChild(texto); //añade texto al div creado. 
                         var clase = document.createAttribute("class");       // Create a "class" attribute
                         clase.value = "list-group-item col-15";              // Set the value of the class attribute
                         newDiv.setAttributeNode(clase); 

                         var dataid = document.createAttribute("data-id");       // Create a "class" attribute
                         dataid.value = "data it tal";              // Set the value of the class attribute
                         newDiv.setAttributeNode(dataid); 

                         derecho.prepend(newDiv);
                         console.log('fin');
                         /*var currentDiv = document.getElementById("derecho"); 
                         document.body.insertBefore(newDiv, currentDiv); */
                    }//if validador
                }//For
            }//OnEnd
        });//Sortable Empleados Libres

    }//condicion de tipo de Drag & drop (Fila o unifila)
}//Fin de funcion

