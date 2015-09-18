//taken from https://github.com/dwyl/hapi-socketio-redis-chat-example

var Hapi = require('hapi');
var server = new Hapi.Server();

var pub = require('redis-connection')();
var sub = require('redis-connection')('subscriber');

var SocketIO = require('socket.io');
var io;

//setup server
server.connection({
	host: '0.0.0.0',
	port: Number(process.env.PORT)
});
server.register(require('inert'), function () {

	server.route([
	  //static files
		{ method: 'GET', path: '/', handler: { file: "index.html" } },
	  { method: 'GET', path: '/client.js', handler: { file: './client.js' } },
	  { method: 'GET', path: '/style.css', handler: { file: './style.css' } },
	  
		//TODO: setup endpoint(s), i.e. an endpoint to load messages
	]);

	server.start(function () {
		initChat(server.listener, function(){
			console.log('Feeling Chatty?', 'listening on: http://127.0.0.1:'+process.env.PORT);
		});
	});	
});

//TODO: initialize chat
	// once redis pub/sub is ready, init socket connection and subscribe to relevant channels
	// setup socket listeners, i.e. the chat handler
		// handle users logging in
		// handle messages being sent
	// setup pubsub listener that sends data over the socket

function initChat (listener, callback) {
	pub.on("ready", function() {
		sub.on("ready", function() {
			sub.subscribe("chat:messages:latest", "chat:people:new");

			io = SocketIO.listen(listener);
			io.on("connection", chatHandler);

			sub.on("message", function(channel, message) {
				io.emit(channel, message);
			});

			callback();
		});
	});
}

function chatHandler (socket) {
	socket.on('io:name', function(name) {
		pub.HSET("people", socket.client.conn.id, name);
		pub.publish("chat:people:new", name);
	});

	socket.on('io:message', function(message) {
		console.log(message);
		pub.HGET("people", socket.client.conn.id, function(err, name) {
			var str = JSON.stringify({
				m: message,
				t: new Date().getTime(),
				n: name
			});
			console.log(socket.client.conn.id);
			console.log(name);
			pub.RPUSH("chat:messages", str);
			pub.publish("chat:messages:latest", str);
		});
	});
}

//TODO: handle endpoint that load messages
function loadMessages (req, reply) {
  pub.lrange("chat:messages", 0, -1, function (err, data) {
    reply(data);
  });
}

module.exports = server;
