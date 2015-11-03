var Location = require('../../models/location.js');
var Match =  require('../../models/match.js');
var Participant = require('../../models/participants.js');
var Set = require('../../models/set.js');
var serverState = require('../server-state.js');
var tournamentRegistry = require('../tournament-registry.js');

var saveHandeler = function(err) {
    if(err) console.log(err);
}

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
                        match.status = "matched"
                        match.save(saveHandeler);
		            } else {
			            console.log(err);
		            }
		        });
	        } else if(!err && !location) {
                // there are no available locations for this tournament
		        return;
	        } else { // soemthing went wrong
		        console.log(err);
	        }    
        });
}

function makeSetPerTournament(matches) {
    if(matches.length) { // if there are more matches to make a set for
	    var match = matches[0];
        if(tournamentRegistry.getTournament(match.tournamentName).locations) {
            makeSetWithLocation(match, matches);
        } else {
            var setObject = Set({
                match : match,
                started : Date.now(),
                location : ""
            });
            setObject.save(function(err) {
                if(!err) {
                    makeSetPerTournament(matches);
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
}
