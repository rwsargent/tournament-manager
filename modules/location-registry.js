var self = this;
var tournamentToLocation = {};
var locationToTournament = {};
function addToMap(map, key, value) {
    if(map[key]) {
	map[key] = [];
    }
    map[key].push(value);
}
module.exports = {
    addLocationToTournament : function(tournamentName, location) {
	addToMap(tournamentToLocation, tournamentName, location);
	addToMap(locationToTournament, location, tournamentName);
    },
    getTournamentsForLocations : function(location) {
	return locationToTournament[location];
    }, 
    getLocationsForTournament : function(tournamentName) {
	return tournamentToLocation[tournamentName];
    }
}
