var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var participantSchema = new Schema({
    phoneNumber : String,
    playerHandle : String,
    realName : String
    challongeParticipantID : String
});
