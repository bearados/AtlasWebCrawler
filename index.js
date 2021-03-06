
const express = require('express');
require('dotenv').config();

const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 5000;
var path = require('path');
app.use(express.static(path.join(__dirname, 'client/build')));



// create a GET route
app.get('/', (req, res) => {
  res.render("index.html");
});


app.post('/dfs', (req, res)=>{
  console.log(req.body);
  var spawn = require("child_process").spawn;
  const depthCrawl = spawn('python',["./scripts/df_crawl.py", 
  req.body.website, req.body.depth, req.body.keyword]);
  depthCrawl.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
  });
  depthCrawl.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
  });
  depthCrawl.on('exit', function (code, signal) {
    console.log('child process exited');
    res.sendFile(path.join(__dirname, '/scripts/logs', 'crawl.log'));
  });
  
  
});


app.post('/bfs', (req, res)=>{
  
  console.log(req.body.website);
  var spawn = require("child_process").spawn;
  const depthCrawl = spawn('python',["./scripts/bf_crawl.py", 
  req.body.website, req.body.depth, req.body.keyword]);
  depthCrawl.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
  });
  depthCrawl.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
  });
  depthCrawl.on('exit', function (code, signal) {
    console.log('child process exited');
    res.sendFile(path.join(__dirname, '/scripts/logs', 'crawl.log'));
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

