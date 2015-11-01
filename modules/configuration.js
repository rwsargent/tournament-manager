var config;
if(!config) {
    var fs = require('fs'),
        path = require('path');
    var config_string = fs.readFileSync(path.join(__dirname + "/../", 'server-config.json'));
    config = JSON.parse(config_string);
}

module.exports = config;
