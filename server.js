var express = require('express');
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://localhost:27017/test';

var app = express();
var router = express.Router();

app.set('port', 80);
app.use(router);

router.get('/', function(req, res) {
    try {
        connectDb(function(db) {
            findUsers(db, function(users) {
                res.json(users);
            });
        });
    } catch (err) {
        console.log('/ ' + err);
        res.send('/ ' + err);
    }
});

var server = require('http').createServer(app);

server.listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port') + ' and connected to database.');
});

var connectDb = function(callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        callback(db);
    });
}

var findUsers = function(db, callback) {
    var collection = db.collection('user');
    collection.find({}).toArray(function(err, users) {
        assert.equal(err, null);
        db.close();
        callback(users);
    });
}
