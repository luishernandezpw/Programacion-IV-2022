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
    app = express();

app.get('/chat', function(req, res){
    res.send('<h1>Prueba con express</h1>');
});
app.get('/juegos', function(req, res){
    res.send('<h1>Prueba con juegos</h1>');
});

app.listen(port, function(){
    console.log(`Server running at http://localhost:${port}/`);
});