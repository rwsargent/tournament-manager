var Location = require('./../../models/location.js');
var Match = require('./../../models/match.js');

Location.find({}, function(err, results) {
    if (err) {
        console.log(err);
    } else {
        if (results.length == 0 ){
            loadLocationsIntoDatabase();
        }
    }
});

function loadLocationsIntoDatabase() {
    for (locationIdx in global.serverConfig.locations) {
        var location = global.serverConfig.locations[locationIdx];
        var locationObject = Location( {
            name: location,
            currentMatch : -1
        });
        locationObject.save(function(err) {
            if (err) console.log(err);
        });
    }
}

function loadMatchesIntoDatabase() {
    var tournaments = [];
    for (tourneyIdx in global.serverCongfig.tournaments) {
        var tourneyName = global.serverCongfig.tournaments[tourneyIdx];
        var matches = challonge.matches.index(tourneyName);
        for (matchIdx in matches) {
            var match = matches[matchIdx];
        }
    }
    return tournaments;
}
