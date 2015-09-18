(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./wanashare.js":2,"photonui/src/container/dialog":13,"photonui/src/widget":17}],2:[function(require,module,exports){
var Class = require("abitbol");

var Wanashare = Class.$extend({
});

module.exports(Wanashare);

},{"abitbol":3}],3:[function(require,module,exports){
"use strict";

var extractAnnotations = require("./annotation.js");

var _disableConstructor = false;

// Inherit from a class without calling its constructor.
function inherit(SuperClass) {
    _disableConstructor = true;
    var __class__ = new SuperClass();
    _disableConstructor = false;
    return __class__;
}

// Checks if the given function uses abitbol special properties ($super, $name,...)
function usesSpecialProperty(fn) {
    return Boolean(fn.toString().match(/.*(\$super|\$name|\$computedPropertyName).*/));
}

var Class = function () {};

Object.defineProperty(Class, "$class", {
    enumerable: false,
    value: Class
});

Object.defineProperty(Class, "$map", {
    enumerable: false,
    value: {
        attributes: {},
        methods: {},
        computedProperties: {}
    }
});

Object.defineProperty(Class, "$extend", {
    enumerable: false,
    value: function (properties) {
        var _superClass = this;
        var _classMap = JSON.parse(JSON.stringify(_superClass.$map));  // not pretty :s

        // New class
        var __class__ = function () {
            if (_disableConstructor) {
                return;
            }
            // Abitbol special properties
            Object.defineProperty(this, "$class", {
                enumerable: false,
                value: __class__
            });
            Object.defineProperty(this, "$map", {
                enumerable: false,
                value: _classMap
            });
            Object.defineProperty(this, "$data", {
                enumerable: false,
                value: {}
            });
            // Computed properties
            for (var property in _classMap.computedProperties) {
                Object.defineProperty(this, property, {
                    enumerable: true,
                    configurable: false,
                    get: (_classMap.computedProperties[property].get !== undefined) ? (function (accessorName) {
                        return function () {
                            return this[accessorName].apply(this, arguments);
                        };
                    })(_classMap.computedProperties[property].get) : undefined,  // jshint ignore:line
                    set: (_classMap.computedProperties[property].set !== undefined) ? (function (mutatorName) {
                        return function () {
                            return this[mutatorName].apply(this, arguments);
                        };
                    })(_classMap.computedProperties[property].set) : undefined   // jshint ignore:line
                });
            }
            // Bind this
            for (var method in _classMap.methods) {
                this[method] = this[method].bind(this);
            }
            // Call the constructor if any
            if (this.__init__) {
                this.__init__.apply(this, arguments);
            }
            return this;
        };

        // Inheritance
        __class__.prototype = inherit(this.$class);

        properties = properties || {};
        var property;
        var computedPropertyName;
        var annotations;
        var i;

        // Copy properties from mixins
        if (properties.__include__) {
            for (i = properties.__include__.length - 1 ; i >= 0 ; i--) {
                for (property in properties.__include__[i]) {
                    if (properties[property] === undefined) {
                        properties[property] = properties.__include__[i][property];
                    }
                }
            }
        }

        // Add properties
        for (property in properties || {}) {
            if (property == "__include__" || property == "__classvars__") {
                continue;
            }
            if (typeof properties[property] == "function") {
                computedPropertyName = undefined;
                _classMap.methods[property] = {annotations: {}};
                // Accessors / Mutators
                if (property.indexOf("get") === 0) {
                    computedPropertyName = property.slice(3, 4).toLowerCase() + property.slice(4, property.length);
                    if (!_classMap.computedProperties[computedPropertyName]) {
                        _classMap.computedProperties[computedPropertyName] = {annotations: {}};
                    }
                    _classMap.computedProperties[computedPropertyName].get = property;
                } else if (property.indexOf("set") === 0) {
                    computedPropertyName = property.slice(3, 4).toLowerCase() + property.slice(4, property.length);
                    if (!_classMap.computedProperties[computedPropertyName]) {
                        _classMap.computedProperties[computedPropertyName] = {annotations: {}};
                    }
                    _classMap.computedProperties[computedPropertyName].set = property;
                } else if (property.indexOf("has") === 0) {
                    computedPropertyName = property.slice(3, 4).toLowerCase() + property.slice(4, property.length);
                    if (!_classMap.computedProperties[computedPropertyName]) {
                        _classMap.computedProperties[computedPropertyName] = {annotations: {}};
                    }
                    _classMap.computedProperties[computedPropertyName].get = property;
                } else if (property.indexOf("is") === 0) {
                    computedPropertyName = property.slice(2, 3).toLowerCase() + property.slice(3, property.length);
                    if (!_classMap.computedProperties[computedPropertyName]) {
                        _classMap.computedProperties[computedPropertyName] = {annotations: {}};
                    }
                    _classMap.computedProperties[computedPropertyName].get = property;
                }
                // Annotations
                annotations = extractAnnotations(properties[property]);
                for (var annotation in annotations) {
                    _classMap.methods[property].annotations[annotation] = annotations[annotation];
                    if (computedPropertyName) {
                        _classMap.computedProperties[computedPropertyName]
                                 .annotations[annotation] = annotations[annotation];
                    }
                }
                // Wrapped method
                if (usesSpecialProperty(properties[property])) {
                    __class__.prototype[property] = (function (method, propertyName, computedPropertyName) {
                        return function () {
                            var _oldSuper = this.$super;
                            var _oldName = this.$name;
                            var _oldComputedPropertyName = this.$computedPropertyName;

                            this.$super = _superClass.prototype[propertyName];
                            this.$name = propertyName;
                            this.$computedPropertyName = computedPropertyName;

                            try {
                                return method.apply(this, arguments);
                            } finally {
                                if (_oldSuper) {
                                    this.$super = _oldSuper;
                                } else {
                                    delete this.$super;
                                }
                                if (_oldName) {
                                    this.$name = _oldName;
                                } else {
                                    delete this.$name;
                                }
                                if (_oldComputedPropertyName) {
                                    this.$computedPropertyName = _oldComputedPropertyName;
                                } else {
                                    delete this.$computedPropertyName;
                                }
                            }
                        };
                    })(properties[property], property, computedPropertyName);  // jshint ignore:line

                // Simple methods
                } else {
                    __class__.prototype[property] = properties[property];
                }
            } else {
                _classMap.attributes[property] = true;
                __class__.prototype[property] = properties[property];
            }
        }

        // Copy super class static properties
        var scStaticProps = Object.getOwnPropertyNames(_superClass);
        // Removes caller, callee and arguments from the list (strict mode)
        // Removes non enumerable Abitbol properties too
        scStaticProps = scStaticProps.filter(function (value) {
            return (["caller", "callee", "arguments", "$class", "$extend", "$map"].indexOf(value) == -1);
        });
        for (i = 0 ; i < scStaticProps.length ; i++) {
            if (__class__[scStaticProps[i]] === undefined) {
                __class__[scStaticProps[i]] = _superClass[scStaticProps[i]];
            }
        }

        // Add static properties
        if (properties.__classvars__) {
            for (property in properties.__classvars__) {
                __class__[property] = properties.__classvars__[property];
            }
        }

        // Add abitbol static properties
        Object.defineProperty(__class__, "$class", {
            enumerable: false,
            value: __class__
        });
        Object.defineProperty(__class__, "$extend", {
            enumerable: false,
            value: Class.$extend
        });
        Object.defineProperty(__class__, "$map", {
            enumerable: false,
            value: _classMap
        });

        return __class__;
    }
});

module.exports = Class;

},{"./annotation.js":4}],4:[function(require,module,exports){
"use strict";

function cleanJs(js) {
    // remove function fn(param) {
    js = js.replace(/^function\s*[^(]*\s*\([^)]*\)\s*\{/, "");

    // remove comments (not super safe but should work in most cases)
    js = js.replace(/\/\*(.|\r|\n)*?\*\//g, "");
    js = js.replace(/\/\/.*?\r?\n/g, "\n");

    // remove indentation and CR/LF
    js = js.replace(/\s*\r?\n\s*/g, "");

    return js;
}

function extractStrings(js) {
    var strings = [];

    var instr = false;
    var inesc = false;
    var quote;
    var buff;
    var c;

    for (var i = 0 ; i < js.length ; i++) {
        c = js[i];

        if (!instr) {
            // New string
            if (c == "\"" || c == "'") {
                instr = true;
                inesc = false;
                quote = c;
                buff = "";
            // Char we don't care about
            } else if ([" ", " ", "\n", "\r", ";"].indexOf(c) > -1) {  // jshint ignore:line
                continue;
            // Other expression -> job finished!
            } else {
                break;
            }
        } else {
            if (!inesc) {
                // Escaped char
                if (c == "\\") {
                    inesc = true;
                // End of string
                } else if (c == quote) {
                    strings.push(buff);
                    instr = false;
                // Any char
                } else {
                    buff += c;
                }
            } else {
                if (c == "\\") {
                    buff += "\\";
                } else if (c == "n") {
                    buff += "\n";
                } else if (c == "r") {
                    buff += "\r";
                } else if (c == "t") {
                    buff += "\t";
                } else if (c == quote) {
                    buff += quote;
                // We don't care...
                } else {
                    buff += "\\" + c;
                }
                inesc = false;
            }
        }
    }

    return strings;
}

function autoCast(value) {
    if (value == "true") {
        return true;
    } else if (value == "false") {
        return false;
    } else if (value == "null") {
        return null;
    } else if (value == "undefined") {
        return undefined;
    } else if (value.match(/^([0-9]+\.?|[0-9]*\.[0-9]+)$/)) {
        return parseFloat(value);
    } else {
        return value;
    }
}

function extractAnnotations(func) {
    var js = cleanJs(func.toString());
    var strings = extractStrings(js);

    var annotations = {};
    var string;
    var key;
    var value;

    for (var i = 0 ; i < strings.length ; i++) {
        string = strings[i].trim();

        if (string.indexOf("@") !== 0) {
            continue;
        }

        key = string.slice(1, (string.indexOf(" ") > -1) ? string.indexOf(" ") : string.length);
        value = true;
        if (string.indexOf(" ") > -1) {
            value = string.slice(string.indexOf(" ") + 1, string.length);
            value = value.trim();
            value = autoCast(value);
        }

        annotations[key] = value;
    }

    return annotations;
}

module.exports = extractAnnotations;

},{}],5:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./annotation.js":6,"dup":3}],6:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],7:[function(require,module,exports){
/*
 * Copyright (c) 2014, Fabien LOISON <http://flozz.fr>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of the author nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


var catalogs = {};
var locale = null;
var domScan = false;

function LazyString(string, replacements) {
    this.toString = gettext.bind(this, string, replacements);

    var props = Object.getOwnPropertyNames(String.prototype);
    for (var i=0 ; i<props.length ; i++) {
        if (props[i] == "toString") continue;
        if (typeof(String.prototype[props[i]]) == "function") {
            this[props[i]] = function() {
                var translatedString = this.self.toString();
                return translatedString[this.prop].apply(translatedString, arguments);
            }.bind({self: this, prop: props[i]});
        }
        else {
            Object.defineProperty(this, props[i], {
                get: function() {
                    var translatedString = this.self.toString();
                    return translatedString[this.prop]
                }.bind({self: this, prop: props[i]}),
                enumerable: false,
                configurable: false
            });
        }
    }
}

function gettext(string, replacements) {
    var result = string;

    if (locale && catalogs[locale] && catalogs[locale].messages[string] &&
        catalogs[locale].messages[string].length > 0 && catalogs[locale].messages[string][0] !== "") {
        result = catalogs[locale].messages[string][0];
    }

    if (replacements) {
        for (var r in replacements) {
            result = result.replace(new RegExp("\{" + r + "\}", "g"), replacements[r]);
        }
    }

    return result;
}

function lazyGettext(string, replacements) {
    return new LazyString(string, replacements);
}

function addCatalogs(newCatalogs) {
    for (var locale in newCatalogs) {
        catalogs[locale] = newCatalogs[locale];
    }
}

function getLocale() {
    return locale;
}

function setLocale(l) {
    locale = l;
    if (domScan) {
        updateDomTranslation();
    }
    _sendEvent("stonejs-locale-changed");
}

function guessUserLanguage() {
    var lang = navigator.language || navigator.userLanguage || navigator.systemLanguage || navigator.browserLanguage || null;

    if (lang) {
        lang = lang.toLowerCase();
    }

    if (lang && lang.length > 3) {
        lang = lang.split(";")[0];
        lang = lang.split(",")[0];
        lang = lang.split("-")[0];
        lang = lang.split("_")[0];
        if (lang.length > 3) {
            lang = null;
        }
    }

    return lang || "en";
}

function _sendEvent(name, data) {
    var data = data || {};
    var ev = null;
    try {
        ev = new Event(name);
    }
    catch (e) {
        // The old-fashioned way... THANK YOU MSIE!
        ev = document.createEvent("Event");
        ev.initEvent(name, true, false);
    }
    for (var i in data) {
        ev[i] = data[i];
    }
    document.dispatchEvent(ev);
}

function _autoloadCatalogs(event) {
    addCatalogs(event.catalog);
}

document.addEventListener("stonejs-autoload-catalogs", _autoloadCatalogs, true);

function enableDomScan(enable) {
    domScan = !!enable;
    if (domScan) {
        updateDomTranslation();
    }
}

function updateDomTranslation() {
    var elements = document.getElementsByTagName("*");
    var params = null;
    var attrs = null;
    var i = 0;
    var j = 0;
    for (i=0 ; i<elements.length ; i++) {
        if (elements[i].hasAttribute("stonejs")) {
            // First pass
            if (!elements[i].hasAttribute("stonejs-orig-string")) {
                elements[i].setAttribute("stonejs-orig-string", elements[i].innerHTML);
            }

            params = {};
            attrs = elements[i].attributes;
            for (j=0 ; j<attrs.length ; j++) {
                if (attrs[j].name.indexOf("stonejs-param-") == 0) {
                    params[attrs[j].name.substr(14)] = attrs[j].value;
                }
            }

            __gettext = gettext;  // Avoid false detection
            elements[i].innerHTML = __gettext(elements[i].getAttribute("stonejs-orig-string"), params);
        }
    }
}

module.exports = {
    LazyString: LazyString,
    gettext: gettext,
    lazyGettext: lazyGettext,
    addCatalogs: addCatalogs,
    getLocale: getLocale,
    setLocale: setLocale,
    guessUserLanguage: guessUserLanguage,
    enableDomScan: enableDomScan,
    updateDomTranslation: updateDomTranslation
};

},{}],8:[function(require,module,exports){
(function (global){

var rng;

if (global.crypto && crypto.getRandomValues) {
  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
  // Moderately fast, high quality
  var _rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(_rnds8);
    return _rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var  _rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return _rnds;
  };
}

module.exports = rng;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

// Unique ID creation requires a high quality random # generator.  We feature
// detect to determine the best RNG source, normalizing to a function that
// returns 128-bits of randomness, since that's what's usually required
var _rng = require('./rng');

// Maps for number <-> hex string conversion
var _byteToHex = [];
var _hexToByte = {};
for (var i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
  _hexToByte[_byteToHex[i]] = i;
}

// **`parse()` - Parse a UUID into it's component bytes**
function parse(s, buf, offset) {
  var i = (buf && offset) || 0, ii = 0;

  buf = buf || [];
  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
    if (ii < 16) { // Don't overflow!
      buf[i + ii++] = _hexToByte[oct];
    }
  });

  // Zero out remaining bytes if string was short
  while (ii < 16) {
    buf[i + ii++] = 0;
  }

  return buf;
}

// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
function unparse(buf, offset) {
  var i = offset || 0, bth = _byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = _rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; n++) {
    b[i + n] = node[n];
  }

  return buf ? buf : unparse(b);
}

// **`v4()` - Generate random UUID**

// See https://github.com/broofa/node-uuid for API details
function v4(options, buf, offset) {
  // Deprecated - 'format' argument, as supported in v1.2
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || _rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ii++) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || unparse(rnds);
}

// Export public API
var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;
uuid.parse = parse;
uuid.unparse = unparse;

module.exports = uuid;

},{"./rng":8}],10:[function(require,module,exports){
/*
 * Copyright (c) 2014-2015, Wanadev <http://www.wanadev.fr/>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of Wanadev nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Authored by: Fabien LOISON <http://flozz.fr/>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @namespace photonui
 */

var Class = require("abitbol");
var uuid = require("uuid");

var Helpers = require("./helpers.js");

/**
 * Base class for all PhotonUI Classes.
 *
 * wEvents:
 *
 *   * destroy:
 *      - description: called before the widget was destroyed.
 *      - callback:    function(widget)
 *
 * @class Base
 * @constructor
 * @param {Object} params An object that can contain any property that will be set to the class (optional).
 */
var Base = Class.$extend({

    // Constructor
    __init__: function (params) {
        // New instances for object properties
        this.__events = {};

        // wEvents
        this._registerWEvents(["destroy"]);

        // Apply params
        params = params || {};
        for (var param in params) {
            if (this[param] !== undefined) {
                this[param] = params[param];
            }
        }

        // Register callbacks
        var ev = null;
        var i = 0;
        var evId = "";
        if (params.callbacks) {
            for (var wEvent in params.callbacks) {
                ev = params.callbacks[wEvent];
                if (typeof(ev) == "function") {
                    this.registerCallback(uuid.v4(), wEvent, ev);
                } else if (ev instanceof Array) {
                    for (i = 0 ; i < ev.length ; i++) {
                        this.registerCallback(uuid.v4(), wEvent, ev[i]);
                    }
                } else {
                    for (evId in ev) {
                        this.registerCallback(evId, wEvent, ev[evId]);
                    }
                }
            }
        }
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Private properties ======

    /**
     * Object containing references javascript events binding (for widget
     * internal use).
     *
     * @property __events
     * @type Object
     * @private
     */
    __events: null,    // Javascript internal event

    /**
     * Object containing references to registered callbacks.
     *
     * @property __callbacks
     * @type Object
     * @private
     */
    __callbacks: null,  // Registered callback

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Destroy the class.
     *
     * @method destroy
     */
    destroy: function () {
        this._callCallbacks("destroy");
        for (var id in this.__events) {
            this._unbindEvent(id);
        }
    },

    /**
     * Register a callback for any PhotonUI/Widget event (called wEvent).
     *
     * Callback signature:
     *
     *     function(Object(Base/Widget) [, arg1 [, arg2 [, ...]]])
     *
     * @method registerCallback
     * @param {String} id An unique id for the callback.
     * @param {String} wEvent the PhotonUI/Widget event name.
     * @param {Function} callback The callback function.
     * @param {Object} thisArg The value of this (optionnal, default = current widget).
     */
    registerCallback: function (id, wEvent, callback, thisArg) {
        if (!this.__callbacks[wEvent]) {
            Helpers.log("error", "This widget has no '" + wEvent + "' wEvent.");
            return;
        }
        this.__callbacks[wEvent][id] = {
            callback: callback,
            thisArg: thisArg || null
        };
    },

    /**
     * Remove a registered callback.
     *
     * @method removeCallback
     * @param {String} id The id of the callback.
     */
    removeCallback: function (id) {
        for (var wEvent in this.__callbacks) {
            if (this.__callbacks[wEvent][id]) {
                delete this.__callbacks[wEvent][id];
            }
        }
    },

    // ====== Private methods ======

    /**
     * Force the update of the given properties.
     *
     * @method _updateProperties
     * @private
     * @param {Array} properties The properties to update.
     */
    _updateProperties: function (properties) {
        for (var i = 0 ; i < properties.length ; i++) {
            this[properties[i]] = this[properties[i]];
        }
    },

    /**
     * Javascript event binding (for internal use).
     *
     * @method _bindEvent
     * @private
     * @param {String} id An unique id for the event.
     * @param {DOMElement} element The element on which the event will be bind.
     * @param {String} evName The event name (e.g. "mousemove", "click",...).
     * @param {Function} callback The function that will be called when the event occured.
     */
    _bindEvent: function (id, element, evName, callback) {
        this._unbindEvent(id);
        this.__events[id] = {
            evName: evName,
            element: element,
            callback: callback
        };
        this.__events[id].element.addEventListener(
                this.__events[id].evName,
                this.__events[id].callback,
                false
        );
    },

    /**
     * Unbind javascript event.
     *
     * @method _unbindEvent
     * @private
     * @param {String} id The id of the event.
     */
    _unbindEvent: function (id) {
        if (!this.__events[id]) {
            return;
        }
        this.__events[id].element.removeEventListener(
                this.__events[id].evName,
                this.__events[id].callback,
                false
        );
        delete this.__events[id];
    },

    /**
     * Register available wEvent.
     *
     * @method _registerWEvents
     * @private
     * @param {Array} wEvents
     */
    _registerWEvents: function (wEvents) {
        if (this.__callbacks === null) {
            this.__callbacks = {};
        }
        for (var i in wEvents) {
            this.__callbacks[wEvents[i]] = {};
        }
    },

    /**
     * Call all callbacks for the given wEvent.
     *
     * NOTE: the first argument passed to the callback is the current widget.
     * NOTE²: if the thisArg of the callback is null, this will be binded to the current widget.
     *
     * @method _callCallbacks
     * @private
     * @param {String} wEvent The widget event.
     * @param {Array} params Parametters that will be sent to the callbacks.
     */
    _callCallbacks: function (wEvent, params) {
        params = params || [];
        for (var id in this.__callbacks[wEvent]) {
            this.__callbacks[wEvent][id].callback.apply(
                    this.__callbacks[wEvent][id].thisArg || this,
                    [this].concat(params)
            );
        }
    }
});

module.exports = Base;

},{"./helpers.js":16,"abitbol":5,"uuid":9}],11:[function(require,module,exports){
/*
 * Copyright (c) 2014-2015, Wanadev <http://www.wanadev.fr/>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of Wanadev nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Authored by: Fabien LOISON <http://flozz.fr/>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule Container
 * @namespace photonui
 */

var Container = require("./container.js");
var Widget = require("../widget.js");

/**
 * Windows base class.
 *
 * wEvents:
 *
 *   * position-changed:
 *      - description: called when the widows is moved.
 *      - callback:    function(widget, x, y)
 *
 * @class BaseWindow
 * @constructor
 * @extends photonui.Container
 */
var BaseWindow = Container.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["position-changed"]);
        this.$super(params);

        // Windows are hidden by default
        params = params || {};
        if (params.visible === undefined) {
            this.visible = false;
        }

        // Insert the window in the DOM tree
        Widget.domInsert(this);

        // Update properties
        this._updateProperties([
            "position", "width", "height", "minWidth", "minHeight",
            "maxWidth", "maxHeight", "padding"
        ]);
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Window position.
     *
     *     {x: Number, y: Number}
     *
     * @property position
     * @type Object
     * @default {x: 0, y: 0}
     */
    getPosition: function () {
        if (this.visible && this.html.parentNode) {
            return this.absolutePosition;
        }
        return {x: this._x, y: this._y};
    },

    setPosition: function (x, y) {
        if (typeof(x) == "object" && y === undefined) {
            this.html.style.left = x.x + "px";
            this.html.style.top = x.y + "px";
            this._x = x.x;
            this._y = x.y;
        } else {
            if (typeof(x) == "number") {
                this.html.style.left = x + "px";
                this._x = x;
            }
            if (typeof(y) == "number") {
                this.html.style.top = y + "px";
                this._y = y;
            }
        }
        this._callCallbacks("position-changed", [this.x, this.y]);
    },

    /**
     * The X position of the Window.
     *
     * @property x
     * @type Number
     * @default 0
     */
    _x: 0,

    getX: function () {
        return this.position.x;
    },

    setX: function (x) {
        this.setPosition(x, null);
    },

    /**
     * The Y position of the Window.
     *
     * @property y
     * @type Number
     * @default 0
     */
    _y: 0,

    getY: function () {
        return this.position.y;
    },

    setY: function (y) {
        this.setPosition(null, y);
    },

    /**
     * Width of the container node.
     *
     * @property width
     * @type Number
     * @default: null (auto)
     */
    _width: null,

    getWidth: function () {
        if (this.visible && this.html.parenNode) {
            return this.containerNode.offsetWidth;
        }
        return this._width || 0;
    },

    setWidth: function (width) {
        this._width = width || null;
        if (this._width) {
            this.containerNode.style.width = width + "px";
        } else {
            this.containerNode.style.width = "auto";
        }
    },

    /**
     * Height of the container node.
     *
     * @property height
     * @type Number
     * @default: null (auto)
     */
    _height: null,

    getHeight: function () {
        if (this.visible && this.html.parenNode) {
            return this.containerNode.offsetHeight;
        }
        return this._height || 0;
    },

    setHeight: function (height) {
        this._height = height || null;
        if (this._height) {
            this.containerNode.style.height = height + "px";
        } else {
            this.containerNode.style.height = "auto";
        }
    },

    /**
     * Minimum width of the container node.
     *
     * @property minWidth
     * @type Number
     * @default: null (no minimum)
     */
    _minWidth: null,

    getMinWidth: function () {
        return this._minWidth;
    },

    setMinWidth: function (minWidth) {
        this._minWidth = minWidth || null;
        if (this._minWidth) {
            this.containerNode.style.minWidth = minWidth + "px";
        } else {
            this.containerNode.style.minWidth = "0";
        }
    },

    /**
     * Minimum height of the container node.
     *
     * @property minHeight
     * @type Number
     * @default: null (no minimum)
     */
    _minHeight: null,

    getMinHeight: function () {
        return this._minHeight;
    },

    setMinHeight: function (minHeight) {
        this._minHeight = minHeight || null;
        if (this._minHeight) {
            this.containerNode.style.minHeight = minHeight + "px";
        } else {
            this.containerNode.style.minHeight = "0";
        }
    },

    /**
     * Maximum width of the container node.
     *
     * @property maxWidth
     * @type Number
     * @default: null (no maximum)
     */
    _maxWidth: null,

    getMaxWidth: function () {
        return this._maxWidth;
    },

    setMaxWidth: function (maxWidth) {
        this._maxWidth = maxWidth || null;
        if (this._maxWidth) {
            this.containerNode.style.maxWidth = maxWidth + "px";
        } else {
            this.containerNode.style.maxWidth = "auto";
        }
    },

    /**
     * Maximum height of the container node.
     *
     * @property maxHeight
     * @type Number
     * @default: null (no maximum)
     */
    _maxHeight: null,

    getMaxHeight: function () {
        return this._maxHeight;
    },

    setMaxHeight: function (maxHeight) {
        this._maxHeight = maxHeight || null;
        if (this._maxHeight) {
            this.containerNode.style.maxHeight = maxHeight + "px";
        } else {
            this.containerNode.style.maxHeight = "auto";
        }
    },

    /**
     * Window container node padding.
     *
     * @property padding
     * @type Number
     * @default 0
     */
    _padding: 0,

    getPadding: function () {
        return this._padding;
    },

    setPadding: function (padding) {
        this._padding = padding;
        this.containerNode.style.padding = padding + "px";
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        return this.__html.window;
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return this.html;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Center the window.
     *
     * @method center
     */
    center: function () {
        var node = Widget.e_parent || document.getElementsByTagName("body")[0];
        if (!node) {
            return;
        }
        this.setPosition(
                Math.max((node.offsetWidth - this.offsetWidth) / 2, 0) | 0,
                Math.max((node.offsetHeight - this.offsetHeight) / 2, 0) | 0
        );
    },

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.__html.window = document.createElement("div");
        this.__html.window.className = "photonui-widget photonui-basewindow";
    }
});

