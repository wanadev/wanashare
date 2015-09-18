"use strict";

var Pipe = require("flozz-pipejs");
var ajax = require("please-ajax");

var Wanashare = require("./wanashare.js");

var Twitter = Wanashare.$extend({

    _name: "twitter",

    isConnected: function () {
        return false; // FIXME
    },

    _connect: function (callback) {
        var _this = this;

        this.$data.tokens = {
            // TODO
        };

        var requestToken = null;
        var requestTokenSecret = null;

        var p = new Pipe(
            function () {
                console.log("requestToken: " + requestToken); // FIXME
                console.log("requestTokenSecret: " + requestTokenSecret); // FIXME
                callback();
            },
            function (error) {
                callback(error || "connection-error");
            }
        );

        p.add(function (pipe) {
            ajax.get(_this._prefix + _this._name + "/get-request-token", {
                success: function (response) {
                    if (response.data.token && response.data.token_secret) {
                        requestToken = response.data.token;
                        requestTokenSecret = response.data.token_secret;
                        pipe.done();
                    } else {
                        pipe.error("request-token-error");
                    }
                },
                error: pipe.error
            });
        });

        p.add(function (pipe) {
            _this._openPopup(_this._prefix + _this._name + "/ask-authorization/" + requestToken);
        });

        p.run();
    },

    _send: function (message, media, callback) {
        // TODO
    }
});

module.exports = Twitter;
