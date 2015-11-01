var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var participantSchema = new Schema({
    challongeId : {type : Number, index : true},
    name: String,
    tournamentName : String,
    phoneNumber : { type: String, default: ""}
});

module.exports = mongoose.model('participant', participantSchema);