module.exports = BaseWindow;

},{"../widget.js":17,"./container.js":12}],12:[function(require,module,exports){
/*
 * Copyright (c) 2014-2015, Wanadev <http://www.wanadev.fr/>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of Wanadev nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Authored by: Fabien LOISON <http://flozz.fr/>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule Container
 * @namespace photonui
 */

var Widget = require("../widget.js");

/**
 * Base class for container widgets.
 *
 * @class Container
 * @constructor
 * @extends photonui.Widget
 */
var Container = Widget.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);

        this._updateProperties(["horizontalChildExpansion", "verticalChildExpansion"]);

        // Force to update the parent of the child
        if (this._childName) {
            this.child._parentName = this.name;
        }
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Horizontaly expand the container's child widget.
     *
     * @property horizontalChildExpansion
     * @type Boolean
     * @default true
     */
    _horizontalChildExpansion: true,

    getHorizontalChildExpansion: function () {
        return this._horizontalChildExpansion;
    },

    setHorizontalChildExpansion: function (expansion) {
        this._horizontalChildExpansion = Boolean(expansion);
        if (!this.containerNode) {
            return;
        }
        if (expansion) {
            this.containerNode.classList.add("photonui-container-expand-child-horizontal");
        } else {
            this.containerNode.classList.remove("photonui-container-expand-child-horizontal");
        }
    },

    /**
     * Verticaly expand the container's child widget.
     *
     * @property verticalChildExpansion
     * @type Boolean
     * @default false
     */
    _verticalChildExpansion: false,

    getVerticalChildExpansion: function () {
        return this._verticalChildExpansion;
    },

    setVerticalChildExpansion: function (expansion) {
        this._verticalChildExpansion = Boolean(expansion);
        if (!this.containerNode) {
            return;
        }
        if (expansion) {
            this.containerNode.classList.add("photonui-container-expand-child-vertical");
        } else {
            this.containerNode.classList.remove("photonui-container-expand-child-vertical");
        }
    },

    /**
     * The child widget name.
     *
     * @property childName
     * @type String
     * @default null (no child)
     */
    _childName: null,

    getChildName: function () {
        return this._childName;
    },

    setChildName: function (childName) {
        if (this.childName && this.containerNode && this.child && this.child.html) {
            this.containerNode.removeChild(this.child.html);
            this.child._parentName = null;
        }
        this._childName = childName;
        if (this.child && this.child._parentName) {
            this.child.parent.child = null;
        }
        if (this.childName && this.containerNode && this.child && this.child.html) {
            this.containerNode.appendChild(this.child.html);
            this.child._parentName = this.name;
        }
    },

    /**
     * The child widget.
     *
     * @property child
     * @type photonui.Widget
     * @default null (no child)
     */
    getChild: function () {
        return Widget.getWidget(this.childName);
    },

    setChild: function (child) {
        if ((!child) || (!(child instanceof Widget))) {
            this.childName = null;
            return;
        }
        this.childName = child.name;
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return null;
    },

    /**
     * Called when the visibility changes.
     *
     * @method _visibilityChanged
     * @private
     * @param {Boolean} visibility Current visibility state (otptional, defaut=this.visible)
     */
    _visibilityChanged: function (visibility) {
        visibility = (visibility !== undefined) ? visibility : this.visible;
        if (this.child instanceof Widget) {
            this.child._visibilityChanged(visibility);
        }
        this.$super(visibility);
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Remove the given child.
     *
     * @method removeChild
     * @param {photonui.Widget} widget The widget to remove/
     */
    removeChild: function (widget) {
        if (this.child == widget) {
            this.child = null;
        }
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function () {
        if (this.childName && this.child) {
            this.child.destroy();
        }
        this.$super();
    }
});

module.exports = Container;

},{"../widget.js":17}],13:[function(require,module,exports){
/*
 * Copyright (c) 2014-2015, Wanadev <http://www.wanadev.fr/>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of Wanadev nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Authored by: Fabien LOISON <http://flozz.fr/>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule Container
 * @namespace photonui
 */

var Helpers = require("../helpers.js");
var Widget = require("../widget.js");
var Window = require("./window.js");

var _windowList = [];

/**
 * Dialog Window.
 *
 * @class Dialog
 * @constructor
 * @extends photonui.Window
 */
var Dialog = Window.$extend({

    // Constructor
    __init__: function (params) {
        this._buttonsNames = [];
        this.$super(params);

        // Force to update the parent of the buttons
        var buttons = this.buttons;
        for (var i = 0 ; i < buttons.length ; i++) {
            buttons[i]._parentName = this.name;
        }
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * Dialog button widgets name.
     *
     * @property buttonsNames
     * @type Array
     * @default []
     */
    _buttonsNames: [],

    getButtonsNames: function () {
        return this._buttonsNames;
    },

    setButtonsNames: function (buttonsNames) {
        var i;
        var widget;
        for (i = 0 ; i < this._buttonsNames.length ; i++) {
            widget = Widget.getWidget(this._buttonsNames[i]);
            var index = this._buttonsNames.indexOf(widget.name);
            if (index >= 0) {
                widget._parentName = null;
            }
        }
        this._buttonsNames = [];
        for (i = 0 ; i < buttonsNames.length ; i++) {
            widget = Widget.getWidget(buttonsNames[i]);
            if (widget) {
                if (widget.parent) {
                    widget.unparent();
                }
                this._buttonsNames.push(widget.name);
                widget._parentName = this.name;
            }
        }
        this._updateButtons();
    },

    /**
     * Dialog buttons widgets.
     *
     * @property buttons
     * @type Array
     * @default []
     */
    getButtons: function () {
        var buttons = [];
        var widget;
        for (var i = 0 ; i < this._buttonsNames.length ; i++) {
            widget = Widget.getWidget(this._buttonsNames[i]);
            if (widget instanceof Widget) {
                buttons.push(widget);
            }
        }
        return buttons;
    },

    setButtons: function (buttons) {
        var buttonsNames = [];
        for (var i = 0 ; i < buttons.length ; i++) {
            if (buttons[i] instanceof Widget) {
                buttonsNames.push(buttons[i].name);
            }
        }
        this.buttonsNames = buttonsNames;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Add a button to the dialog.
     *
     * @method addButton
     * @param {photonui.Widget} widget The button to add.
     */
    addButton: function (widget, layoutOptions) {
        if (widget.parent) {
            widget.unparent();
        }
        if (layoutOptions) {
            widget.layoutOptions = layoutOptions;
        }
        this._buttonsNames.push(widget.name);
        widget._parentName = this.name;
        this._updateButtons();
    },

    /**
     * Remove a button from the dialog.
     *
     * @method removeButton
     * @param {photonui.Widget} widget The button to remove.
     */
    removeButton: function (widget) {
        var index = this._buttonsNames.indexOf(widget.name);
        if (index >= 0) {
            this._buttonsNames.splice(index, 1);
            widget._parentName = null;
        }
        this._updateButtons();
    },

    // Alias needed for photonui.Widget.unparent()
    removeChild: function () {
        this.$super.apply(this, arguments);
        this.removeButton.apply(this, arguments);
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function () {
        var buttons = this.buttons;
        for (var i = 0 ; i < buttons.length ; i++) {
            if (buttons[i]) {
                buttons[i].destroy();
            }
        }
        this.$super();
    },

    // ====== Private methods ======

    /**
     * Update dialog buttons.
     *
     * @method _updateButtons
     * @private
     */
    _updateButtons: function () {
        Helpers.cleanNode(this.__html.buttons);
        var buttons = this.buttons;
        for (var i = buttons.length - 1 ; i >= 0 ; i--) {
            this.__html.buttons.appendChild(buttons[i].html);
        }
    },

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.$super();
        this.__html.window.className += " photonui-dialog";

        this.__html.buttons = document.createElement("div");
        this.__html.buttons.className = "photonui-dialog-buttons";
        this.__html.window.appendChild(this.__html.buttons);
    },

    /**
     * Called when the visibility changes.
     *
     * @method _visibilityChanged
     * @private
     * @param {Boolean} visibility Current visibility state (otptional, defaut=this.visible)
     */
    _visibilityChanged: function (visibility) {
        visibility = (visibility !== undefined) ? visibility : this.visible;
        var buttons = this.buttons;
        for (var i = 0 ; i < buttons.length ; i++) {
            if (!(this.child instanceof Widget)) {
                continue;
            }
            buttons[i]._visibilityChanged(visibility);
        }
        this.$super(visibility);
    },
});

module.exports = Dialog;

},{"../helpers.js":16,"../widget.js":17,"./window.js":15}],14:[function(require,module,exports){
/*
 * Copyright (c) 2014-2015, Wanadev <http://www.wanadev.fr/>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of Wanadev nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Authored by: Fabien LOISON <http://flozz.fr/>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule Container
 * @namespace photonui
 */

var BaseWindow = require("./basewindow.js");

/**
 * Popup Window.
 *
 * @class PopupWindow
 * @constructor
 * @extends photonui.BaseWindow
 */
var PopupWindow = BaseWindow.$extend({

    // Constructor
    __init__: function (params) {
        this.$super(params);
        this._bindEvent("document-mousedown-close", document, "mousedown", this.hide.bind(this));
        this._bindEvent("popup-click-close", this.html, "click", this.hide.bind(this));
        this._bindEvent("mousedown-preventclose", this.html, "mousedown", function (event) {
            event.stopPropagation();
        }.bind(this));
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return this.__html.inner;
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Pop the window at the given position.
     *
     * @method popupXY
     * @param {Number} x
     * @param {Number} y
     */
    popupXY: function (x, y) {
        this.setPosition(-1337, -1337);
        this.show();

        var bw = document.getElementsByTagName("body")[0].offsetWidth;
        var bh = document.getElementsByTagName("body")[0].offsetHeight;
        var pw = this.offsetWidth;
        var ph = this.offsetHeight;

        if (x + pw > bw) {
            x = bw - pw;
        }

        if (y + ph > bh) {
            y -= ph;
        }

        if (x < 0) {
            x = 0;
        }
        if (y < 0) {
            y = 0;
        }

        this.setPosition(x, y);
    },

    /**
     * Pop the window at the best position for the given widget.
     *
     * @method popupWidget
     * @param {photonui.Widget} widget
     */
    popupWidget: function (widget) {
        this.setPosition(-1337, -1337);
        this.show();

        var e_body = document.getElementsByTagName("body")[0];
        var x = 0;
        var y = 0;
        var wpos = widget.absolutePosition;
        var wh = widget.offsetHeight;
        var ww = widget.offsetWidth;
        var pw = this.offsetWidth;
        var ph = this.offsetHeight;

        if (wpos.x + pw < e_body.offsetWidth) {
            x = wpos.x;
        } else if (wpos.x + ww < e_body.offsetWidth) {
            x = wpos.x + ww - pw;
        } else {
            x = e_body.offsetWidth - pw;
        }

        if (wpos.y + wh + ph < e_body.offsetHeight) {
            y = wpos.y + wh + 1;
        } else if (wpos.y - ph >= 0) {
            y = wpos.y - ph - 1;
        }

        if (x < 0) {
            x = 0;
        }
        if (y < 0) {
            y = 0;
        }

        this.setPosition(x, y);
    },

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        this.$super();
        this.__html.window.className += " photonui-popupwindow";

        this.__html.inner = document.createElement("div");
        this.__html.window.appendChild(this.__html.inner);
    }
});

module.exports = PopupWindow;

},{"./basewindow.js":11}],15:[function(require,module,exports){
/*
 * Copyright (c) 2014-2015, Wanadev <http://www.wanadev.fr/>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of Wanadev nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Authored by: Fabien LOISON <http://flozz.fr/>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule Container
 * @namespace photonui
 */

var Stone = require("stonejs");
var Helpers = require("../helpers.js");
var Widget = require("../widget.js");
var BaseWindow = require("./basewindow.js");

var _windowList = [];

/**
 * Window.
 *
 * wEvents:
 *
 *   * close-button-clicked:
 *      - description: called when the close button was clicked.
 *      - callback:    function(widget)
 *
 * @class Window
 * @constructor
 * @extends photonui.BaseWindow
 */
var Window = BaseWindow.$extend({

    // Constructor
    __init__: function (params) {
        this._registerWEvents(["close-button-clicked"]);
        this.$super(params);

        // Bind js events
        this._bindEvent("move.dragstart", this.__html.windowTitle, "mousedown", this.__moveDragStart.bind(this));
        this._bindEvent("closeButton.click", this.__html.windowTitleCloseButton, "click",
                        this.__closeButtonClicked.bind(this));
        this._bindEvent("totop", this.__html.window, "mousedown", this.moveToFront.bind(this));
        this._bindEvent("closeButton.mousedown", this.__html.windowTitleCloseButton, "mousedown",
                        function (event) { event.stopPropagation(); });

        // Update Properties
        this._updateProperties(["title", "closeButtonVisible"]);
        this.moveToFront();
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The window title.
     *
     * @property title
     * @type String
     * @default "Window"
     */
    _title: "Window",

    getTitle: function () {
        return this._title;
    },

    setTitle: function (title) {
        this._title = title;
        Helpers.cleanNode(this.__html.windowTitleText);
        this.__html.windowTitleText.appendChild(document.createTextNode(title));
    },

    /**
     * Determine if the window can be moved (drag & drop) by the user.
     *
     * @property movable
     * @type Boolean
     * @default true
     */
    _movable: true,

    isMovable: function () {
        return this._movable;
    },

    setMovable: function (movable) {
        this._movable = movable;
    },

    /**
     * Determine if the close button in the title bar is displayed or not.
     *
     * @property closeButtonVisible
     * @type Boolean
     * default: true
     */
    _closeButtonVisible: true,

    getCloseButtonVisible: function () {
        return this._closeButtonVisible;
    },

    setCloseButtonVisible: function (closeButtonVisible) {
        this._closeButtonVisible = closeButtonVisible;

        if (closeButtonVisible) {
            this.addClass("photonui-window-have-button");
            this.__html.windowTitleCloseButton.style.display = "block";
        } else {
            this.removeClass("photonui-window-have-button");
            this.__html.windowTitleCloseButton.style.display = "none";
        }
    },

    /**
     * Modal window?
     *
     * @property modal
     * @type Boolean
     * @default false
     */
    _modal: false,

    isModal: function () {
        return this._modal;
    },

    setModal: function (modal) {
        this._modal = modal;
        if (modal) {
            this.__html.modalBox = document.createElement("div");
            this.__html.modalBox.className = "photonui-window-modalbox";
            var parentNode = Widget.e_parent || document.getElementsByTagName("body")[0];
            parentNode.appendChild(this.__html.modalBox);
            this.visible = this.visible; // Force update
        } else if (this.__html.modalBox) {
            this.__html.modalBox.parentNode.removeChild(this.__html.modalBox);
            delete this.__html.modalBox;
        }
    },

    /**
     * HTML Element that contain the child widget HTML.
     *
     * @property containerNode
     * @type HTMLElement
     * @readOnly
     */
    getContainerNode: function () {
        return this.__html.windowContent;
    },

    setVisible: function (visible) {
        this.$super(visible);
        if (this.visible) {
            this.moveToFront();
            if (this.modal) {
                this.__html.modalBox.style.display = "block";
            }
        } else {
            this.moveToBack();
            if (this.modal) {
                this.__html.modalBox.style.display = "none";
            }
        }
    },

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Bring the window to front.
     *
     * @method moveToFront
     */
    moveToFront: function () {
        var index = _windowList.indexOf(this);
        if (index >= 0) {
            _windowList.splice(index, 1);
        }
        _windowList.unshift(this);
        this._updateWindowList();
    },

    /**
     * Bring the window to the back.
     *
     * @method moveToBack
     */
    moveToBack: function () {
        var index = _windowList.indexOf(this);
        if (index >= 0) {
            _windowList.splice(index, 1);
        }
        _windowList.push(this);
        this._updateWindowList();
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function () {
        this.modal = false;
        var index = _windowList.indexOf(this);
        if (index >= 0) {
            _windowList.splice(index, 1);
        }
        this.$super();
    },

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        var _ = Stone.lazyGettext;

        this.$super();
        this.__html.window.className += " photonui-window";

        this.__html.windowTitle = document.createElement("div");
        this.__html.windowTitle.className = "photonui-window-title";
        this.__html.window.appendChild(this.__html.windowTitle);

        this.__html.windowTitleCloseButton = document.createElement("button");
        this.__html.windowTitleCloseButton.className = "photonui-window-title-close-button fa fa-times";
        this.__html.windowTitleCloseButton.title = Stone.lazyGettext("Close");
        this.__html.windowTitle.appendChild(this.__html.windowTitleCloseButton);

        this.__html.windowTitleText = document.createElement("span");
        this.__html.windowTitleText.className = "photonui-window-title-text";
        this.__html.windowTitle.appendChild(this.__html.windowTitleText);

        this.__html.windowContent = document.createElement("div");
        this.__html.windowContent.className = "photonui-container photonui-window-content";
        this.__html.window.appendChild(this.__html.windowContent);
    },

    /**
     * Update all the windows.
     *
     * @method _updateWindowList
     * @private
     */
    _updateWindowList: function () {
        for (var i = _windowList.length - 1, z = 0 ; i >= 0 ; i--, z++) {   // jshint ignore:line
            if (i === 0) {
                _windowList[i].html.style.zIndex = 2001;
                _windowList[i].addClass("photonui-active");
            } else {
                _windowList[i].html.style.zIndex = 1000 + z;
                _windowList[i].removeClass("photonui-active");
            }
            if (_windowList[i].modal) {
                _windowList[i].html.style.zIndex = 3001;
            }
        }
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Start moving the window.
     *
     * @method _moveDragStart
     * @private
     * @param {Object} event
     */
    __moveDragStart: function (event) {
        if (!this.movable || event.button > 0) {
            return;
        }
        var offsetX = (event.offsetX !== undefined) ? event.offsetX : event.layerX;
        var offsetY = (event.offsetY !== undefined) ? event.offsetY : event.layerY;
        this.__html.windowTitle.style.cursor = "move";
        this._bindEvent("move.dragging", document, "mousemove", this.__moveDragging.bind(this, offsetX, offsetY));
        this._bindEvent("move.dragend", document, "mouseup", this.__moveDragEnd.bind(this));
    },

    /**
     * Move the window.
     *
     * @method _moveDragging
     * @private
     * @param {Number} offsetX
     * @param {Number} offsetY
     * @param {Object} event
     */
    __moveDragging: function (offsetX, offsetY, event) {
        var e_body = document.getElementsByTagName("body")[0];
        var x = Math.min(Math.max(event.pageX - offsetX, 40 - this.offsetWidth), e_body.offsetWidth - 40);
        var y = Math.max(event.pageY - offsetY, 0);
        if (e_body.offsetHeight > 0) {
            y = Math.min(y, e_body.offsetHeight - this.__html.windowTitle.offsetHeight);
        }
        this.setPosition(x, y);
    },

    /**
     * Stop moving the window.
     *
     * @method _moveDragEnd
     * @private
     * @param {Object} event
     */
    __moveDragEnd: function (event) {
        this.__html.windowTitle.style.cursor = "default";
        this._unbindEvent("move.dragging");
        this._unbindEvent("move.dragend");
    },

    /**
     * Close button clicked.
     *
     * @method _closeButtonClicked
     * @private
     * @param {Object} event
     */
    __closeButtonClicked: function (event) {
        this._callCallbacks("close-button-clicked");
    },

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        this.$super();
        this.__html.windowTitleCloseButton.title = Stone.lazyGettext("Close");
    }
});

module.exports = Window;

},{"../helpers.js":16,"../widget.js":17,"./basewindow.js":11,"stonejs":7}],16:[function(require,module,exports){
/*
 * Copyright (c) 2014-2015, Wanadev <http://www.wanadev.fr/>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of Wanadev nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Authored by: Fabien LOISON <http://flozz.fr/>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule Helpers
 * @main helpers
 * @namespace photonui
 */

var uuid = require("uuid");

/**
 * Helpers.
 *
 * @class Helpers
 * @constructor
 */
var Helpers = function () {
};

/**
 * Escape HTML.
 *
 * @method escapeHtml
 * @static
 * @param {String} string
 * @return {String}
 */
Helpers.escapeHtml = function (string) {
    return string
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
};

/**
 * Generate an UUID version 4 (RFC 4122).
 *
 * This method is deprecated, please use `photonui.lib.uuid.v4()` instead.
 *
 * @method uuid4
 * @static
 * @deprecated
 * @return {String} The generated UUID
 */
Helpers.uuid4 = function () {
    Helpers.log("warn", "'photonui.Helpers.uuid4()' is deprecated. Use 'photonui.lib.uuid.v4()' instead.");
    return uuid.v4();
};

/**
 * Clean node (remove all children of the node).
 *
 * @method cleanNode
 * @static
 * @param {HTMLElement} node
 */
Helpers.cleanNode = function (node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
};

/**
 * Get the absolute position of an HTML Element.
 *
 * @method getAbsolutePosition
 * @static
 * @param {HTMLElement} element The HTML element (or its id)
 * @return {Object} `{x: <Number>, y: <Number>}
 */
Helpers.getAbsolutePosition = function (element) {
    if (typeof(element) == "string") {
        element = document.getElementById(element);
    }
    if (!(element instanceof Element)) {
        return {x: 0, y: 0};
    }
    var css;
    try {
        css = getComputedStyle(element);
    } catch (e) {
        return {x: 0, y: 0};
    }
    if (!css) {
        return {x: 0, y: 0};
    }

    var x = -parseInt(css.borderLeftWidth);
    var y = -parseInt(css.borderTopWidth);

    while (element.offsetParent) {
        css = getComputedStyle(element);

        x += element.offsetLeft || 0;
        x += parseInt(css.borderLeftWidth);

        y += element.offsetTop || 0;
        y += parseInt(css.borderTopWidth);

        element = element.offsetParent;
    }

    return {x: x, y: y};
};

/**
 * Check and compute size to valid CSS size
 *
 * Valid values and transformations:
 *     undefined  -> defaultValue
 *     null       -> "auto" (if "auto" is alowed, "0px" else)
 *     +Infinity  -> "100%"
 *     Number     -> "<Number>px"
 *
 * @method numberToCssSize
 * @static
 * @param {Number} value
 * @param {Number} defaultValue (opt, default=nullValue)
 * @param {String} nullValue (opt, default="auto")
 * @return {String} sanitized version of the size.
 */
Helpers.numberToCssSize = function (value, defaultValue, nullValue) {
    nullValue = (nullValue === undefined) ? "auto" : nullValue;
    defaultValue = (nullValue === undefined) ? null : defaultValue;
    value = (value === undefined) ? defaultValue : value;

    if (value === Infinity) {
        return "100%";
    } else if (!isNaN(parseFloat(value))) {
        return Math.max(0, parseFloat(value) | 0) + "px";
    } else if (value !== defaultValue) {
        return Helpers.numberToCssSize(defaultValue, defaultValue, nullValue);
    } else {
        return nullValue;
    }
};

/**
 * Write log into the terminal.
 *
 * @method log
 * @static
 * @param {String} level The log level ("info", "warn", "error", ...)
 * @param {String} message The message to log
 */
Helpers.log = function (level, message) {
    try {
        if (!window.console) {
            return;
        }
        if (!window.console.log) {
            return;
        }
        if (!window.console[level]) {
            level = "log";
        }
        window.console[level]("PhotonUI: " + message);
    } catch (e) {
    }
};

module.exports = Helpers;

},{"uuid":9}],17:[function(require,module,exports){
/*
 * Copyright (c) 2014-2015, Wanadev <http://www.wanadev.fr/>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of Wanadev nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Authored by: Fabien LOISON <http://flozz.fr/>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @namespace photonui
 */

var Stone = require("stonejs");
var uuid = require("uuid");

var Base = require("./base.js");
var Helpers = require("./helpers.js");

var _widgets = {};

/**
 * Base class for all PhotonUI widgets.
 *
 * wEvents:
 *
 *   * show:
 *      - description: called when the widget is displayed (a change in the parent's
 *                     visibility can also trigger this event).
 *      - callback:    function(widget)
 *
 *   * hide:
 *      - description: called when the widget is hidden (a change in the parent's visibility
 *                     can also trigger this event).
 *      - callback:    function(widget)
 *
 * @class Widget
 * @constructor
 * @extends photonui.Base
 * @param {Object} params An object that can contain any property of the widget (optional).
 */
var Widget = Base.$extend({

    // Constructor
    __init__: function (params) {
        // New instances for object properties
        this.__html = {};
        this._layoutOptions = {};

        // Build the html
        this._buildHtml();

        // wEvents
        this._registerWEvents(["show", "hide"]);

        // Parent constructor
        this.$super(params);

        // Update properties
        this._updateProperties(["visible"]);

        // Default name
        if (!this.name) {
            this.name = "widget-" + uuid.v4();
        }

        // Additional className
        if (params && params.className) {
            this.addClass(params.className);
        }

        // Bind some events
        if (this.html) {
            this._bindEvent("pop-contextmenu", this.html, "contextmenu", this.__onContextMenu.bind(this));
        }
        this._bindEvent("locale-changed", document, "stonejs-locale-changed", this.__onLocaleChanged.bind(this));

        // Register the widget
        _widgets[this.name] = this;
    },

    //////////////////////////////////////////
    // Properties and Accessors             //
    //////////////////////////////////////////

    // ====== Public properties ======

    /**
     * The unique name of the widget.
     *
     * @property name
     * @type String
     * @default "widget-" + uuid.v4()
     */
    _name: null,

    getName: function () {
        return this._name;
    },

    setName: function (name) {
        delete _widgets[this.name];
        this._name = name;
        _widgets[name] = this;
        if (this.html) {
            this.html.id = this.name;
        }
    },

    /**
     * The parent widget name.
     *
     * @property parentName
     * @type String
     * @readOnly
     * @default null (no parent)
     */
    _parentName: null,

    getParentName: function () {
        return this._parentName;
    },

    /**
     * The parent widget.
     *
     * @property parent
     * @type photonui.Widget
     * @readOnly
     * @default null (no parent)
     */
    getParent: function () {
        return Widget.getWidget(this.parentName);
    },

    /**
     * Is the widget visible or hidden.
     *
     * @property visible
     * @type Boolean
     * @default true
     */
    _visible: true,

    isVisible: function () {
        return this._visible;
    },

    setVisible: function (visible) {
        this._visible = Boolean(visible);
        if (!this.html) {
            return;
        }
        if (visible) {
            this.html.style.display = "";
        } else {
            this.html.style.display = "none";
        }
        this._visibilityChanged();
    },

    /**
     * Tooltip.
     *
     * @property tooltip
     * @type String
     * @default null
     */
    _tooltip: null,

    getTooltip: function () {
        return this._tooltip;
    },

    setTooltip: function (tooltip) {
        this._tooltip = tooltip;
        if (tooltip) {
            this.html.title = tooltip;
        } else {
            this.html.removeAttribute("title");
        }
    },

    /**
     * The name of the managed contextual menu (`photonui.PopupWindow().name`).
     *
     * @property contextMenuName
     * @type String
     * @default null (= no context menu)
     */
    _contextMenuName: null,

    getContextMenuName: function () {
        return this._contextMenuName;
    },

    setContextMenuName: function (contextMenuName) {
        this._contextMenuName = contextMenuName;
    },

    /**
     * The managed contextual menu.
     *
     * @property contextMenu
     * @type photonui.PopupWindow
     * @default null (= no context menu)
     */
    getContextMenu: function () {
        return Widget.getWidget(this.contextMenuName);
    },

    setContextMenu: function (contextMenu) {
        var PopupWindow = require("./container/popupwindow.js");
        if (contextMenu instanceof PopupWindow) {
            this.contextMenuName = contextMenu.name;
        } else {
            this.contextMenuName = null;
        }
    },

    /**
     * Layout options.
     *
     * @property layoutOptions
     * @type Object
     * @default {}
     */
    _layoutOptions: {},

    getLayoutOptions: function () {
        return this._layoutOptions;
    },

    setLayoutOptions: function (layoutOptions) {
        for (var option in layoutOptions) {
            this._layoutOptions[option] = layoutOptions[option];
        }
    },

    /**
     * Html outer element of the widget (if any).
     *
     * @property html
     * @type HTMLElement
     * @default null
     * @readOnly
     */
    getHtml: function () {
        Helpers.log("debug", "getHtml() method is not implemented on this widget.");
        return null;
    },

    /**
     * Absolute position of the widget on the page.
     *
     * `{x: Number, y: Number}`
     *
     * @property absolutePosition
     * @type Object
     * @readOnly
     */
    getAbsolutePosition: function () {
        if (!this.html) {
            return {x: 0, y: 0};
        }
        return Helpers.getAbsolutePosition(this.html);
    },

    /**
     * Widget width (outer HTML element).
     *
     * @property offsetWidth
     * @type Number
     * @readOnly
     */
    getOffsetWidth: function () {
        if (!this.html) {
            return 0;
        }
        return this.html.offsetWidth;
    },

    /**
     * Widget height (outer HTML element).
     *
     * @property offsetHeight
     * @type Number
     * @readOnly
     */
    getOffsetHeight: function () {
        if (!this.html) {
            return 0;
        }
        return this.html.offsetHeight;
    },

    // ====== Private properties ======

    /**
     * Object containing references to the widget HTML elements
     *
     * @property __html
     * @type Object
     * @private
     */
    __html: {},      // HTML Elements

    //////////////////////////////////////////
    // Methods                              //
    //////////////////////////////////////////

    // ====== Public methods ======

    /**
     * Display the widget (equivalent to widget.visible = true).
     *
     * @method show
     */
    show: function () {
        this.visible = true;
    },

    /**
     * DHide the widget (equivalent to widget.visible = false).
     *
     * @method hide
     */
    hide: function () {
        this.visible = false;
    },

    /**
     * Detache the widget from its parent.
     *
     * @method unparent
     */
    unparent: function () {
        if (this.parent) {
            this.parent.removeChild(this);
        } else if (this.html && this.html.parentNode) {
            this.html.parentNode.removeChild(this.html);
        }
    },

    /**
     * Destroy the widget.
     *
     * @method destroy
     */
    destroy: function () {
        this.$super();
        this.unparent();
        delete _widgets[this.name];
    },

    /**
     * Add a class to the outer HTML element of the widget.
     *
     * @method addClass
     * @param {String} className The class to add.
     */
    addClass: function (className) {
        if (!this.html) {
            return;
        }
        var classes = this.html.className.split(" ");
        if (classes.indexOf(className) < 0) {
            classes.push(className);
        }
        this.html.className = classes.join(" ");
    },

    /**
     * Remove a class from the outer HTML element of the widget.
     *
     * @method removeClass
     * @param {String} className The class to remove.
     */
    removeClass: function (className) {
        if (!this.html) {
            return;
        }
        var classes = this.html.className.split(" ");
        var index = classes.indexOf(className);
        if (index >= 0) {
            classes.splice(index, 1);
        }
        this.html.className = classes.join(" ");
    },

    // ====== Private methods ======

    /**
     * Build the widget HTML.
     *
     * @method _buildHtml
     * @private
     */
    _buildHtml: function () {
        Helpers.log("debug", "_buildHtml() method not implemented on this widget.");
    },

    /**
     * Called when the visibility changes.
     *
     * @method _visibilityChanged
     * @private
     * @param {Boolean} visibility Current visibility state (otptional, defaut=this.visible)
     */
    _visibilityChanged: function (visibility) {
        visibility = (visibility !== undefined) ? visibility : this.visible;
        if (visibility && this.visible) {
            this._callCallbacks("show");
        } else {
            this._callCallbacks("hide");
        }
    },

    //////////////////////////////////////////
    // Internal Events Callbacks            //
    //////////////////////////////////////////

    /**
     * Called when the context menu should be displayed.
     *
     * @method __onContextMenu
     * @private
     * @param event
     */
    __onContextMenu: function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (this.contextMenuName) {
            this.contextMenu.popupXY(event.pageX, event.pageY);
        }
    },

    /**
     * Called when the locale is changed.
     *
     * @method __onLocaleChanged
     * @private
     */
    __onLocaleChanged: function () {
        // Update lazy strings...
        for (var prop in this) {
            if (this[prop] instanceof Stone.LazyString) {
                this[prop] = this[prop];
            }
        }
    }
});

/*
 * Get a widget.
 *
 * @method getWidget
 * @param {String} name The widget name.
 *
 * @return {Widget} The widget or null.
 */
Widget.getWidget = function (name) {
    if (_widgets[name] !== undefined) {
        return _widgets[name];
    }
    return null;
};

Widget.e_parent = null;

/*
 * Insert a widget in the DOM.
 *
 * method domInsert
 * @param {photonui.Widget} widget The widget to insert.
 * @param {HTMLElement} element The DOM node or its id (optional, default=Widget.e_parent)
 */
Widget.domInsert = function (widget, element) {
    element = element || Widget.e_parent || document.getElementsByTagName("body")[0];
    if (typeof(element) == "string") {
        element = document.getElementById(element);
    }
    element.appendChild(widget.html);
};

module.exports = Widget;

},{"./base.js":10,"./container/popupwindow.js":14,"./helpers.js":16,"stonejs":7,"uuid":9}]},{},[1]);
