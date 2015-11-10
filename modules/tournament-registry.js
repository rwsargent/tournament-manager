var config = require('../server-config.json');
var tournamentMap = {}
module.exports = {
    init : function() {
        var empty = true;
        for( var prop in tournamentMap) {
            empty = false;
            break;
        }
        if(empty) {
            for(tIdx in config.tournaments) {
                var tournament = config.tournaments[tIdx];
	            tournamentMap[tournament.name] = tournament;
            }
        }
    },
    getTournament : function(name) {
        return tournamentMap[name];
    },
    getTournamentNameList : function() {
        var tList = [];
        for(prop in tournamentMap) {
            tList.push(prop);
        }
        return tList;
    },
    addFinalRound : function(tournament, round) {
        tournamentMap[tournament].finalRound = round;
    },
    getFinalRound : function(tournament) {
        return tournamentMap[tournament].finalRound;
    }
}
