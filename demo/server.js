var express = require("express");

var Twitter = require("../app/index.js").Twitter;

var app = express();

app.use(express.static("demo/static/"));
app.use(express.static("lib/"));

new Twitter(app, "Twitter app's Consumer Key", "Twitter app's Consumer Secret");

var server = app.listen(3000);
