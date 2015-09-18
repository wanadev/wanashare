"use strict";

var TwitterClient = require("twitter-node-client").Twitter;

var Twitter = function (app, prefix) {
    prefix = prefix || "/";

    app.get("/api/component/social-sharing/twitter/get-request-token", function (request, response) {
        // Get request token
        // return tokens to client
    });

    app.post("/api/component/social-sharing/twitter/ask-authorization/", function (request, response) {
        // [OPENED IN IFRAME]
        // Redirect to twitter authorization page with token
    });

    app.get("/api/component/social-sharing/twitter/authorized", function (request, response) {
        // Read GET params
        // Transforms request token to access token
        // return page with js that
        //   -> postMeassage to close iframe and return access tokens
    });

    app.POST("/api/component/social-sharing/twitter/share", function (request, response) {
        // ...
    });
};


module.exports = Twitter;
