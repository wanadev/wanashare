"use strict";

var TwitterClient = require("twitter-node-client").Twitter;
var Busboy = require("busboy");
var MemoryStream = require("memory-stream");

var helpers = require("./helpers.js");

var Twitter = function (app, consumerKey, consumerSecret, prefix) {
    prefix = prefix || "/wanashare/";

    /*
     * Get request token
     */
    app.get(prefix + "twitter/get-request-token", function (request, response) {
        var callbackUrl = request.protocol + "://" + request.get("host") + prefix + "twitter/authorized";

        var twitter = new TwitterClient({
            consumerKey: consumerKey,
            consumerSecret: consumerSecret,
            callBackUrl: callbackUrl
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
            consumerKey: consumerKey,
            consumerSecret: consumerSecret
        });
        twitter.getOAuthAccessToken({
            token: request.params.requestToken,
            token_secret: request.params.requestTokenSecret,
            verifier: request.params.oauthVerifier
        }, function (oauth) {
            response.json(oauth);
        });
    });

    /*
     * Post medias on twitter
     */
    app.post(prefix + "twitter/share/:accessToken/:accessTokenSecret", function (request, response) {
        var twitter = new TwitterClient({
            consumerKey: consumerKey,
            consumerSecret: consumerSecret,
            accessToken: request.params.accessToken,
            accessTokenSecret: request.params.accessTokenSecret
        });

        var message;
        var media;

        var busboy = new Busboy({headers: request.headers});
        busboy.on("field", function (fieldname, value) {
            if (fieldname == "message") {
                message = value;
            }
        });
        busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
            if (!mimetype.match(/^image\/.*$/)) {
                response.sendStatus(415);
                return;
            }
            media = new MemoryStream();
            file.pipe(media);
        });
        busboy.on("finish", function () {
            if (message && media) {
                response.json({});
            } else {
                response.sendStatus(400);
            }
        });
        request.pipe(busboy);
    });
};

module.exports = Twitter;
