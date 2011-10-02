var connectedTab = document.getElementById('connectedTab'),
    disconnectedTab = document.getElementById('disconnectedTab'),
    connectButton = document.getElementById('connect'),
    disconnectButton = document.getElementById('disconnect'),
    hostField = document.getElementById('hostField'),
    handleField = document.getElementById('handleField'),
    hostSpan = document.getElementById('host'),
    handleSpan = document.getElementById('handle');

chrome.extension.sendRequest({name: 'status'}, function(response) {
  hostField.value = response.host || 'http://localhost:4000';
  handleField.value = response.handle || '123';

  hostSpan.innerText = response.host;
  handleSpan.innerText = response.handle;

  disconnectedTab.style.display = response.connected ? 'none' : 'block';
  connectedTab.style.display = response.connected ? 'block' : 'none';
});

connectButton.addEventListener('click', function() {
  chrome.extension.sendRequest({
    name: 'connect',
    host: hostField.value,
    handle: handleField.value
  });
  window.close();
});

disconnectButton.addEventListener('click', function() {
  chrome.extension.sendRequest({
    name: 'disconnect',
  });
  window.close();
});
