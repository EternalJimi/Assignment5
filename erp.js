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

//Connection to MES
var mes = require('./mes.js');

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

//----GET---------------------------------------------------------------------------
//----Get warehouse-----------------------------------------------------------------
app.get('/erp', function (req, res) {
    var erpView = {
        //links
        orders: "/orders"
    };
    res.send(erpView);
});

//--get orders
app.get('/orders', function (req,res){
    var data = {
        "Orders": ""
    };
    
    var sql_query = "SELECT * FROM orders";
    
    //connection to mysql + result handling
    connection.query(sql_query, function (err, rows, fields) {
        if (rows.length != 0) {
            data["Orders"] = rows;
            res.status(200).json(data);
        } else {
            data["Orders"] = 'Orders not found.';
            res.status(404).json(data);
        }
    });
});

//--get order
app.get('/order/:id', function (req, res) {
    
    var data = {
        "Back to Orders": "/orders",
        "Order": ""
    };
    
    //get id param 
    var id = req.params.id;

    //Start creating the sql query - Query is compiled according to the users given parameters
    var sql_query = "SELECT * FROM orders";
    
    //Checking the param
    if (query.hasOwnProperty('id')) {
        sql_query = sql_query + " WHERE order_id='" + id + "'";
    } else {
        console.log("No order id given.")
            data["Message"] = "Bad request: Empty attributes!";
            res.status(400).json(data); //Bad request
    }

    //connection to mysql and final query statement + result handling
    connection.query(sql_query, function (err, rows, fields) {
        if (rows.length != 0) {
            data["Order"] = rows;
            res.status(200).json(data);
        } else {
            data["Order"] = 'Order not found.';
            res.status(404).json(data);
        }
    })

});

//----- ERP on port 2997 -----
app.listen(2997, function () {
    console.log('Server started.');
});
