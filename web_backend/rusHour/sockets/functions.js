var mongoose = require('mongoose');
var Services = require('../models/Services.js');

module.exports = function (io) {
	try {
		io.on('connection', function(socket){
			
			console.log('a user connected');
			
			socket.on('disconnect', function(){
				console.log('user disconnected');
			});

			socket.on('chat message', function(msg){
				io.emit('chat message', msg);
			});

			socket.on('update_count', function(msg){
				var message_array = msg.split("/");
				var id = message_array[0];
				var delta = message_array[1];
				var operator = message_array[2];
				Services.findById(id, function (err, post) {
					if (err) {
						io.emit('update_count', err);
					} else {
						console.log(post);
						var count = post["count"];
						var reply = id+"/"+count;
						io.emit('update_count', reply);
						
						var name = post["name"];
						var action = "";
						if (operator == "inc") {
							action = "arrived at ";
						} else {
							action = "departed from ";
						}
						var noun = "";
						if (delta == "1") {
							noun = " person ";
						} else {
							noun = " people ";
						}
						var ticker_string =  delta + noun + action + name;
						io.emit('update_ticker', ticker_string);
					}
				});
			});

		});
	} catch (err) {
		console.log(err);
	}
}