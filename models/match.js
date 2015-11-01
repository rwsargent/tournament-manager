var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
    player1 : Object
    player1Display : String,
    player2Display : String,
    player1Challonge : String,
    player2Challonge : String,
    challongeMatchID : Number,
    challongeIdentifier : String,
    round: Number
});

module.exports = mongoose.model('match', matchSchema);
