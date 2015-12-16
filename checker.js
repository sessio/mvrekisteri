var json = require('json3');
var fs = require('fs');
var mongoconf = json.parse(fs.readFileSync('mongo.conf', { encoding: 'utf8' }));
var mongocl = require('mongodb').MongoClient;
var Promise = require('promise');
var db;

mongocl.connect(mongoconf.readonly, (err, _db) => {
  if (!err)  db = _db;
});

module.exports = {
  findEntries: function(query) {
    console.log("querying for name "+query.name);
    if (!db) reject();
    return new Promise((resolve, reject) => {
      var coll = db.collection(mongoconf.collection);
      coll.find(query).toArray((err, docs) => {
        console.log(docs.length + " results found");
        resolve(docs);
      });
    });
  }
}
