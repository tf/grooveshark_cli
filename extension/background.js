/*global chrome, Session, console*/

var sessions = {};

function showPageActionForValidURL(tabId, changeInfo, tab) {
  if (tab.url.indexOf('grooveshark.com') > -1) {
    chrome.pageAction.show(tabId);
  }
}

chrome.tabs.onUpdated.addListener(showPageActionForValidURL);

function ensureSession(tab, callback) {
  var session = sessions[tab.id];

  if (session) {
    callback(session);
  }
  else {
    chrome.tabs.executeScript(tab.id, {file: 'content_script.js'}, function() {
      var port = chrome.tabs.connect(tab.id),
          session = new Session(tab, port);
      sessions[tab.id] = session;

      port.onDisconnect.addListener(function() {
        console.log('Closing session for ' + tab.id);
        session.disconnect(true);
        sessions[tab.id] = null;
      }.bind(this));

      console.log('Created session for tab ' + tab.id);
      callback(session);
    });
  }
}

function onError(text) {
  window.alert('Grooveshark CLI Error: ' + text);
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  chrome.tabs.getSelected(null, function(tab) {
    var session = sessions[tab.id];

    if (request.name === 'status') {
      console.log('Status request from tab ' + tab.id);
      sendResponse({
        connected: session && session.connected(),
        host: session && session.host,
        handle: session && session.handle
      });
    }
    else if (request.name === 'connect') {
      console.log('Connect request from tab ' + tab.id);

      ensureSession(tab, function(session) {
        session.connect(request.host, request.handle);
      });
    }
    else if (request.name === 'disconnect') {
      console.log('Disconnect request from tab ' + tab.id);

      if (session) {
        session.disconnect();
      }
    }
  });
});