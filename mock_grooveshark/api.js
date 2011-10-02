Grooveshark = (function() {
  var methods = ['togglePlayPause', 'play', 'pause', 'next', 'previous', 'volume'],
      api = {};

  function log(text) {
    var container = document.getElementById('log'),
        p = document.createElement('p');

    p.innerText = text;
    container.appendChild(p);
  }

  methods.forEach(function(method) {
    api[method] = function(/* arguments */) {
      log('[Grooveshark] ' + method);
    }
  });

  return api;
}());