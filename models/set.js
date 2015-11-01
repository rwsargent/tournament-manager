var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var setSchema = new Schema({
    match: {type : Schema.ObjectId, ref: 'match'},
    location : String
});

module.exports = mongoose.model('set', setSchema);
