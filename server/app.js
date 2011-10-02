/*global require, console*/

var connect = require('connect'),
    io, server;

server = connect(
  connect.router(function(app) {
    app.get('/handle/:handle/:command', function(req, res) {
      console.log('emit ' + req.params.command + ' for ' + req.params.handle);
      io.sockets.in(req.params.handle).emit(req.params.command);

      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Dispatched');
    });
  })
);

io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket) {
  socket.on('join', function(handle) {
    console.log('joining ' + handle);
    socket.join(handle);
  });
});

server.listen(4000);