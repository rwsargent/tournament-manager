var api = require('./api.js');

exports.index = function(tournamentID, params) { 
    return api.fetch_and_parse("GET", "tournaments/" + tournamentID + "/matches", params);
};

exports.show = function(tournamentID, matchID) { 
    return api.fetch_and_parse("GET", "tournaments/" + tournamentID + "/matches/" + matchID);
};

exports.update = function(tournamentID, matchID, params) { 
    api.fetch("PUT", "tournaments/" + tournamentID + "/matches/" + matchID, "match", params);
};



