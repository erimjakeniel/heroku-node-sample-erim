var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT||3000


app.get('/', function(req, res) {
   res.sendfile('index.html');
});

var users = [];

io.on('connection', function(socket) {
   socket.on('setUsername', function(data) {
      console.log(data);
      if(users.includes(data)) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data);
         io.emit('userSet', users);
      }
   });

   socket.on('logout', function(username) {
       var i = users.indexOf(username);
       users.splice(i, 1);
       io.emit("userSet", users);
       io.emit('logout', username);
   })
   
   socket.on('msg', function(data) {
      io.sockets.emit('newmsg', data);
   })
});

http.listen(port, function() {
   console.log('listening on localhost:' + port);
});