"use strict";

var Class = require("abitbol");

var Wanashare = Class.$extend({

    _name: "wanashare",

    __init__: function (prefix) {
        this._prefix = prefix || "/";
        this.$data.tokens = {};
        this._loadTokens();
        this._popup = null;
    },

    isConnected: function () {
        throw new Error("Not Implemented");
    },

    share: function(message, media, callback) {
        this._openPopup();

        var _this = this;
        if (this.connected) {
            this._send(message, media, function (error) {
                if (error) {
                    _this._connect(function (error) {
                        _this._popup.close();
                        if (error) {
                            callback(error);
                        } else {
                            _this._saveTokens();
                            _this._send(message, media, callback);
                        }
                    });
                } else {
                    _this._popup.close();
                    callback();
                }
            });
        } else {
            this._connect(function (error) {
                _this._popup.close();
                if (error) {
                    callback(error);
                } else {
                    _this._saveTokens();
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

    _openPopup: function(url, width, height) {
        url = url || "";
        width = width || 750;
        height = height || 525;

        var params = "menubar=0,location=0,resizable=0,scrollbars,status=0,centerscreen,";
        params += "width=" + width;
        params += ",height=" + height;

        this._popup = global.open(url, "Wanashare-" + this._name, params);
    },

    _saveTokens: function () {
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
