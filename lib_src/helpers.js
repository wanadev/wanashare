"use strict";

var helpers = {

    /*
     * From: https://github.com/ebidel/filer.js/blob/4e71a2e08ddc80223714b159bfd22958066380be/src/filer.js#L131
     *
     * Copyright 2013 - Eric Bidelman
     * License: Apache 2.0 <https://github.com/ebidel/filer.js/blob/master/LICENSE>
     */
    dataUrlToBlob: function (dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = parts[1];

            return new Blob([raw], {type: contentType});
        }

        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
    },

    ajaxUpload: function (url, file, data, callback) {
        data = data || {};
        callback = callback || function () {};

        if (!(file instanceof Blob)) {
            file = helpers.dataUrlToBlob(file);
        }

        var formData = new FormData();
        formData.append("data[]", file, "media");
        for (var k in data) {
            formData.append(k, data[k]);
        }

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        xhr.onload = function (event) {
            if (xhr.status === 200) {
                callback();
            }
            else {
                callback("ajax-upload-error");
            }
        };

        xhr.onerror = function (error) {
            callback(error || "ajax-upload-error");
        }

        xhr.send(formData);
    }
};

module.exports = helpers;
