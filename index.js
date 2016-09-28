var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var line_history = [];
io.on('connection', function(socket){

	// first send the history to the new client
	for (var i in line_history) {
		socket.emit('draw_line', { line: line_history[i] } );
	}

	// add handler for message type "draw_line".
	socket.on('draw_line', function (data) {
		// add received line to history 
		line_history.push(data.line);
		// send line to all clients
		io.emit('draw_line', { line: data.line });
	});

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});