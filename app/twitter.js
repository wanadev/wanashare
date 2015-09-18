"use strict";

var TwitterClient = require("twitter-node-client").Twitter;

var Twitter = function (app, consumerKey, consumerSecret, prefix) {
    prefix = prefix || "/";

    app.get(prefix + "twitter/get-request-token", function (request, response) {
        // Get request token
        // return tokens to client

        var twitter = new TwitterClient({
            "consumerKey": consumerKey,
            "consumerSecret": consumerSecret
        });
        twitter.getOAuthRequestToken(function (oauth) {
            response.json(oauth);
        });
    });

    app.post(prefix + "twitter/ask-authorization/", function (request, response) {
        // [OPENED IN IFRAME]
        // Redirect to twitter authorization page with token
    });

    app.get(prefix + "twitter/authorized", function (request, response) {
        // Read GET params
        // Transforms request token to access token
        // return page with js that
        //   -> postMeassage to close iframe and return access tokens
    });

    app.post(prefix + "twitter/share", function (request, response) {
        // ...
    });
};


module.exports = Twitter;
