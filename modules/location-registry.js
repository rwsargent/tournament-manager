var self = this;
var tournamentToLocation = {};
var locationToTournament = {};
function addToMap(map, key, value) {
    if(map[key]) {
	map[key] = [];
    }
    map[key].push(value);
}
function isEmpty(obj) {
    for(prop in obj) {
	return true;
    }
    return false;
}
module.exports = {
    init : function() {
	var config = require('../server-config.json');
	if(isEmpty(tournamentToLocation) && isEmpty(locationToTournament)) {
	    
	}
    },
    addLocationToTournament : function(tournamentName, location) {
	addToMap(tournamentToLocation, tournamentName, location);
	addToMap(locationToTournament, location, tournamentName);
    },
    getTournamentsForLocations : function(location) {
	return locationToTournament[location];
    }, 
    getLocationsForTournament : function(tournamentName) {
	return tournamentToLocation[tournamentName];
    },
    isValidLocationForTournament : function(tournamentName, location) {
	var associatedTournaments = locationToTournament[location];
	if (associatedTournaments) {
	    for(aIdx in associatedTournaments) {
		if(associatedTournaments[aIdx] === tournamentName) {
		    return true;
		}
	    }
	}
	return false;
    }
}
