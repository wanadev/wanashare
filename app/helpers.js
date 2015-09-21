"use strict";

module.exports = {
    genCallbackPage: function (params) {
        var html = "<!DOCTYPE html>";
        html += "<html>";
        html += "    <head>";
        html += "        <meta charset=\"UTF-8\" />";
        html += "        <title>Wanashare</title>";
        html += "    </head>";
        html += "    <body>";
        html += "        <script>";
        html += "            window.oauth = " + JSON.stringify(params) + ";";
        html += "        </script>";
        html += "    </body>";
        html += "</html>";
        return html;
    }
}
