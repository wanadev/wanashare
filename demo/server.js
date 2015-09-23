var express = require("express");
var wanashare = require("../app/index.js");

var app = express();

app.use(express.static("demo/static/"));
app.use(express.static("lib/"));

new wanashare.Twitter(app, "Twitter app's Consumer Key", "Twitter app's Consumer Secret");
new wanashare.Facebook(app, "Facebook app's ID", "Facebook app's Secret");

var server = app.listen(3000);
