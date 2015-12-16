var fs = require('fs');
var json = require('json3');
var crypto = require('crypto');
var csvparse = require('csv-parse');
var data = fs.readFileSync('data/googlecache.merged.csv', { encoding: 'utf8' });
var mongoconf = json.parse(fs.readFileSync('mongo.conf', { encoding: 'utf8' }));

var mongocl = require('mongodb').MongoClient;

mongocl.connect(mongoconf.readwrite, (err, db) => {
  if (err) {
    console.log(err);
    exit(-1);
  }

  var coll = db.collection(mongoconf.collection);

  csvparse(data, {}, (err, output) => {
    console.log("generating hashes for " + output.length + " csv entries");
    var hashedArr = output.map(entry => {
      return {
        name: gethash(entry[0]),
        phone: gethash(entry[1]),
        city: gethash(entry[2]),
        address: gethash(entry[3]),
        phone: gethash(entry[4])
      };
    });
    if (doInsert) {
      console.log("hashs generated, inserting");
      coll.insert(hashedArr, (err, result) => {
        if (err) console.log(err); else console.log("finished");
        db.close();
      });
    }
  });
});

function gethash(input) {
  var trimmed = input.trim().toLowerCase();
  //console.log("'" + input + "' -> '" + trimmed + "'");
  return crypto
  .createHash('md5')
  .update(trimmed, 'utf8')
  .digest('hex');
}
