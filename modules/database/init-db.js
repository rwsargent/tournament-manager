var Location = require('./../../models/location.js');
var Match =  require('./../../models/match.js');
var Participant = require('/../../models/participant.js');
var serverState = require('./../server-state.js');
var challonge = require('./../../scripts/challonge/challonge.js');

var handleSave = function(err) {
    if(err) console.log(err);
}

module.exports = function() {
    var self = this;
    var findParticipantById = function(id) {
        for(idx in self.participants) {
            var participant = self.participants[idx];
            if (participant.id === id) {
                return participant;
            }
        }
        return null;
    };
    
    self.mapTournamentNameToID = function() {
        for(tournamentIdx in serverState.config.tournaments) {
            var tournament = serverState.config.tournament[tournamentIdx];
            var challongeTournament = challonge.tournaments.index(tournament.name)[0].tournament;
            tournament.id = challongeTournament.id;
        }
    };
    
    self.loadLocationsIntoDatabase() = function() {
        for(tournamentIdx in serverState.config.tournaments) {
            var tournament = serverState.config.tournament[tournamentIdx];
            for(locationIdx in tournament.locations) {
                var location = tournament.locations[locationIdx];
                var locationObject = Location( {
                    name: location,
                    currentMatch : -1
                    tournamentName : tournament.name;
                    tournamentId = tournament.id;
                });
                locationObject.save(handleSave);
            }
        }
    };
    
    self.loadMatchesIntoDatabase() = function() {
        for (tourneyIdx in serverState.config.tournaments) {
            var tourneyId = serverState.config.tournaments[tourneyIdx].id;
            var matches = challonge.matches.index(tourneyId);
            for (matchIdx in matches) {
                var match = matches[matchIdx].match;
                var matchObject = Match( {
                    player1 
                });
            }
        }
        return tournaments;
    };

    self.loadParticipants() {
        for(tourneyIdx in serverState.config.tournaments) {
            var tourney = serverState.config.tournaments[tourneyIdx];
            self.participants = challonge.participants.index(tourney.name); // safe as member variable
            for(partIdx in participants) {
                var participant = participants[partIdx].participant;
                var participantOjbect = Participant({
                    challongeId : participant.id,
                    name : participant.name,
                    tournamentName : tourney.name
                });
                participant.save(handleSave);
            }
        }
    }

    self.init = function() {
        self.mapTournamentNameToID();
        self.loadLocationsIntoDatabase();
        self.loadParticipants();
        self.loadMatchesIntoDatabase();
    };
    
    Match.find({}, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            if (results.length === 0 ){
                self.init();
            }
        }
    });
}
