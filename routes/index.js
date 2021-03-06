var express = require('express');
var router = express.Router();
var challonge = require('../scripts/challonge/challonge.js');
var Queue = require('../models/queue.js');
var config = require('../server-config.json');
var Match = require('../models/match.js');
var Set = require('../models/set.js');
/* GET home page. */

function trimSets(sets) {
    var trimmed = [];
    for (var setsIdx in sets) {
	    var set = sets[setsIdx];
	    var prettySet = {
	        tournament : set.tournament,
	        match : set.match,
	        location : set.location ? set.location : "",
	        started : set.started
	    };
	    trimmed.push(prettySet);
    }
    return trimmed;
}
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

router.get('/matches', function(req, res, next) {
    var query = {};
    if (req.params.tournament) {
	    query.tournamentName = req.params.tournament;
    }
    Match.find(query,function(err, matches) {
	    res.json(matches);
    });
});

router.get('/matches/:tournament', function(req, res) {
    var query = {};
    if (req.params.tournament) {
	    query.tournamentName = req.params.tournament;
    }
    Match.find(query,function(err, matches) {
	    res.json(matches);
    });
});

router.get('/sets', function(req,res) {
    Set.count({}, function(err, count) {
	    if(err) {
	        console.log(err);
	        res.send(501);
	    } else {
	        if(count) {
		        Set.find({}, function(err, sets) {
		            res.json(trimSets(sets));
		        });
	        } else {
		        require('../modules/database/fill-sets.js')(function() {
		            Set.find({}, function(err, sets) {
			            res.json(trimSets(sets));
		            });
		        });
	        }
	    }
    });
});

router.get('/sets/:tournament', function(req,res) {
    query = { tournament : req.params.tournament };
    Set.find(query, function(err, sets) {
	    if(err) {
	        console.log(err);
	    }
	    if(!sets.length) {
	        require('../modules/database/fill-sets.js')(function() {
		        Set.find(query, function(err, sets) {
		            res.json(trimSets(sets));
		        });
	        });
	    } else {
	        Set.find(query, function(err, sets) {
		        res.json(trimSets(sets));
	        });
	    }
    });
});


router.get('/tournament/index', function(req, res) {
    var tournaments = {};
    for (var tIdx in global.serverConfig.tournaments) {
        var tourneyName = global.serverConfig.tournaments[tIdx];
        tournaments[tourneyName] = challonge.matches.index(tourneyName); // grabs the match list from challonge 
    }
    res.json(tournaments);
});

module.exports = router;
