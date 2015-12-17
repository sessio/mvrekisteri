var express = require('express');
var path = require('path');
var checker = require('./checker');
var bodyParser = require('body-parser');
var app = express();

var port = 3000;

if (process.argv.length > 2) port = parseInt(process.argv[2]);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/api/find', (req, res) => {
  var query = req.query['query'];
  console.log("query:");
  console.log(query);
  if (query) {
    checker.findEntries(query).then(data => {
      res.json({ results: data });
    }, function(err) { 
      console.log("findEntries rejected: " + err);
      res.json({ results: [], error: "mongo error" }); 
    });
  } else res.json({ results: [], error: "no query" });
});

var server = app.listen(port, () => {
  var shost = server.address().address;
  var sport = server.address().port;
  console.log("serving at %s:%s", shost, sport);
});
