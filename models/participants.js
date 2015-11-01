var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var participantSchema = new Schema({
    challongeId : Number,
    name: String,
    tournamentName : String
});

module.exports = mongoose.model('participant', participantSchema);
