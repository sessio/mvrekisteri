var json = require('json3');
var fs = require('fs');
var mongoconf = json.parse(fs.readFileSync('mongo.conf', { encoding: 'utf8' }));
var mongocl = require('mongodb').MongoClient;
var Promise = require('promise');

module.exports = {
  findEntries: function(query) {
    console.log("querying for name "+query.name);
    return new Promise((resolve, reject) => {
      mongocl.connect(mongoconf.readonly, (err, db) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var coll = db.collection(mongoconf.collection);
          coll.find(query).toArray((err, docs) => {
            console.log(docs.length + " results found");
            resolve(docs);
            db.close();
          });
        }
      });
    });
  }
}
