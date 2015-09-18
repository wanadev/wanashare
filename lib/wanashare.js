(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wanashare = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = {
    Wanashare: require("./wanashare.js"),
    Twitter: require("./twitter.js")
}

},{"./twitter.js":2,"./wanashare.js":3}],2:[function(require,module,exports){
"use strict";

var Pipe = require("flozz-pipejs");
var ajax = require("please-ajax");

var Wanashare = require("./wanashare.js");

var Twitter = Wanashare.$extend({

    _name: "twitter",

    isConnected: function () {
        return false; // FIXME
    },

    _connect: function (callback) {
        var _this = this;

        this.$data.tokens = {
            // TODO
        };

        var requestToken = null;
        var requestTokenSecret = null;

        var p = new Pipe(
            function () {
                console.log("requestToken: " + requestToken); // FIXME
                console.log("requestTokenSecret: " + requestTokenSecret); // FIXME
                callback();
            },
            function (error) {
                callback(error || "connection-error");
            }
        );

        p.add(function (pipe) {
            ajax.get(_this._prefix + _this._name + "/get-request-token", {
                success: function (response) {
                    if (response.data.token && response.data.token_secret) {
                        requestToken = response.data.token;
                        requestTokenSecret = response.data.token_secret;
                        pipe.done();
                    } else {
                        pipe.error("request-token-error");
                    }
                },
                error: pipe.error
            });
        });

        p.run();
    },

    _send: function (message, media, callback) {
        // TODO
    }
});

module.exports = Twitter;

},{"./wanashare.js":3,"flozz-pipejs":6,"please-ajax":7}],3:[function(require,module,exports){
(function (global){
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
                            _this._saveTokens();
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"abitbol":4}],4:[function(require,module,exports){
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

},{"./annotation.js":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
/*
 * Copyright (c) 2014, Fabien LOISON <http://www.flozz.fr/>
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


/**
 * Asynchronous job queue.
 *
 * @class Pipe
 * @constructor
 * @param {Function} successCallback Called when everything is done successfully
 *                                   (optional).
 * @param {Function} errorCallback Called when something goes wrong (optional).
 * @param {Function} progressCallback Called each time a task is done (optional,
 *                                    callback: `function(progress){}` where
 *                                    progress is a number between 0 and 1).
 */
var Pipe = function(successCallback, errorCallback, progressCallback) {
    this._jobs = [];
    this.successCallback = successCallback || function(){};
    this.errorCallback = errorCallback || function(){};
    this.progressCallback = progressCallback || function(){};
    this._stopped = true;
};

/**
 * Add a job to the pipe.
 *
 * Job callback:
 *
 *     function(pipe, [optional arg]) {}
 *
 * @method add
 * @param {Function} job The job callback.
 * @param arg An optional arg that will be passed as second argument of
 *            the job function.
 */
Pipe.prototype.add = function(job, arg) {
    this._jobs.push({});
    var jobId = this._jobs.length - 1;

    this._jobs[jobId].job = job;
    this._jobs[jobId].error = this._error.bind(this);
    this._jobs[jobId].done = this._next.bind(this, jobId);
    this._jobs[jobId].args = (arg !== undefined) ? [arg] : [];
};

/**
 * Add a job for each item of the argument list.
 *
 * Job callback:
 *
 *     function(pipe, arg) {}
 *
 * @method addAll
 * @param {Function} job The job callback.
 * @param {Array} argList Argument list (each item of the list will be passed
 *                        as second argument of the job function).
 */
Pipe.prototype.addAll = function(job, argList) {
    for (var i=0 ; i<argList.length ; i++) {
        this.add(job, argList[i]);
    }
};

/**
 * Run the pipe.
 *
 * @method run
 * @param * Any argument passed to this function will be passed to
 *          the first job function.
 */
Pipe.prototype.run = function() {
    this._stopped = false;
    var args = [-1];
    if (arguments.length > 0) {
        for (var i=0 ; i<arguments.length ; i++) {
            args.push(arguments[i]);
        }
    }
    this._next.apply(this, args);
};

/**
 * Must be called if any error append in a job.
 *
 * @method _error
 * @private
 * @param * Any argument passed to this function will be passed to the
 *          errorCallback function.
 */
Pipe.prototype._error = function() {
    this._stopped = true;
    this.errorCallback.apply(this, arguments);
};

/**
 * Must be called by each jobs when they are finished.
 *
 * @method _next
 * @private
 * @param jobId The id of the job.
 * @param * Any additional argument passed to this function will be passed to the next
 *          job function or to the successCallback function if it is the last job.
 */
Pipe.prototype._next = function(jobId) {
    if (this._stopped) {
        return;
    }
    // Progress
    this.progressCallback((jobId+1) / (this._jobs.length));
    // All done
    if (jobId == this._jobs.length -1) {
        var args = [];
        if (arguments.length > 1) {
            for (var i=1 ; i<arguments.length ; i++) {
                args.push(arguments[i]);
            }
        }
        this._stopped = true;
        this.successCallback.apply(this, args);
        return;
    }
    // Next Job
    jobId++;
    var args = [this._jobs[jobId]].concat(this._jobs[jobId].args);
    if (arguments.length > 1) {
        for (var i=1 ; i<arguments.length ; i++) {
            args.push(arguments[i]);
        }
    }
    try {
        this._jobs[jobId].job.apply(this, args);
    }
    catch (error) {
        this._error(error);
    }
};

module.exports = Pipe;


// == Doc for pipe object ==

/**
 * pipe object that is passed as first parameter of each job function.
 *
 * @Class Jobs pipe object
 */
/**
 * Must be called by the job when it was sucessfully finished.
 *
 * @method done
 * @static
 * @param * Any argument passed to this function will be passed to the next
 *          job function or to the successCallback function if it is the last job.
 */
/**
 * Must be called by the job when an error occure (that will
 * stop the pipe and call the errorCallback function).
 *
 * @method error
 * @static
 * @param * Any argument passed to this function will be passed to the
 *          errorCallback function.
 */

},{}],7:[function(require,module,exports){
/**
 * please-ajax - A small and modern AJAX library.
 * @version v2.0.0
 * @author Dan Reeves <hey@danreev.es> (http://danreev.es/)
 * @link https://github.com/fffunction/please
 * @license MIT
 */
(function () {
    'use strict';

    var exports = {};

    var parse = function (req) {
        var result;
        try {
            result = JSON.parse(req.responseText);
        } catch (e) {
            result = req.responseText;
        }
        return {data:result, request:req};
    };

    var xhr = function (type, url, data, opts) {
        var options = {
            fileForm: opts.fileForm || false,
            promise: opts.promise || false,
            headers: opts.headers || {},
            success: opts.success || function () {},
            error: opts.error || function () {},
            loadstart: opts.loadstart || function () {},
            progress: opts.progress || function () {},
            load: opts.load || function () {}
        },
        request,
        isString = typeof data === 'string',
        isJSON = false;
        if (isString) {
            try {
                isJSON = !!JSON.parse(data);
            } catch (e) {
                isJSON = false;
            }
        }
        // IE9 Form Upload
        if (options.fileForm && isString) {
            var iframe  = document.createElement('iframe');
            request = {
                readyState: false,
                status: false,
                onload: function () {},
                onerror: function () {},
                send: function () {
                    iframe.style.display = 'none';
                    iframe.name = iframe.id = 'iframe'+Math.ceil(Math.random() * 1e5).toString();
                    document.body.appendChild(iframe);
                    iframe.addEventListener('load', function () {
                        var result = this.responseText = iframe.contentDocument.body.innerHTML;
                        if (result.toString().match(/^20\d\b/)) { // 20x status code
                            this.readyState = 4;
                            this.status = 200;
                            options.success();
                            this.onload();
                        } else {
                            options.error();
                            this.onerror();
                        }
                        document.body.removeChild(iframe);
                        options.fileForm.action = options.fileForm.action.slice(options.fileForm.action.search(/\?ie9/), 4);
                    }.bind(this));
                    if (options.fileForm.action.search(/\?ie9/) < 0) {
                        options.fileForm.action = (options.fileForm.action) ? options.fileForm.action + '?ie9' : '?ie9';
                    }
                    options.fileForm.target = iframe.id;
                    options.fileForm.submit();
                    options.loadstart();
                }
            };
        } else {
            var XHR = window.XMLHttpRequest || ActiveXObject;
            request = new XHR('MSXML2.XMLHTTP.3.0');
            request.open(type, url, true);
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if (isString) {
                if (isJSON) request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                else request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
            }
            if (!!request.upload) {
                request.upload.addEventListener('loadstart', options.loadstart, false);
                request.upload.addEventListener('progress', options.progress, false);
                request.upload.addEventListener('load', options.load, false);
            }
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status >= 200 && request.status < 300) {
                        options.success(parse(request));
                    } else {
                        options.error(parse(request));
                    }
                }
            };
        }
        for (var header in options.headers) {
            if (options.headers.hasOwnProperty(header)) {
                request.setRequestHeader(header, options.headers[header]);
            }
        }
        if (!!window.Promise && options.promise) {
            return new Promise(function(resolve, reject) {
                request.onload = function() {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(request.response);
                    }
                    else {
                        reject(Error(request.statusText));
                    }
                };

                request.onerror = function() {
                    reject(Error('Network Error'));
                };

                request.send(data);
            });
        } else {
            request.send(data);
        }
        return request;
    };

    exports['get'] = function get (url, opts) {
        var options = opts || {};
        return xhr('GET', url, false, options);
    };

    exports['put'] = function put (url, data, opts) {
        var options = opts || {};
        return xhr('PUT', url, data, options);
    };

    exports['patch'] = function patch (url, data, opts) {
        var options = opts || {};
        return xhr('PATCH', url, data, options);
    };

    exports['post'] = function post (url, data, opts) {
        var options = opts || {};
        return xhr('POST', url, data, options);
    };

    exports['del'] = exports['delete'] = function del (url, opts) {
        var options = opts || {};
        return xhr('DELETE', url, false, options);
    };

    if (typeof define === 'function' && define['amd']) {
      define(function() { return exports; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = exports;
    } else if (typeof this !== 'undefined') {
      this['please'] = exports;
    }

}).call(this);

},{}]},{},[1])(1)
});