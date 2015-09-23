"use strict";

var helpers = require("./helpers.js");

var Facebook = function (app, appId, appSecret, prefix) {
    prefix = prefix || "/wanashare/";

    /*
     * Blank page
     */
    app.get(prefix + "facebook/blank", function (request, response) {
        response.send(helpers.genCallbackPage(null, "#E9EAED", "#4D68A1"));
    });

    //
};

module.exports = Facebook;
