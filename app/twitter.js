"use strict";

var TwitterClient = require("twitter-node-client").Twitter;

var Twitter = function (app, consumerKey, consumerSecret, prefix) {
    prefix = prefix || "/";

    app.get(prefix + "twitter/get-request-token", function (request, response) {
        // Get request token
        // return tokens to client

        var callbackUrl = request.protocol + "://" + request.get("host") + prefix + "twitter/authorized";

        var twitter = new TwitterClient({
            "consumerKey": consumerKey,
            "consumerSecret": consumerSecret,
            "callBackUrl": callbackUrl
        });
        twitter.getOAuthRequestToken(function (oauth) {
            response.json(oauth);
        });
    });

    app.get(prefix + "twitter/ask-authorization/:token", function (request, response) {
        // [OPENED IN IFRAME]
        // Redirect to twitter authorization page with token

        response.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + request.params.token);
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
