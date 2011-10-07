(function() {
  var servers = [];

  $(".serverguide-bodycells > div > span > a").each(
    function(index) {
      servers.push($(this).attr('href'));
    }); 
  
  
  var orig = gamemanager.handleErrors;
  var currentServer;

  var tryToJoin = function(s) {
    $.get('http://battlelog.battlefield.com' + s + '/?json=1&join=true', {},
      function(response) {
        if (response['type'] === 'success') {
          joinflow._joinServer(response.data, null);
        } else {
          servers.push(s);
          currentServer = servers.shift();
          tryToJoin(currentServer);
        }
     });
  };

  var newErrorHandle = function (game,personaId,errorType,errorCode) {
    console.log('Error joining trying next server');
    servers.push(currentServer);
    currentServer = servers.shift();
    tryToJoin(currentServer);
    orig(game,personaId,errorType,errorCode);
  };

  gamemanager.handleErrors = newErrorHandle;
  currentServer = servers.shift();
  tryToJoin(currentServer);

})();