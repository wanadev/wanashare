# Wanashare - Share medias on Twitter and Facebook

[![NPM Version](http://img.shields.io/npm/v/wanashare.svg?style=flat)](https://www.npmjs.com/package/wanashare)
[![License](http://img.shields.io/npm/l/wanashare.svg?style=flat)](https://github.com/wanadev/wanashare/blob/master/LICENSE)

Wanashare allows you to upload a photo (with a status message) on **Twitter** and **Facebook**. It is intended to be used by client-side web applications. The server-side part is still required but is minimalistic (no session, no cookies needed) and can be integrated into any **Express.js** app. The access tokens are stored in the user's `localStorage` and are never saved on the server.


## Getting started

Folders:

    app/      -- The server side part (to use in any Express app)
    lib/      -- The client side part
    lib_src/  -- The client side part (source code, need to be built with browserify)
    demo/     -- A working demo (see the "Run demo server" section)

### Server Side

This lib require **Node.js** and **Express.js** for the server part.

#### Twitter

```javascript
var express = require("express");
var Twitter = require("wanashare").Twitter;

var app = express();
new Twitter(app, "Twitter app's Consumer Key", "Twitter app's Consumer Secret");
var server = app.listen(3000);
```

#### Facebook

```javascript
var express = require("express");
var Facebook = require("wanashare").Facebook;

var app = express();
new Facebook(app, "Facebook app's ID", "Facebook app's Secret");
var server = app.listen(3000);
```


### Client Side

#### Twitter

```html
<script src="lib/wanashare.js"></script>
<script>
    var twitter = new wanashare.Twitter();
    twitter.share(
        "Message",   // The tweet content
        photo,       // The image to share (Blob or data64URI string)
        function (error) {
            if (error) {
                alert("An error occured!");
            } else {
                alert("Done :D");
            }
        }
    });
</script>
```

#### Facebook

```html
<script src="lib/wanashare.js"></script>
<script>
    var fb = new wanashare.Facebook();
    fb.share(
        "Message",   // The tweet content
        photo,       // The image to share (Blob or data64URI string)
        function (error) {
            if (error) {
                alert("An error occured!");
            } else {
                alert("Done :D");
            }
        }
    });
</script>
```


## Build client libs

If you made changes in `lib_src/`, you should rebuild the `lib/wanashare.js` file:

    npm install      # only once
    npm run build


## Run demo server

To run the demo server, first put your own app keys in `demo/server.js` file and then run the following command:

    npm run server

## Changelog

* **0.2.1**: Minor fixes in package.json and README.md
* **0.2.0**: Facebook support
* **0.1.0**: Initial release, Twitter support

