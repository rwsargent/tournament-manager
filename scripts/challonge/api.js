var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var encoder = require('urlencode');
var S = require('string');
var config = require('./../../modules/configuration.js');

var credentials = {
    'user' : config.challonge_user,// 'rwsargentTest',
    'api_key' : config.challonge_apikey//'pKHvsX1X8I14f1NDCyTD26jHmKrUuEavVUKcTWOs'
};

exports.setCredentials = function(username, api_key) { 
    credentials["user"] = username;
    credentials["api_key"] = api_key;
};

var getCredentials = function() { 
    return credentials;
};


exports.fetch = function(method, uri, params_prefix, params) { 
    // make params url-ified
    params_prefix = params_prefix || null;
    var urlParams = "";
    if (typeof params !== 'undefined') { 
	    urlParams = "?" + paramify(params_prefix, params);
    }
    var url = "https://api.challonge.com/v1/" + uri + ".json";
    if (method === "GET") {
	    url = url +"?"+ urlParams;
    }
    var xmlhttpreq = new XMLHttpRequest();
    xmlhttpreq.responseType = "json";
    xmlhttpreq.open(method, url, false, credentials["user"], credentials["api_key"]);
    try { 
	    if (method === "GET") { 
	        xmlhttpreq.send();
	    } else { 
	        xmlhttpreq.send(paramString);
	    }
    } catch (err) { 
	    console.log("We got an error");
	    console.log(err);
    }
    return xmlhttpreq.responseText;
};

exports.fetch_and_parse = function(method, uri, params_prefix, params)  { 
    response = exports.fetch(method, uri, params_prefix, params);
    return JSON.parse(response);
};

var paramify = function (dirty_params, prefix) {
    //tournament[tournament_type]=double+elimination&tournament[url]=test9url&tournament[name]=test8
    //tournament%5Btournament_type%5D=double+elimination&tournament%5Burl%5D=test9url&tournament%5Bname%5D=test8
    var paramString = "";
    for (key in dirty_params) {
	    var param = dirty_params[key]
	    if (prefix) { 
	        paramString += prefix + "[" + param[0] + "]" + "=" + param[1]; // tournament[type]=value
	    } else { 
	        paramString += param[0] + "=" + param[1]; //tournament=value;
	    }
	    paramString += " "; // adds a space
    }
    return encodeURIComponent(S(paramString).chompRight(" ").s); // chop off last space.
};
