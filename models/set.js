var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var setSchema = new Schema({
    match: {type : Schema.ObjectId, ref: 'match'},
    started : Date,
    location : { type : Schema,ObjectId, ref : 'location'}
});

module.exports = mongoose.model('set', setSchema);
