var self = this;
var tournamentToLocation = {};
var locationToTournament = {};
function addToMap(map, key, value) {
    if(!map[key]) {
	    map[key] = [];
    }
    map[key].push(value);
}
function isEmpty(obj) {
    for(prop in obj) {
	    return false;
    }
    return true;
}

function inArray(arr, obj) {
    for(arrIdx in arr) {
        if (arr[arrIdx] === obj) {
            return true;
        }
    }
    return false;
}

var addLocationToTournament = function(tournamentName, location) {
	addToMap(tournamentToLocation, tournamentName, location);
	addToMap(locationToTournament, location, tournamentName);
};

module.exports = {
    init : function() {
	    var config = require('../server-config.json');
	    if(isEmpty(tournamentToLocation) && isEmpty(locationToTournament)) {
	        for(tIdx in config.tournaments) {
                var tournament = config.tournaments[tIdx];
                for(lIdx in tournament.locations) {
                    var location = tournament.locations[lIdx];
                    if (inArray(config.locations, location)) {
                        addLocationToTournament(tournament.name, location);
                    } else {
                        throw("Broken config, tournament has a location that doesn't exist");
                    }
                }
            }
	    }
    },
    getTournamentsForLocations : function(location) {
	    return locationToTournament[location];
    }, 
    getLocationsForTournament : function(tournamentName) {
	    return tournamentToLocation[tournamentName];
    },
    isValidLocationForTournament : function(tournamentName, location) {
	    var associatedTournaments = locationToTournament[location];
	    if(associatedTournaments) {
	        for(aIdx in associatedTournaments) {
		        if(associatedTournaments[aIdx] === tournamentName) {
		            return true;
		        }
	        }
	    }
	    return false;
    }
}
