"use strict";

var Widget = require("photonui/src/widget");
var Dialog = require("photonui/src/container/dialog");
//var _ = (global.photonui && global.photonui.lib.Stone) ?
    //global.photonui.lib.Stone.lazyGettext : function (s) { return s; };

var Wanashare = require("./wanashare.js");

var WanashareWidget = Widget.$extend({

    __init__: function (params) {
        this.$super(params);
        // TODO
    },

});

module.exports = WanashareWidget;
if (global.photonui) {
    global.photonui.WanashareWidget = WanashareWidget;
}
