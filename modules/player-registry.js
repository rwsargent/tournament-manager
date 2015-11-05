var challonge = require('../scripts/challonge/challonge.js');
var playerNameMap = {};
var serverConfig = require('../server-config.json');
module.exports = {
    init : function() {
	for(var tIdx in serverConfig.tournaments) {
	    var tournament = serverConfig.tournaments[tIdx];
	    participants = challonge.participants.index(tournament.name);
	    for( var pIdx in participants) {
		var participant = participants[pIdx].participant;
		playerNameMap[participant.id] = participant.name;
	    }
	}
    },
    getName : function(id) {
	return playerNameMap[id];
    }
};
