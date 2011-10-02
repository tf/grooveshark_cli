function callGroovesharkMethod(method, args) {
  var script = document.createElement('script');
  script.innerHTML = 'Grooveshark.' + method + '(' + args.join(', ') + ');';
  document.body.appendChild(script);
}

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    callGroovesharkMethod(msg.method, msg.args || []);
  });
});
