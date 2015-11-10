var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stateSchema = new Schema({
    tournament : String,
    currentWinnerRound : Number,
    currentLoserRound : Number
});

module.exports = mongoose.model('state', stateSchema);
