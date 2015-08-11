var express = require('express');
var router = express.Router();
var challonge = require('../scripts/challonge.js');
var Queue = require('../models/queue.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/matches', function(req, res) {
    var matches = challonge.matches.index(global.serverConfig.tournaments[0]);
    var trimmedMatches = [];
    for (matchIdx in matches) {
	var match = matches[matchIdx].match;
	var trimmedMatch = { 
	    id : match.id,
	    round: match.round,
	    player1_id: match.player1_id,
	    player2_id: match.player2_id,
	    identifier : match.identifier
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

module.exports = router;
