"use strict";

var Pipe = require("flozz-pipejs");
var ajax = require("please-ajax");

var Wanashare = require("./wanashare.js");
var helpers = require("./helpers.js");

var Twitter = Wanashare.$extend({

    _name: "twitter",

    isConnected: function () {
        return (this.$data.tokens.accessToken && this.$data.tokens.accessTokenSecret);
    },

    _connect: function (callback) {
        var _this = this;

        this.$data.tokens = {
            accessToken: null,
            accessTokenSecret: null
        };

        var requestToken = null;
        var requestTokenSecret = null;
        var oauthVerifier = null;

        var p = new Pipe(
            function () {
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
            _this._openPopup(_this._prefix + _this._name + "/ask-authorization/" + requestToken, function (error, data) {
                if (error) {
                    pipe.error(error || "authorization-error");
                } else {
                    if (data && data.oauth_token == requestToken) {
                        oauthVerifier = data.oauth_verifier;
                        pipe.done(data);
                    } else {
                        pipe.error("authorization-token-mismatch-error");
                    }
                }
            });
        });

        p.add(function (pipe) {
            ajax.get(_this._prefix + _this._name + "/get-access-token/" + requestToken + "/" + requestTokenSecret + "/" + oauthVerifier, {
                success: function (response) {
                    if (response.data.access_token && response.data.access_token_secret) {
                        _this.$data.tokens.accessToken = response.data.access_token;
                        _this.$data.tokens.accessTokenSecret = response.data.access_token_secret;
                        pipe.done();
                    } else {
                        pipe.error("access-token-error");
                    }
                },
                error: pipe.error
            });
        });

        p.run();
    },

    _send: function (message, media, callback) {
        var _this = this;

        var p = new Pipe(
            function () {
                callback();
            },
            function (error) {
                callback(error || "upload-error");
            }
        );

        p.add(function (pipe) {
            helpers.ajaxUpload(
                _this._prefix + _this._name + "/share/" + _this.$data.tokens.accessToken + "/" + _this.$data.tokens.accessTokenSecret,
                media,
                {message: message},
                function (error) {
                    if (error) {
                        pipe.error(error);
                    } else {
                        pipe.done();
                    }
                }
            );
        });

        p.run();
    }
});

module.exports = Twitter;
