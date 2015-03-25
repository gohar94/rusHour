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
			io.emit('update_count', msg);
		});
	
	});
}