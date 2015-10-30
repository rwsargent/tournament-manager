var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
    name : String,
    currentMatch : Number,
    tournamentName : String
});

module.exports = mongoose.model('location', locationSchema);
