"use strict";

var FacebookClient = require("facebook-node-sdk");

var helpers = require("./helpers.js");

var Facebook = function (app, appId, appSecret, prefix) {
    prefix = prefix || "/wanashare/";

    /*
     * Blank page
     */
    app.get(prefix + "facebook/blank", function (request, response) {
        response.send(helpers.genCallbackPage(null, "#E9EAED", "#4D68A1"));
    });

    /*
     * Redirect to facebook auth page
     */
    app.get(prefix + "facebook/ask-authorization", function (request, response) {
        var callbackUrl = request.protocol + "://" + request.get("host") + prefix + "facebook/authorized";
        response.redirect("https://www.facebook.com/dialog/oauth?client_id=" + appId + "&redirect_uri=" + callbackUrl + "&scope=publish_actions");
    });

    /*
     * Post-authorization page
     */
    app.get(prefix + "facebook/authorized", function (request, response) {
        response.send(helpers.genCallbackPage({
            code: request.query.code,
            error: request.query.error_reason
        }, "#E9EAED", "#4D68A1"));
    });

    /*
     * Get access token
     */
    app.get(prefix + "facebook/get-access-token/:code", function (request, response) {
        var callbackUrl = request.protocol + "://" + request.get("host") + prefix + "facebook/authorized";
        var fb = new FacebookClient({appId: appId, secret: appSecret});
        fb.getAccessTokenFromCode(request.params.code, callbackUrl, function (error, accessToken) {
            if (error) {
                response.sendStatus(500);
            } else {
                response.json({accessToken: accessToken});
            }
        });
    });
};

module.exports = Facebook;
