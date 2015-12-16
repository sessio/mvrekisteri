var express = require('express');
var path = require('path');
var checker = require('./checker');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/api/find', (req, res) => {
  var query = req.query['query'];
  console.log(query);
  if (query) {
    checker.findEntries(query).then(data => {
      res.json({ results: data });
    }, function(err) { res.json({ results: [], error: err }); });
  } else res.json({ results: [], error: "no query" });
});

var server = app.listen(3000, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log("serving at %s:%s", host, port);
});
