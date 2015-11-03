var Location = require('./../../models/location.js');
var Match =  require('./../../models/match.js');
var Participant = require('../../models/participants.js');
var serverState = require('./../server-state.js');
var challonge = require('./../../scripts/challonge/challonge.js');

var handleError = function(err) {
    console.log(err);    
};

var handleSave = function(err) {
    if(err) {
	    handleError(err);    
    }
};

module.exports = function() {
    var self = this;
    var findParticipantById = function(id) {
        for(var idx in self.participants) {
            var participant = self.participants[idx];
            if (participant.id === id) {
                return participant;
            }
        }
        return null;
    };

    var loadIfNotPresent = function(model, loadFunction) {
	    model.count({}, function(err, count) {
	        if(err) {
		        handleError(err);
	        } else if (count) {
		        console.log(model.collection.name + " is already populated.");
	        } else {
		        loadFunction();
	        }
	    });
    };

    self.loadLocationsIntoDatabase = function() {
	    var locationRegistry = require('../location-registry.js');
	    for( var lIdx in serverState.config.locations) {
	        var location = serverState.config.locations[lIdx];
	        var tourneys = locationRegistry.getTournamentsForLocations(location);
            var locationObject = Location({
                name: location,
                currentMatch : -1,
                tournaments : tourneys,
            });
            locationObject.save(handleSave);
	    }
    };
    
    self.loadMatchesIntoDatabase = function() {
	    for (var tourneyIdx in serverState.config.tournaments) {
	        var tournamentName = serverState.config.tournaments[tourneyIdx].name;
	        var matches = challonge.matches.index(tournamentName);
	        for (var matchIdx in matches) {
		        var match = matches[matchIdx].match;
		        var matchObject = Match( {
		            tournamentName : tournamentName,
		            challongeMatchId : match.id,
		            player1Challonge : match.player1_id,
		            player2Challonge : match.player2_id,
		            challongeIdentifier : match.identifier,
		            round : match.round,
		            state : match.state,
		            winnerId : match.winner_id,
		            loserId : match.loser_id,
		            prereqMatchIds : match.prerequisite_match_ids_csv
		        });
		        matchObject.save(handleSave);
	        }
	    }
    };

    self.loadParticipants = function() {
	    for(var tourneyIdx in serverState.config.tournaments) {
	        var tourney = serverState.config.tournaments[tourneyIdx];
	        self.participants = challonge.participants.index(tourney.name); // self as member variable
	        if (!self.participants.length) {
		        console.log(tourney.name + " doesn't have any participants yet!");
	        }
	        for(var partIdx in self.participants) {
		        var participant = self.participants[partIdx].participant;
		        var participantObject = Participant({
		            challongeId : participant.id,
		            name : participant.name,
		            tournamentName : tourney.name
		        });
		        participantObject.save(handleSave);
	        }
	    }
    };

    self.init = function() {
	    loadIfNotPresent(Participant, self.loadParticipants);
	    loadIfNotPresent(Match, self.loadMatchesIntoDatabase);
	    loadIfNotPresent(Location, self.loadLocationsIntoDatabase);
    };

    self.init();
    return self;
};
