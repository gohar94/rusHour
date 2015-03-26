var mongoose = require('mongoose');
var Services = require('../models/Services.js');

module.exports = function (io) { 
	io.on('connection', function(socket){
		
		console.log('a user connected');
		
		socket.on('disconnect', function(){
			console.log('user disconnected');
		});

		socket.on('chat message', function(msg){
			io.emit('chat message', msg);
		});

		socket.on('update_count', function(msg){
			var id = msg.split("/")[0];
			Services.findById(id, function (err, post) {
				if (err) {
					io.emit('update_count', err);
				} else {
					console.log(post);
					var count = post["count"];
					var reply = id+"/"+count;
					io.emit('update_count', reply);
				}
			});
		});

	});
}