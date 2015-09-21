"use strict";

var TwitterClient = require("twitter-node-client").Twitter;

var helpers = require("./helpers.js");

var Twitter = function (app, consumerKey, consumerSecret, prefix) {
    prefix = prefix || "/wanashare/";

    /*
     * Get request token
     */
    app.get(prefix + "twitter/get-request-token", function (request, response) {
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

    /*
     * Redirect to twiter auth page
     */
    app.get(prefix + "twitter/ask-authorization/:token", function (request, response) {
        response.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + request.params.token);
    });

    /*
     * Post-authorization page
     */
    app.get(prefix + "twitter/authorized", function (request, response) {
        response.send(helpers.genCallbackPage({
            oauth_token: request.query.oauth_token,
            oauth_verifier: request.query.oauth_verifier
        }));
    });

    /*
     * Get access token
     */
    app.get(prefix + "twitter/get-access-token/:requestToken/:requestTokenSecret/:oauthVerifier", function (request, response) {
        // Transforms request token to access token
        var twitter = new TwitterClient({
            "consumerKey": consumerKey,
            "consumerSecret": consumerSecret
        });
        twitter.getOAuthAccessToken({
            token: request.params.requestToken,
            token_secret: request.params.requestTokenSecret,
            verifier: request.params.oauthVerifier
        }, function (oauth) {
            response.json(oauth);
        });
    });

    app.post(prefix + "twitter/share", function (request, response) {
        // ...
    });
};

module.exports = Twitter;
