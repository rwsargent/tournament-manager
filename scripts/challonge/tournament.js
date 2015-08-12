var api = require('./api.js');

exports.index = function(params) { 
    return api.fetch_and_parse("GET", "tournaments", undefined, params);
};

exports.create = function(name, uri, tournament_type, params) { 
    _tournament_type = tournament_type || "double elimination";
    params.name = name;
    params.url = uri;
    params.tournament_type = tournament_type;

    return api.fetch_and_parse("POST", "tournaments","tournament", params);
};

exports.show = function(tournamentID) { 
    return api.fetch_and_parse("GET", tString(tournamentID));
};

exports.update = function(tournamentID, params) { 
    api.fetch("PUT", tString(tournamentID), "tournament", params) 
}

exports.destroy = function(tournamentID) { 
    api.fetch("DELETE", tString(tournamentID));
};

exports.publish = function(tournamentID) { 
    api.fetch("POST", tString(tournamentID));
};

exports.start = function(tournamentID) { 
    api.fetch("POST", "tournaments/start/" + tournamentID);
};

exports.reset = function(tournamentID) { 
    api.fetch("POST", "tournaments/reset/" + tournament);
};

exports.tString = function (tournamentID) {  
    return "tournaments/" + tournamentID;
};
