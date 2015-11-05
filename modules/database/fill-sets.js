var Location = require('../../models/location.js');
var Match =  require('../../models/match.js');
var Participant = require('../../models/participants.js');
var Set = require('../../models/set.js');
var serverState = require('../server-state.js');
var tournamentRegistry = require('../tournament-registry.js');
var playerRegistry = require('../player-registry.js');

var saveHandeler = function(err) {
    if(err) console.log(err);
};
var callback;
function trimMatch(matchList, index) {
    var match = matchList[index];
    match = match.slice(1, match.length);
    matchList[index] = match;
}

function makeSetWithLocation(match, matchList, index) {
    Location.findOne(
	{ tournaments : {$in : [match.tournamentName]},
	  currentMatch : -1 },
	function(err, location) {
	    if(!err && location) {
		var setObject = Set({
		    match : {
			mongoid : match._id,
			identifier : match.challongeIdentifier,
			player1 : match.player1Display,
			player2 : match.player2Display
		    },
		    started : Date.now(),
		    location : location.name
		});
		setObject.save(function(err) {
		    if(!err) {
			location.currentMatch = match.challongeMatchId;
			location.save(function(err) {
			    if(!err) {
				makeSetPerTournament(matchList, index);
			    } else { console.log(err);}
			});
			match.state = "matched";
			match.save(saveHandeler);
		    } else {
			console.log(err);
		    }
		});
	    } else if(!err && !location) {
		makeSetPerTournament(matchList, index);
		return;
	    } else { // soemthing went wrong
		console.log(err);
	    }
	});
}

function makeSetPerTournament(matchList, index) {
    var remaining = 0;
    for(var mIdx in matchList) {
	remaining = remaining | matchList[mIdx].length;
    }
    if(remaining) { // if there are more matches to make a set for
	var match;
	var i = index;
	do {
	    match = matchList[i][0];
	    i = (i+1) % matchList.length;
	}
	while(!match);
	trimMatch(matchList, index);
	index = (index+1) % matchList.length; // keep it in bounds
	// if there are any locations associated with this matches' tournament, find one
	if(tournamentRegistry.getTournament(match.tournamentName).locations.length) {
	    makeSetWithLocation(match, matchList, index);
	} else {
	    // otherwise just change the matches status and save the set 
	    var setObject = Set({
		match : {
		    _id : match._id,
		    identifier : match.challongeIdentifier,
		    player1 : match.player1Display,
		    player2 : match.player2Display
		},
		started : Date.now(),
		location : "BYOC"
	    });
	    setObject.save(function(err) {
		if(!err) {
		    match.state = "matched";
		    match.save(function(err) {
			if(err) {
			    console.log(err);
			    console.log("Match: " + match.challongeIdentifier);
			}
			makeSetPerTournament(matchList, index);
		    });
		} else {
		    console.log(err);
		}
	    });
	}
    } else {
	if(callback) {
	    callback();
	}
    }
}

module.exports = function(cb) {
    callback = cb;
    Match.find( { "state" : "open"}, function(err, openMatches) {
	if(!err) {
	    var tournamentToMatchMap = {};
	    for(var mIdx in openMatches) {
		var match = openMatches[mIdx];
		var matchList = tournamentToMatchMap[match.tournamentName];
		if(!tournamentToMatchMap[match.tournamentName]){
		     tournamentToMatchMap[match.tournamentName] = [];
		}
		tournamentToMatchMap[match.tournamentName].push(match);
	    }
	    tournamentMatchList = [];
	    for(var prop in tournamentToMatchMap) {
		tournamentMatchList.push(tournamentToMatchMap[prop]);
	    }
	    makeSetPerTournament(tournamentMatchList, 0);
	} else {
	    console.log(err);
	}
    });
};
