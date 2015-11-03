var Location = require('../../models/location.js');
var Match =  require('../../models/match.js');
var Participant = require('../../models/participants.js');
var Set = require('../../models/set.js');
var serverState = require('../server-state.js');
var tournamentRegistry = require('../tournament-registry.js');

var saveHandeler = function(err) {
    if(err) console.log(err);
};

function makeSetWithLocation(match, matches) {
    Location.findOne(
	{ tournaments : {$in : [match.tournamentName]},
	  currentMatch : -1 },
	function(err, location) {
	    if(!err && location) {
		var setObject = Set({
		    match : match,
		    started : Date.now(),
		    location : location
		});
		setObject.save(function(err) {
		    if(!err) {
			location.currentMatch = match.challongeMatchId;
			location.save(function(err) {
			    if(!err) {
				makeSetPerTournament(matches.slice(1, matches.length));
			    } else { console.log(err);}
			});
			match.state = "matched";
			match.save(saveHandeler);
		    } else {
			console.log(err);
		    }
		});
	    } else if(!err && !location) {
		makeSetPerTournament(matches.slice(1, matches.length));
		return;
	    } else { // soemthing went wrong
		console.log(err);
	    }
	});
}

function makeSetPerTournament(matches) {
    if(matches.length) { // if there are more matches to make a set for
	var match = matches[0];
	// if there are any locations associated with this matches' tournament, find one
	if(tournamentRegistry.getTournament(match.tournamentName).locations.length) {
	    makeSetWithLocation(match, matches);
	} else {
	    // otherwise just change the matches status and save the set 
	    var setObject = Set({
		match : match,
		started : Date.now(),
		location : null
	    });
	    setObject.save(function(err) {
		if(!err) {
		    match.state = "matched";
		    match.save(function(err) {
			if(!err) {
			    makeSetPerTournament(matches.slice(1, matches.length));
			}
		    });
		}
	    });
	}
    }
}

module.exports = function() {
    Match.find( { "state" : "open"}, function(err, openMatches) {
	if(!err) {
	    makeSetPerTournament(openMatches);
	}
    });
};
