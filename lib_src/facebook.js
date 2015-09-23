"use strict";

var Pipe = require("flozz-pipejs");
var ajax = require("please-ajax");

var Wanashare = require("./wanashare.js");
var helpers = require("./helpers.js");

var Facebook = Wanashare.$extend({

    _name: "facebook",

    isConnected: function () {
        return Boolean(this.$data.tokens.accessToken);
    },

    _connect: function (callback) {
        var _this = this;

        this.$data.tokens = {
            accessToken: null
        };

        var code;

         var p = new Pipe(
            function () {
                callback();
            },
            function (error) {
                callback(error || "connection-error");
            }
        );

        p.add(function (pipe) {
            _this._openPopup(_this._prefix + _this._name + "/ask-authorization", function (error, data) {
                if (error) {
                    pipe.error(error || "authorization-error");
                } else {
                    if (data.code) {
                        code = data.code;
                        pipe.done();
                    } else {
                        pipe.error(data.error || "authorization-error");  // "user_denied"
                    }
                }
            });
        });

        p.add(function (pipe) {
            ajax.get(_this._prefix + _this._name + "/get-access-token/" + code, {
                success: function (response) {
                    if (response.data.accessToken) {
                        _this.$data.tokens.accessToken = response.data.accessToken;
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
        callback(); // FIXME
        // TODO
    }
});

module.exports = Facebook;
