/* Description:
 *   Loads content from Sean Martell's Mozilla logo page.
 *
 * Dependencies:
 *   none
 *
 * Author:
 *    mythmon
 */

var cheerio = require('cheerio');

module.exports = function(corsica) {

  var req = corsica.request;
  var youtube_re = RegExp('screenshots.firefox.com/.*');

  corsica.on('content', function(msg) {
    if (!('url' in msg)) {
      return msg;
    }

    if (match = msg.url.match(youtube_re)) {
      return new Promise(function (resolve, reject) {
        og(msg.url, function (og) {
          msg.type = 'html';
          msg.content = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      * {
        box-sizing: border-box;
      }
      html {
        height: 100%;
      }
      body {
        background: #000;
        display: flex;
        flex-direction: column;
        height: 100vh;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        margin: 0;
      }
      img {
        flex: 1;
        display: block;
        object-fit: contain;
        margin: 2vh;
        max-width: 99vw;
      }
      footer {
        background: #222;
        width: 100%;
        color: #eee;
        font-size: 2.5vh;
        padding: 1em 2em;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .logo {
        display: flex;
        flex-direction: row;
        color: #bbb;
        margin-right: 2em;
        padding-right: 2em;
        align-items: center;
        line-height: .9;
        border-right: 1px dotted currentColor;
      }
      .logo svg {
        height: 1.5em;
        margin-right: .5em;
      }
      .logo path {
        fill: currentColor;
      }
    </style>
  </head>
  <body>
    <img src="${og.image}">
    <footer>
      <div class="logo">
        <svg viewBox="0 0 32 32">
          <path d="M8 2a4 4 0 0 0-4 4h4V2zm12 0h-4v4h4V2zm8 0v4h4a4 4 0 0 0-4-4zM14 2h-4v4h4V2zm12 0h-4v4h4V2zm2 10h4V8h-4v4zm0 12a4 4 0 0 0 4-4h-4v4zm0-6h4v-4h-4v4zm-.882-4.334a4 4 0 0 0-5.57-.984l-7.67 5.662-3.936-2.76c.031-.193.05-.388.058-.584a4.976 4.976 0 0 0-2-3.978V8H4v2.1a5 5 0 1 0 3.916 8.948l2.484 1.738-2.8 1.964a4.988 4.988 0 1 0 2.3 3.266l17.218-12.35zM5 17.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 12a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm10.8-4.858l6.034 4.6a4 4 0 0 0 5.57-.984L19.28 22.2l-3.48 2.442z" fill="#4D4D4D"/>
        </svg>
        <div>
          <b>Firefox</b><br>
          Screenshots
        </div>
      </div>
      <div>${og.description}</div>
    </footer>
  </body>
</html>
          `;
          resolve(msg);
        });
      });
    }

    return msg;
  });
};


function og(url, cb) {
  req(url, function (error, res, body) {
    var $ = cheerio.load(body);
    let og = $('meta[property^="og:"]');
    og = Array.from(og).reduce((obj, el) => {
      obj[el.attribs.property.replace('og:', '')] = el.attribs.content;
      return obj;
    }, {});
    cb(og);
  });
}
