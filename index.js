
const express = require('express');
require('dotenv').config();

const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 5000;
var path = require('path');
app.use(express.static(path.join(__dirname, 'client/build')));

var bq = 'btasks'; //bfs queue
var dq = 'dtasks'; //dfs queue
var exchange = 'crawl'; //exchange name
var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
var open = require('amqplib').connect(url);

// create a GET route
app.get('/', (req, res) => {
  res.render("index.html");
});


app.post('/dfs', (req, res)=>{
  console.log(req.body.param);
  var weba = JSON.stringify(req.body.param.website);
  var depa = req.body.param.depth;
  var key = JSON.stringify(req.body.param.keyword);
  var argList = '{ "website":' + weba + ', "depth":' + depa + ', "keyword":' + key + '}';
  console.log(argList);
  open.then(function(conn) {
    var ok = conn.createChannel();
    ok = ok.then(function(ch) {
      ok.assertExchange(exchange, 'direct', { durable: true });
      ch.assertQueue(dq);
      ch.bindQueue(dq, exchange, 'dfs');
      ch.publish(exchange, 'dfs', Buffer.from(argList));
      //ch.sendToQueue(q, Buffer.from(argList));
      
    });
    return ok;
  }).then(null, console.warn);
});


app.post('/bfs', (req, res)=>{
  console.log(req.body.website);
  var weba = JSON.stringify(req.body.param.website);
  var depa = req.body.param.depth;
  var key = JSON.stringify(req.body.param.keyword);
  var argList = '{ "website":' + weba + ', "depth":' + depa + ', "keyword":' + key + '}';
  console.log(argList);
  open.then(function(conn) {
    var ok = conn.createChannel();
    ok = ok.then(function(ch) {
      ok.assertExchange(exchange, 'direct', { durable: true });
      ch.assertQueue(bq);
      ch.bindQueue(bq, exchange, 'bfs');
      ch.publish(exchange, 'bfs', Buffer.from(argList));
      //ch.sendToQueue(q, Buffer.from(argList));

    });
    return ok;
  }).then(null, console.warn);
});
  
  
  
});


if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}


app.use(function (req, res) {
  res.status(404);
  res.send('404');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.send('500');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});

