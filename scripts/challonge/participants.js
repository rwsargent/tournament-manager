var api = require('./api.js');

exports.index = function(tournamentID) { 
    return api.fetch_and_parse("GET", "tournaments/" + tournamentID + "/participants");
};

exports.create = function(tournament, name, params) { 
    // add name to params
    return api.fetch_and_parse("POST", "tournaments/" + tournament + "/participant", params);
};

exports.show = function(tournamentID, participantID, params) { 
    return api.fetch_and_parse("GET", "tournaments/" + tournamentID + "/participants/ " + participantID, "participant", params);
};

exports.update = function(tournamentID, participantID, params) { 
    api.fetch("PUT", "tournaments/" + tournamentID + "/participants/" + participantID, "participant", params);
};

exports.destroy = function(tournamentID, participantID ) {
    api.fetch("DELETE", "tournaments/" + tournamentID + "/participants/" + participantID);
};

exports.randomize = function(tournamentID ) { 
    api.fetch("POST", "tournaments/" + tournamentID + "/participants/randomize");    
};
