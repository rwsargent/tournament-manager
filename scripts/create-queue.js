var Queue = require("./../models/queue");
var challonge = require("./challonge.js");

var buildQueue = function() {
    // get all the matches from all the tournaments
    var tournaments = [];
    var roundMap = [];
    for(tourneyIdx in global.serverConfig.tournaments) {
        tournaments.push(challonge.matches.index(global.serverConfig.tournaments[tourneyIdx])); // grabs the match list from challonge
    }

    var finished = false, matchIndex = 0;
    
    while(!finished) {
	finished = true;
        for(var tournamentIndex = 0; tournamentIndex < tournaments.length; tournamentIndex++) { //look at every tournament
	    var match = tournaments[tournamentIndex][matchIndex];
	    if (!match) {
		continue;
	    } else {
		match = match.match
	    }
	    finished = false;
	    var round = Math.abs(match.round);
	    if (!roundMap[round]) {
		roundMap[round] = [];
	    }
	    roundMap[round].push(match);
	}
	matchIndex++;
    }
    // chop off zeroth element of roundMap
    roundMap.splice(0, 1);

    var order = 1, queue = [];
    for (roundIdx in roundMap) {
	roundMap[roundIdx].sort(function(left, right) {
	    return right.round - left.round;
	});
 	for(matchIdx in roundMap[roundIdx]) {
	    match = roundMap[roundIdx][matchIdx];
	    var queueObject = Queue( {
                player1Display : match.player1 || "TBD",
                player2Display : match.player2 || "TBD",
                challongeMatchID : match.id,
		challongeIdentifier : match.identifier,
		order : order++
	    });
	    queue.push(queueObject);
	}
    }

    for (queueIdx in queue) {
    	model = queue[queueIdx];
    	model.save(function(err) {
    	    if (err) {
		throw err;
    	    } else {
		console.log("Saved successfully");
	    }
    	})
    }

    /*
    Queue.collection.insert(queue, {}, function(err) {
	if(err) throw err;
	else {
	    console.log("Done building Queue");
	}
    }*/
}

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
