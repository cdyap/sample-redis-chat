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
	// once redis is ready, init socket connection
	// setup socket listeners, i.e. the chat handler
		// handle users logging in
		// handle messages being sent
	// setup pubsub listener that sends data over the socket

function initChat(listener, callback) {
	callback();
}

//TODO: handle endpoint that load messages
function loadMessages (req, reply) {
  pub.lrange("chat:messages", 0, -1, function (err, data) {
    reply(data);
  });
}

module.exports = server;
