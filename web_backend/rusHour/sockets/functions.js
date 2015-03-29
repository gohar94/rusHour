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

			socket.on('services_review', function(msg){
				io.emit('services_review', msg);
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
						// if (operator == "inc") {
						// 	action = "arrived at ";
						// } else {
						// 	action = "departed from ";
						// }
						// var noun = "";
						// if (delta == "1") {
						// 	noun = " person ";
						// } else {
						// 	noun = " people ";
						// }
						// var ticker_string =  delta + noun + action + name;
						delta = parseInt(delta);
						var ending = "";
						if (delta < 50) {
							ending = " HURRY! Avail some exciting deals for the next 1 hour.";
						} else {
							ending = " Too crowded! Get 10% off in 45 mins.";
						}
						var ticker_string =  delta + " percent rush at " + name + ending;
						io.emit('update_ticker', ticker_string);
					}
				});
			});

		});
	} catch (err) {
		console.log(err);
	}
}