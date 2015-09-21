"use strict";

var Class = require("abitbol");

var Wanashare = Class.$extend({

    _name: "wanashare",

    __init__: function (prefix) {
        this._prefix = prefix || "/wanashare/";
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

    _openPopup: function(url, callback, width, height) {
        url = url || "";
        callback = callback || function () {};
        width = width || 750;
        height = height || 525;
        var count = 6000;  // ~10 min (6000 * 100ms)

        var params = "menubar=0,location=0,resizable=0,scrollbars,status=0,centerscreen,";
        params += "width=" + width;
        params += ",height=" + height;

        this._popup = global.open(url, "Wanashare-" + this._name, params);

        var _this = this;
        function _waitForCallbackPage() {
            var url = "";
            try {
                url = _this._popup.location.pathname;
            } catch (error) {
                // Pass
            }
            if (url == _this._prefix + "twitter/authorized") {
                callback(undefined, _this._popup.oauth);
            } else {
                // loop until the popup is on the callback page or timeout
                if (count <= 0) {
                    try {
                        _this._popup.close();
                    } catch (error) {
                        // pass
                    }
                    callback("authorization-timeout-error");
                    return;
                }
                count -= 1;
                setTimeout(_waitForCallbackPage, 100);
            }
        }
        _waitForCallbackPage();
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
