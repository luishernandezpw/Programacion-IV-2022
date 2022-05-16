const port = 3001;

/*var http = require('http').createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
});

http.listen(port, function() {
    console.log(`Server running at http://localhost:${port}/`);
});*/

var http = require('http').Server(),
    express = require('express'),
    app = express(),
    mongodb = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017',
    dbName = 'chatDB';

app.use(express.json());//para poder usar json
app.get('/chat', function(req, res){
    mongodb.connect(url, function(err, client){
        if( err ) console.log('Error al conectarse a la BD', err);
        const db = client.db(dbName);
        db.collection('user').find({}).toArray(function(er, users){
            res.send(users);
        });

    });
});
app.get('/juegos', function(req, res){
    res.send('<h1>Prueba con juegos</h1>');
});

app.listen(port, function(){
    console.log(`Server running at http://localhost:${port}/`);
});