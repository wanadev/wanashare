var express = require("express");

var Twitter = require("../app/index.js").Twitter;

var app = express();

app.use(express.static("demo/static/"));
app.use(express.static("lib/"));

new Twitter(
    app,
    "2jPLtdqHs2LrXyViR7284ifXI", // FIXME
    "Yuep9X7JystkC4QRUt6sYdzTGk0lROuFrrcVQ2MDSVT0LIMdR6", // FIXME
    "/api/"
);

var server = app.listen(3000);
