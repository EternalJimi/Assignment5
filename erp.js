//Lauri Tyyska & Jimi Manninen
//ERP Port: 2997

var express = require('express'),
    app = express();
var bodyParser = require("body-parser");
var uuid = require('uuid');
var mysql = require('mysql');
var request = require('request');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'bear_db'
});

//Start MES & Connection to MES
var mes = require('./mes.js');
mesURL = "http://localhost:2998";
var supplier = require('./sup.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser uses JSON data

//create a connection to mySQL
connection.connect(function (err) {
    if (!err) {
        console.log("[ERP] Connected to database.");
    } else {
        //res.statusCode = 503; //Service unavailable
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
app.get('/orders', function (req, res) {
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
    if (id !== undefined) {
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

//----POST---------------------------------------------------------------------------

//--Post orders
app.post('/orders', function (req, res) {
    var data = {
        "New Order": ""
    };

    var query = req.query; //Accessing query

    // Create an id and GET the attributes and store them into variables
    var id = uuid.v4() // id generated
    var product = query.product;
    var quantity = query.quantity;
    var date = query.done_by;
    var customer = query.customer;
    var status = "in progress";

    // conenction to mysql database + inserting data to database according to given parameters + result handling
    connection.query("INSERT INTO orders (order_id,product,quantity,delivery,customer,status) VALUES ('" + id + "','" + product + "','" + quantity + "','" + date + "','" + customer + "','" + status + "')", function (err, rows, fields) {
        if (err) {
            console.log("Error Adding data: " + err);
            data["Message"] = "Error Adding data";
            //respond to postman
            res.status(400).json(data); //400 Query not complete
        } else {

            console.log("Order Created Successfully");
            data["Message"] = "Order Created Successfully";
            //respond to postman
            res.status(201).send({ url: '/order/' + id }); //201: Created
        }
    });

    var options = {
        url: mesURL + "/createNew",
        method: "POST",
        //here we are using our server url:
        json: {
            "product": product,
            "quantity": quantity,
            "order_id": id,
            "customer": customer 
        } //Body. These values get passed on when requested.
    }

    //logging request. just for debugging purposes, so that you can see if something goes wrong
    console.log(JSON.stringify(options));
    //request from require('request')
    request(options, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
        }
    });
});

//POST comes from MES 
//order materials from supplier (if warehouse has insufficien amount of materials to complete order for customer)
//all materials are from this same supplier, material batch size is 10, if need is for 2 screens -> oeder 10
app.post('/order-materials', function (req, res) {

    var customer = "Eternal-bobs Co"; //This is our company's name which supplier receives
    // CAPTURE WHAT MATERIAL AND AMOUNT
    var material = req.body.material;
    var quantity = req.body.quantity;

    var quantity = calculate_order(quantity);
    console.log(quantity);



    var options = {
        url: "http://localhost:4000/receive-orders",
        method: "GET",
        //here we are using our server url:
        json: {
            "customer": customer,
            "material": material,
            "quantity": quantity,
        } //Body. These values get passed on when requested.
    }
    
    //logging request. just for debugging purposes, so that you can see if something goes wrong
    //console.log(JSON.stringify(options));
    //request from require('request')
    request(options, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
        }
    });
    var data = {
        "Ordered materials": "",
        "Material": material,
        "Quantity": quantity
    }
    res.send(data);
    console.log("Ordered more materials: " + quantity + ", " + material)
});

//get -- order materials from the supplier ---- ADDING THE MATERIALS TO SQL AND INFORMING MES
app.get('/receive-materials', function (req, res) {
    var material = req.body.material; // WHAT MATERIAL 
    var quantity = req.body.quantity; //THE AMOUNT
    
    console.log("received: " + quantity + material);
    res.send();



});


//function for calculating the order amount from supplier
//material batch size is 10
function calculate_order(quantity) {
    var batch = Math.ceil(quantity / 10) * 10;
    return batch;
}

//----- ERP on port 2997 -----
app.listen(2997, function () {
    console.log('ERP server started. Port: 2997');
});