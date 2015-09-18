"use strict";

var Class = require("abitbol");

var Wanashare = Class.$extend({

    _name: "wanashare",

    __init__: function (prefix) {
        this._prefix = prefix || "/";
        this.$data.tokens = {};
        this._loadTokens();
    },

    isConnected: function () {
        throw new Error("Not Implemented");
    },

    share: function(message, media, callback) {
        var _this = this;
        if (this.connected) {
            this._send(message, media, function (error) {
                if (error) {
                    _this._connect(function (error) {
                        if (error) {
                            callback(error);
                        } else {
                            _this.saveTokens();
                            _this._send(message, media, callback);
                        }
                    });
                } else {
                    callback();
                }
            });
        } else {
            this._connect(function (error) {
                if (error) {
                    callback(error);
                } else {
                    _this.saveTokens();
                    _this._send(message, media, callback);
                }
            });
        }
    },

    _connect: function (callback) {
        throw new Error("Not Implemented");
    },

    _send: function (message, media, callback) {
        throw new Error("Not Implemented");
    },

    _saveToken: function () {
        if (!global.localStorage) {
            return;
        }
        if (!global.localStorage.wanashare) {
            global.localStorage.wanashare = {};
        }
        try {
            global.localStorage.wanashare[this._name] = JSON.stringify(this.$data.tokens);
        } catch (error) {
            // pass
        }
    },

    _loadTokens: function () {
        if (!global.localStorage) {
            return;
        }
        if (global.localStorage.wanashare && global.localStorage.wanashare[this._name]) {
            try {
                var tokens = JSON.parse(global.localStorage.wanashare[this._name]);
                this.$data.tokens = tokens;
            } catch (error) {
                // pass
            }
        }
    }
});

module.exports = Wanashare;
