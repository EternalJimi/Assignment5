var express = require('express'),
    app = express();
var bodyParser = require("body-parser");
var uuid = require('node-uuid');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'warehouse_db'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser uses JSON data

//create a connection to mySQL
connection.connect(function (err) {             
    if (!err) {
        console.log("Connected to database.");
    } else {
        res.statusCode = 503; //Service unavailable
        console.log("Error...");
        console.log(err);
        process.exit(1);
    }
});

app.listen(2997, function () {
    console.log('Server started.');
});
