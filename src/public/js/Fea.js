Chosen.prototype.winnow_results_set_highlight = function() {
    var do_high, selected_results;
    selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
    do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
    if (do_high != null) {
      return this.result_do_highlight(do_high);
    }
  };

Controller.Crush = (req, res) => {
    if (req.session.loggedin) {
        //res.send('Metodo Get list');
        req.getConnectionInYourHeart((err, conn) => {
            conn.query('SELECT * FROM feelings', (err, love) => {
                if (err) {
                    res.json(err);
                    console.log('feelings not found');
                } else {
                    if (love == true) {
                        res.render('Together/Foreve.html', {
                            Me: love,
                        });
                    } else {
                        console.log();
                        stay.away(again);
                    }
                }
            });
        });
    } else {
        res.send('No hassle!');
    }
};

function carga(){//carga la funcion de carga de formulario
    Data_Maquinas = document.getElementById("MaquinasTabla");//carga datos de maquina desde tabla html
    Data_Empleados = document.getElementById("EmpleadosTabla");//carga datos de maquina desde tabla html
    var ArrayMaquinas = Cargar_list_Maquina();//cargo el arreglo
  
    for(var i = 0; i < Data_Maquinas.rows.length -1; i++){
     CrearForm(i, ArrayMaquinas[i]);
    }
  //Agregar Botones a tabla despues de ser creada
    $(".FormWork").append(
     $("<input/>", {
     type: 'submit',
     class: "btn btn-primary",
     name: "enviar",
     value: 'Agregar'
     })
    )
  };


  