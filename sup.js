//Lauri "fernando" Tyyskä & Jimi "eternal-boob" Manninen
//SUPPLIER Port: 4000
// THIS SERVER SIMULATES THE MATERIAL SUPPLIER
// ALL MATERIALS ARE FROM THIS SUPPLIER


var express = require('express'),
    app = express();
var bodyParser = require("body-parser");
var request = require('request');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser uses JSON data

app.get('/receive-orders', function (req, res) {
    
    var customer = req.body.customer;
    var material = req.body.material;
    var quantity = req.body.quantity;

    var data = {
        "Ordered materials": "",
        "From": customer,
        "Material": material,
        "Quantity": quantity
    };
    res.send(data);
    console.log("New order received from "+ customer)
    console.log("Processing!")
    console.log("DONE!")

    // The order is processed and the order the materials are sent

    var options = {
        url: "http://localhost:2997/receive-materials",
        method: "GET",
        //here we are using our server url:
        json: {
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


});

//----- SUPPLIER on port 4000 -----
app.listen(4000, function () {
    console.log('SUP server started. Port: 4000');
});
