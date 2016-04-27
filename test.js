MasterRec = require('./MasterRec.js')
ControlRec = require('./ControlRec.js')


var mr = new MasterRec("frame2", "screen3","keyboard2");

var cr = new ControlRec(mr, {baseUrl: "http://localhost:3000"});

//console.log(JSON.stringify(cr.steps));
console.log(JSON.stringify(cr.executeStep(0)));
console.log(JSON.stringify(cr.executeStep(1)));
console.log(JSON.stringify(cr.executeStep(cr.steps.length - 1)));
console.log(JSON.stringify(cr.executeStep(cr.steps.length)));
// this way you can catch the error
try {
  var mr2 = new MasterRec("frame2", "screen3","keyboard");

} catch(err) {
  console.error(err.message);
}


try {
  var mr23 = new MasterRec("frame2", "screen3");

} catch(err) {
  console.error(err.message);
}
