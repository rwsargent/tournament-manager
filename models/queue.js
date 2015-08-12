var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var queueSchema = new Schema({
    player1Display : String,
    player2Display : String,
    player1Challonge : String,
    player2Challonge : String,
    challongeMatchID : Number,
    challongeIdentifier : String,
    order: Number
});

module.exports = mongoose.model('queue', queueSchema);
