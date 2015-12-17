var json = require('json3');
var fs = require('fs');
var mongoconf = json.parse(fs.readFileSync('mongo.conf', { encoding: 'utf8' }));
var mongocl = require('mongodb').MongoClient;
var Promise = require('promise');
var db;

mongocl.connect(mongoconf.readonly, (err, _db) => {
  console.log("connected to "+mongoconf.readonly);
  if (!err)  db = _db;
});

module.exports = {
  findEntries: function(query) {
    return new Promise((resolve, reject) => {
      if (!db) reject("no db connection");
      var coll = db.collection(mongoconf.collection);
      coll.find(query).toArray((err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }
}
