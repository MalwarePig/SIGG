//////// ARCHIVO PARA CONEXION DB //////////
//toda tle este archiv no se usa ni de coñaaaa
const mysql = require('mysql');
const pool = mysql.createPool(database);

const mysqlConnection =  mysql.createConnection({
    host: 'localhost',
    user: 'Soporte',
    password: '',
    port: 3306,
    database: 'controlgemdb'
});

mysqlConnection.connect(function (err){//iniciar conexion
    if(err){
        console.log(err);
        return;
    }else{
        console.log('DB ONLINE')
    }
});

pool.getConnection(function (err){//iniciar conexion
    if(err){
        console.log(err);
        return;
    }else{
        console.log('DB ONLINE')
    }
});

module.exports = mysqlConnection;
    