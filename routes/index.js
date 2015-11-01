var express = require('express');
var router = express.Router();
var challonge = require('../scripts/challonge/challonge.js');
var Queue = require('../models/queue.js');
var config = require('../server-config.json');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', author: 'Ryan and Ben ROCKS' });
});

router.get('/:event/:tournament/matches', function(req, res) {
    var test = {
        event : req.params.event,
        tournament : req.params.tournament
    };
    res.json(test);
});

router.get('/:tournament', function(req, res) {
    var test = {
         tournament : req.params.tournament
    };
    res.json(test);
});

router.get('/matches/:tournament', function(req, res) {
    var matches = challonge.matches.index(req.params.tournament);
    if(!matches.length) {
	res.render('error', {});
    }
    var trimmedMatches = [];
    for (matchIdx in matches) {
	    var match = matches[matchIdx].match;
	    var trimmedMatch = { 
	        id : match.id,
	        round: match.round,
	        player1_id: match.player1_id,
	        player2_id: match.player2_id,
	        identifier : match.identifier,
		state : match.state
	    };
	    trimmedMatches.push(trimmedMatch);
    }
    res.json(trimmedMatches);
});

router.get('/queue', function(req, res) {
    var q = Queue.find({}).sort({order : 1 }).exec( function(err, queue) {
        if (err) throw err;
        res.json(queue);
    });
});

router.get('/tournament/index', function(req, res) {
    var tournaments = {}
    for (tIdx in global.serverConfig.tournaments) {
        var tourneyName = global.serverConfig.tournaments[tIdx];
        tournaments[tourneyName] = challonge.matches.index(tourneyName); // grabs the match list from challonge 
    }
    res.json(tournaments);
});

module.exports = router;
