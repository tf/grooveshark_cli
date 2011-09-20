var http = require('http'),
    io = require('socket.io'),
    url = require('url'),
    server, manager, target;

function handleRequest(req, res) {
  if (!target) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('No grooveshark instance connected\n');
    return;
  }

  var u = url.parse(req.url)

  if (u.pathname === '/playPause') {
    target.emit('playPause');
  }

  if (u.pathname === '/previous') {
    target.emit('previous');
  }

  if (u.pathname === '/next') {
    target.emit('next');
  }

  if (u.pathname === '/volume') {
    target.emit('volume', u.query.value);
  }

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Dispatched.');
}

server = http.createServer(handleRequest);
server.listen(4000);

manager = io.listen(server);

manager.sockets.on('connection', function(socket) {
  target = socket;
});