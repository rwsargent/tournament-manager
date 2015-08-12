var Queue = require("./../../models/queue");
var challonge = require("./../challonge/challonge.js");

var buildQueue = function() {
    // get all the matches from all the tournaments
    var tournaments = [];
    var participants = [];
    var roundMapWinner = [], roundMapLoser = [];
    for(tourneyIdx in global.serverConfig.tournaments) {
        var tourneyName = global.serverConfig.tournaments[tourneyIdx];
	var tournament = challonge.matches.index(tourneyName);
	var tournamentId = tournament[0].tournament_id;
        tournaments.push(tournament); // grabs the match list from challonge
	var participant = challonge.participants.index(tournamentId); 
        participants.push(); // grabs all participants 
    }

    var finished = false, matchIndex = 0;
    
    while(!finished) {
	    finished = true;
        for(var tournamentIndex = 0; tournamentIndex < tournaments.length; tournamentIndex++) { //look at every tournament
	        var match = tournaments[tournamentIndex][matchIndex];
	        if (!match) {
		        continue;
	        }
	        match = match.match
	        finished = false;
            var round = match.round;
            var map = roundMapWinner;
            if (round < 0 ) { // if we are getting a negative round, then we know it's a loser's bracket
	            round = Math.abs(match.round);
                map = roundMapLoser;
            }
	        if (!map[round]) {
		        map[round] = [];
	        }
	        map[round].push(match);
	    }
	    matchIndex++;
    }
    // chop off zeroth element of the maps
    roundMapWinner.splice(0, 1);
    roundMapLoser.splice(0, 1);

    var queue = [];
    // do all the winner/loser matches up to winners semi
    var roundIndex = 0;
    for (roundIndex = 0; roundIndex < roundMapWinner.length-1; roundIndex++) {
        addToQueue(roundMapWinner, roundIndex, queue);
        addToQueue(roundMapLoser, roundIndex, queue);
    }
    
    // finish out loser bracket
    for( ;roundIndex < roundMapLoser.length; roundIndex++) {
        addToQueue(roundMapLoser, roundIndex, queue);
    }

    // finish out winner bracket
    addToQueue(roundMapWinner, roundMapWinner.length -1, queue);
    
    for (queueIdx in queue) {
    	model = queue[queueIdx];
    	model.save(function(err) {
    	    if (err) {
		        throw err;
    	    } else {
		        console.log("Queue object created and saved");
	        }
    	})
    }
}

var addToQueue = function(roundMap, roundIdx, queue) {
    for(matchIdx in roundMap[roundIdx]) {
	    match = roundMap[roundIdx][matchIdx];
        queueObject = createQueueObject(match, queue.length + 1);
	    queue.push(queueObject);
    }
};

var createQueueObject = function(match, order) {
    var p1display = challonge.participants.show(match.tournament_id, match.player1_id).participant;
    var p2display = challonge.participants.show(match.tournament_id, match.player2_id).participant;
    p1display = p1display ? p1display.name : "TBD"
    p2display = p2display ? p2display.name : "TBD"
    var queueObject = Queue( {
        player1Display : p1display,
        player2Display : p2display,
        challongeMatchID : match.id,
	    challongeIdentifier : match.identifier,
	    order : order
    });
    return queueObject;
};


module.exports = function() {
    Queue.find({}, function(err, queue) {
        if(err) throw err;
        if (queue.length == 0) { // break if the queue is made
            console.log("No queue, constructing a new one");
            buildQueue();
        } else {
            console.log( "Queue in progress");
        }
    }); 
}
