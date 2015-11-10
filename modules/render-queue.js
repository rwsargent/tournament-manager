var State = require('../models/state.js');
var Match = require('../models/match.js');
var handler = require('./handler.js');
module.exports = function(req, res) {
    var query = {};
    if(req.params.tournament) {
        query.tournament = req.params.tournament;
    }
    State.find(query, function(err, tourneyStates) {
        handler.handleError(err);
        var roundMap = {};
        for(var sIdx in tourneyStates) {
            var tournamentState = tourneyStates[sIdx];
            roundMap[tournamentState.name] = tournamentState.round;
        }
        var queries = [];
        for(var tournament in roundMap) {
            var round = roundMap[tournament];
            Match.find({
                tournament : tournament,
                round : { $lt : round},
                
            }).sort().limit(10);
        }
    });
}
