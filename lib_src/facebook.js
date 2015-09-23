"use strict";

var Wanashare = require("./wanashare.js");
var helpers = require("./helpers.js");

var Facebook = Wanashare.$extend({

    _name: "facebook",

    isConnected: function () {
        false;  // TODO
    },

    _connect: function (callback) {
        // TODO
    },

    _send: function (message, media, callback) {
        // TODO
    }
});

module.exports = Facebook;
