/* simple-redis-chat
A Simple Redis Chat Client written in JavaScript using nodejs and express.io
@authors: Joniel Ibasco <github.com/holycattle>, Kix Panganiban <github.com/kixpanganiban>
*/

var app = require('express.io')();
app.http().io();

// Socket routes
app.io.route('ready', function(req) {
    console.log('Client connected!');
});
app.io.route('msg-fromclient', function(req) {
    // Just bounce the message back to all clients
    req.io.broadcast('msg-toclient', req.data);
    console.log(req.data.username + ":" + req.data.message)
    });

// Normal http routes
app.get('/', function(req, res) {
    res.sendfile('index.html');
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log("Server started at http://%s:%s", host, port);
});