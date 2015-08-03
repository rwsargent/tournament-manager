var Queue = require("./../models/queue");
var challonge = require("./challonge.js");

var buildQueue = function() {
    // get all the matches from all the tournaments
    var matches = [];
    var matchIndexes = [];
    for(tourney in global.serverConfig.tournaments) {
        debugger;
        matches.push(challonge.matches.index(global.serverConfig.tournaments[tourney]));
        matchIndexes.push(0);
    }
    var round = 1, count = 0;
    for (match in matches) {
        count+=matches[match].length;
    }
    
    while (count) { // big loop to catch them all
        var roundFound = false;
        for(var tournamentIndex = 0; tournamentIndex < matches.length; tournamentIndex++) { //look at every tournament
            var match = matches[tournamentIndex][matchIndexes[tournamentIndex]].match;
            if (Math.abs(match.round) == round) {
                roundFound = true;
                var queueObject = Queue({
                    player1Display : match.player1 || "TBD",
                    player2Display : match.player2 || "TBD",
                    challongeMatchID : match.player
                });
                
                queueObject.save(function(err) {
                    if (err) throw err;
                });
                count--; // decrement to zero
                matchIndexes[tournamentIndex]++; // get the next match in this tournament
            }
        }
        if (!roundFound) { 
            round++; // increase the round if no matches were found. 
        }
    }
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
