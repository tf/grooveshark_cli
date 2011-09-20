var grooveshark = {
  playPause: function(){
    document.getElementById('player_play_pause').click();
  },

  next: function(){
    document.getElementById('player_next').click();
  },

  previous: function(){
    document.getElementById('player_previous').click();
  },

  setVolume: function(value){
    var vol = document.createElement('script');
    vol.innerHTML = 'GS.player.player.setVolume(' + value + ');';
    document.body.appendChild(vol);
  }
};

var port;

port = chrome.extension.connect();

port.onMessage.addListener(function(msg) {
  grooveshark[msg.method].apply(grooveshark, msg.args);
});
