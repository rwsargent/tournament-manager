module.exports = function(username, api_key, t_name) {
    var challonge = require('./challonge.js');
    challonge.api.setCredentials(username, api_key);
    var tournaments = challonge.tournament.index();
    var test8 = null;
    for(var i = 0; i < tournaments.length; i++) { 
	    if (tournaments[i].tournament["name"] === t_name) { 
	        test8 = tournaments[i];
	    }
    }
};
