const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const _ = require('underscore');
const { exception } = require('console');

const ShwarmaOrder = require("./assignment1Shwarma");

// Create a new express application instances


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("www"));

app.get("/users/:uname", (req, res) => {
    res.end("Hello " + req.params.uname);
});

let oOrders = {};
app.post("/sms", (req, res) =>{
    let sFrom = req.body.From || req.body.from;
    if(!oOrders.hasOwnProperty(sFrom)){
        oOrders[sFrom] = new ShwarmaOrder();
    }
    let sMessage = req.body.Body|| req.body.body;
    let aReply = oOrders[sFrom].handleInput(sMessage);
    if(oOrders[sFrom].isDone()){
        delete oOrders[sFrom];
    }
    res.setHeader('content-type', 'text/xml');
    let sResponse = "<Response>";
    for(let n = 0; n < aReply.length; n++){
        sResponse += "<Message>";
        sResponse += aReply[n];
        sResponse += "</Message>";
    }
    res.end(sResponse + "</Response>");
});

app.post("/payment/:phone", (req, res) => {
    // this happens when the order is complete
    sFrom = req.params.phone;
    const aReply = oOrders[sFrom].handleInput(req.body);
    const oSocket = oSockets[sFrom];
    // send messages out of turn
    for (let n = 0; n < aReply.length; n++) {
      if (oSocket) {
        const data = {
          message: aReply[n]
        };
        oSocket.emit('receive message', data);
      } else {
        throw new Exception("twilio code would go here");
      }
    }
    if (oOrders[sFrom].isDone()) {
      delete oOrders[sFrom];
      delete oSockets[sFrom];
    }
    res.end("ok");
  });
  
  app.get("/payment/:phone", (req, res) => {
    // this happens when the user clicks on the link in SMS
    const sFrom = req.params.phone;
    if (!oOrders.hasOwnProperty(sFrom)) {
      res.end("order already complete");
    } else {
      res.end(oOrders[sFrom].renderForm());
    }
  });
  
  app.post("/payment", (req, res) => {
    // this happens when the user clicks on the link in SMS
    //const sFrom = req.params.phone;
    const sFrom = req.body.telephone;
    oOrders[sFrom] = new ShwarmaOrder(sFrom);
    res.end(oOrders[sFrom].renderForm(req.body.title, req.body.price));
  });

var port = process.env.PORT || parseInt(process.argv.pop()) || 3002;

app.listen(port, () => console.log('Example app listening on port ' + port + '!'));
