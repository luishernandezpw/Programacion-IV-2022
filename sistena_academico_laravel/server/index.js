const port = 3001;

var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    mongodb = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017',
    dbName = 'chatDB',
    socketio = require('socket.io')(http);

socketio.on('connection', socket=>{
    console.log('Hola mundo desde socket.io');
});

app.use(express.json());//para poder usar json
app.get('/user', function(req, res){
    res.sendFile(__dirname + '/crud_user.html');
});
app.post('/user/save', function(req, resp){
    let user = req.body;
    mongodb.connect(url, function(err, client){
        if(err) resp.send(err);
        const db = client.db(dbName);
        db.collection('user').insertOne(user, function(err, result){
            if(err) resp.send(err);
            resp.send(result);
        });
    });
});
app.get('/user/list', function(req, res){
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

http.listen(port, function(){
    console.log(`Servidor corriendo en el puerto ${port}`);
});
/*app.listen(port, function(){
    console.log(`Server running at http://localhost:${port}/`);
});*/