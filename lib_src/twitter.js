"use strict";

var Wanashare = require("./wanashare.js");

var Twitter = Wanashare.$extend({

    _name: "twitter",

    isConnected: function () {
        return false; // FIXME
    },

    _connect: function (callback) {
        this.$data.tokens = {
            requestToken: null,
            requestTokenSecret: null
        };

        // TODO
    },

    _send: function (message, media, callback) {
        // TODO
    }
});

module.exports = Twitter;
