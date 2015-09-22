# Wanashare - Share medias on Twitter and Facebook from Express app


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

Not implemented yet


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

Not implemented yet


## Build client libs

If you made changes in `lib_src/`, you should rebuild the `lib/wanashare.js` file:

    npm install      # only once
    npm run build


## Run demo server

To run the demo server, first put your own app keys in `demo/server.js` file and then run the following command:

    npm run server
