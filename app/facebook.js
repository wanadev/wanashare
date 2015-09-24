"use strict";

require("magic-globals");
var FacebookClient = require("facebook-node-sdk");
var Busboy = require("busboy");
var MemoryStream = require("memory-stream");

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
                console.error("["+__filename+":"+__line+"]", error);
                response.sendStatus(500);
            } else {
                fb.setAccessToken(accessToken);
                fb.getUser(function (error, userId) {
                    if (error) {
                        console.error("["+__filename+":"+__line+"]", error);
                        response.sendStatus(500);
                    } else {
                        response.json({accessToken: accessToken, userId: userId});
                    }
                });
            }
        });
    });

    /*
     * Post medias on facebook
     */
    app.post(prefix + "facebook/share/:userId/:accessToken", function (request, response) {
        var fb = new FacebookClient({appId: appId, secret: appSecret, fileUpload: true});
        fb.setAccessToken(request.params.accessToken);

        var message;
        var media;
        var mediaMime;
        var mediaName;

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
            mediaMime = mimetype;
            mediaName = filename;
            file.pipe(media);
        });
        busboy.on("finish", function () {
            var buffer = media.get();
            buffer.mimetype = mediaMime;
            buffer.filename = mediaName;
            if (message && media) {
                fb.graph("/" + request.params.userId + "/photos", "POST", {
                    caption: " " + message,
                    media: buffer,
                }, function (error) {
                    if (error) {
                        console.error("["+__filename+":"+__line+"]", error);
                        response.sendStatus(500);
                    } else {
                        response.json({});
                    }
                });
            } else {
                response.sendStatus(400);
            }
        });
        request.pipe(busboy);
    });
};

module.exports = Facebook;
