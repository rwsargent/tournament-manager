var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
    tournamentName : {type : String, index : true},
    challongeMatchId : {type :Number, index : true},
    player1Display : {type : String, default : "Unknown"},
    player2Display : {type : String, default : "Unknown"},
    player1Challonge : String,
    player2Challonge : String,
    challongeIdentifier : String,
    round: Number,
    state : String,
    started : Date,
    winnerId : Number,
    loserId : Number,
    prereqMatchIds : {type: String, default : ""}
});

module.exports = mongoose.model('match', matchSchema);
