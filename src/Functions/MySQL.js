const mysql = require('mysql');
const myConnection = require('express-myconnection');

var connection = mysql.createConnection({
     host:'192.168.2.8',
     user: 'Soporte',
     password: 'Soporte1702861',
     port: 3306,
     database: 'sigg'
});

module.exports.cnn = connection;

/*var ConsultaPrueba = connection.query("SELECT * FROM ControlPlaner", [], (err, consulta) => {//CONSULTA DE OT REFERENTE A LA ID [A]
  if(err){
      console.log(err);
  }
  console.log('Consulta propia: ' + consulta[0].OT);

  return consulta[0];
});

*/
//connection.end();



//module.exports.cnn2 = ConsultaPrueba;

/*
var connection = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: 'enigma1702861',
  port: 3306,
  database: 'ControlGemDB'
});

connection.connect(function(error){
if(error){
   throw error;
}else{
   console.log('Conexion correcta.');
}
});

//connection.end();
*/



    /*
var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM customers", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});*/