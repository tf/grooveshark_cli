/*global io, chrome*/

function Session(tab, port, onError) {
  var methods = ['togglePlayPause', 'play', 'pause', 'next', 'previous', 'volume'],
      socket;

  this.host = null;
  this.handle = null;
  this.onError = null;

  function reportError(text) {
    if (typeof onError === 'function') {
      onError(text);
    }
  }

  this.connected = function() {
    return socket && socket.socket.connected;
  };

  this.connect = function(host, handle) {
    if (this.connected()) {
      throw 'Already connected.';
    }

    this.host = host;
    this.handle = handle;

    if (!socket) {
      this.socket = socket = io.connect(host, {'auto connect': false, 'force new connection': true});
    }

    methods.forEach(function(method) {
      function listener(/* arguments */) {
        window.console.log('Received socket message ' + method);
        port.postMessage({method: method, args: [].slice.call(arguments)});
      }

      socket.on(method, listener);

      socket.once('disconnect', function() {
        socket.removeListener(method, listener);
      });
    });

    socket.socket.connect();
    socket.emit('join', handle);

    chrome.pageAction.setIcon({
      tabId: tab.id,
      path: 'icon_active.png'
    });
  };

  this.disconnect = function(tabClosed) {
    socket.disconnect();

    if (!tabClosed) {
      chrome.pageAction.setIcon({
        tabId: tab.id,
        path: 'icon.png'
      });
    }
  };
}