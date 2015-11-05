var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var setSchema = new Schema({
    tournament : String,
    match: {
	mongoid : Schema.ObjectId,
	identifier : String,
	player1 : String,
	player2 : String
    },
    started : Date,
    location : String
});

module.exports = mongoose.model('set', setSchema);
