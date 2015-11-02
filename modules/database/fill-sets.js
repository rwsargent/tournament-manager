var Location = require('../../models/location.js');
var Match =  require('../../models/match.js');
var Participant = require('../../models/participants.js');
var Set = require('../../models/set.js');
var serverState = require('../server-state.js');


function makeSetPerTournament(matches) {
    if(matches.length) {
	var match = matches[0];
	if(serverState
	Location.findOne({ tournamentName : match.tournamentName,
			   currentMatch : null }, 
	function(err, location){ 
	    if(!err && location) {
		var setObject = Set({
		    match : match,
		    started : Date.now(),
		    location : location
		});
		setObject.save(function(err) {
		    if(!err) {
			makeSetPerTournament(matches.slice(1, matches.length));
		    } else {
			console.log(err);
		    }
		});
		location.currentMatch = match.challongeMatchId;
		location.save(function(err) { if(err) console.log(err);});
	    } else if(!err && !location) {
		// 
		return;
	    } else { // soemthing went wrong
		console.log(err);
	    }
	});
    }
}

module.exports = function() {
    Match.find( { "state" : "open"}, function(err, openMatches) {
	if(!err) {
	    makeSetPerTournament(openMatches);
	}
    });
}
