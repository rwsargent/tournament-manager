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
    res.json(matches);
});

router.get('/queue', function(req, res) {
    var q = Queue.find({}).sort({order : 1 }).exec( function(err, queue) {
        if (err) throw err;
        res.json(queue);
    });
});

module.exports = router;
