// JavaScript source code
// importing the modules we will need: Express for Server, Request for Client
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
    app.use(bodyParser.json());


// 18.04: Dependencies, do not forget to use './' for files in same folder
var MasterRec = require('./MasterRec.js');
var ControlRec = require('./ControlRec.js');

var request = require('request');



//connection to mysql 
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'bear_db'
});
//create a connection to mySQL
connection.connect(function (err) {
    if (!err) {
        console.log("[SCADA] Connected to database.");
    } else {
        res.statusCode = 503; //Service unavailable
        console.log("Error...");
        console.log(err);
        process.exit(1);
    }
});
//check mysQL for exiting phone model recipes and create master recipes. Restored to repo for later use.
var master = "SELECT * FROM master_recipe";
    master = connection.query(master, function (err, rows) {
    if (err) {
        console.log(err);

    } else {

        for (i = 0; i < rows.length; i++) {

            ID = rows[i].id;
            frame = rows[i].frame;
            screen = rows[i].screen;
            keyboard = rows[i].keyboard;

            var mr = new MasterRec(frame, screen, keyboard);
            mr.id = ID

            repo.masterRecs[mr.id] = mr;
        };

    }
});
// Repository for recipies
var repo = {
    masterRecs: {},
    contorlRecs: {}
};

/* THIS FOR ADDING MASTER RECIPIES
app.post("/master-recipes/newMaster", function (req, res) {
    //get data from body
    var frame = req.query.frame;
    var screen = req.query.screen;
    var keyboard = req.query.keyboard;

    // create MasterRec from data. You can add here error handling to avoid posting blob to user
    var mr = new MasterRec(frame, screen, keyboard);
    // put to the repository using MasterRec generated id
    // NOTE that using database you may need to invert it, so that repo will give you an id to
    // create the master
    repo.masterRecs[mr.id] = mr;
    // Return some hypermedia, e.g. the created object
    res.send({ url: '/master-recipes/' + mr.id });
});
*/
var ready = 0;  //how many phones are ready
var quantity = 1;   //phone quantity to be manufactured
var model = '';
var orderID = 0;
//--------------------------------------------------------------
//POST master recipe 
//check master recepy id according to the phone model from the sql
//if ok, post("/control-recepies" to create contol recepy)
app.post("/master-recipes", function (req, res) {
    
    ready = 0;
    model = req.body.model;
    quantity = req.body.quantity;
    orderID = req.body.orderID;
    
    // GETTING THE MASTERRECEPY ID FROM SQL QUERY BASED ON THE MODEL -> RECEIVE THE MASTER ID
    var master_id = "SELECT id FROM master_recipe WHERE model='" + model + "'";
    connection.query(master_id, function (err, rows) {
        //if id is found, the length of the rows is not 0 
        if (rows.length != 0) {
            res.send();
            masterID = rows[0].id; // the id for master recepy
            console.log("MASTER-ID: " + masterID);
            var options = {
                url: "http://localhost:2999/control-recipes",
                method: "POST",
                json: { "master_recepy": masterID } //body
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

        } else {
            console.log("There is no master-recipe for model: " + model);
            res.send({ "Message": "Bad request: there is no master recipy model: " + model });

        }
    });
});
//GET all master recipe
app.get("/master-recipes", function (req, res) {
    res.send(repo.masterRecs);
});


//DELETE remove the master recipe
app.delete("/master-recipes/:id", function (req, res) {
    //should execute the first node. in this case loadPalletReq

    var id = req.params.id;
    // Delete object
    delete repo.masterRecs[id];
    res.send();
});



// control recipes
// POST: create control.recepy from master-recepy according to the masterID
app.post("/control-recipes", function (req, res) {

    //PICK UP THE ID 
    var masterID = req.body.master_recepy;
    console.log("master-ID: " + masterID);
    
    var body = {
        "baseUrl": "http://localhost:3000"
    };  //CONTROL RECEPY NEED FASTORY PATH FOR ROBOT CONTOLS
    console.log(body);
    
    var cr = new ControlRec(repo.masterRecs[masterID], body);
    var quantity = 5;
    repo.contorlRecs[cr.id] = cr;
    console.log("CONTROL-ID: " + cr.id);
    
    execute(cr.id, 0); //connect to fastory
 
});

//GET all control recipes
app.get("/control-recipes", function (req, res) {
    res.send(repo.contorlRecs);
});

/**
* Execute method, runs the step of the control recipe defined by ids.
* uses the recipe executeStep function to get request url and destUrl postfix
* @param {String} id - the recipe id
* @param {Number} step - the step number
*/

var execute = function (id, step) {
    // getting recipe ! check if exists`
    var rec = repo.contorlRecs[id];
    // getting execution details
    var exec = rec.executeStep(step);
    console.log("-------------------" + exec);
    // creating reqiest details
    
    var options = {
        url: exec.url,
        method: "POST",
        //here we are using our server url:
        json: { destUrl: "http://localhost:2999/notifications/" + exec.callback } //
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
}

/* Notifications receiver endpoint.
 * now works with recipe id and step id both
 */
app.post("/notifications/:recipeId/:stepId", function (req, res) {
    var stepId = req.params.stepId; // getting the parameter from the url
    var recipeId = req.params.recipeId; // getting the parameter from the url
    
    // just logging the steps
    console.log(recipeId, ':', stepId);
    if (stepId === 'done') {
        // if the parameter is "done" - stop execution
        ready = ready + 1;
        console.log('done--------------------------------------------------------');
        console.log("-----------------------------------THERE ARE " +ready + " model " + model + " ready");
        if (ready == quantity) {
            console.log("------------------------------------------Order " + orderID + " is ready!-----------");

            var options = {
                url: "http://localhost:2998/scada-ready",
                method: "GET",
                json: {
                    "model": model,
                    "quantity": quantity,
                    "orderID": orderID
                } //body
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

        } else {
            execute(recipeId, 0);
        }
    } else {
        execute(recipeId, stepId);
    }
    res.send();// do not forget to response to the simulator on Notifications
});


// ---------------------------------------------------------------------end of 18.04 comments
// starting the server
app.listen(2999, function () {
    console.log('SCADA Server started. Port: 2999');
});
