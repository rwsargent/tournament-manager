var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/test1", function(err, success) {
    if (err) {
        console.log(err);
	throw err;
    } else {
        console.log("successfully connected to the database");
	connectionCB();
    }
});

var connectionCB = function() {
    var userSchema = new Schema({
	name: String,
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	admin: Boolean,
	location: String,
	meta: {
	    age: Number,
	    website: String
	},
	created_at: Date,
	updated_at: Date
    });

    var User = mongoose.model('User', userSchema);

    var chris = new User({
	name: 'Chris',
	username: 'sevilayha',
	password: 'password' 
    });


    // call the built-in save method to save to the database
    chris.save(function(err) {
	if (err) throw err;
	console.log('User saved successfully!');

    });
}
