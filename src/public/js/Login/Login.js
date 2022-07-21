function Login(){
    let usuario = document.getElementById("Usuario").value; 
    let contraseña = document.getElementById("Contraseña").value;

    let data = {
        Usuario : usuario,
        Contraseña : contraseña
    }

    console.log(data)
    $.post("/Login", // inicia la lista de ot en el flujo de produccion
    {
        data
    }, // data to be submit
    function (objeto, estatus) { // success callback
        //console.log("objeto: " + objeto + "Estatus: " + estatus);
    });
}
    

