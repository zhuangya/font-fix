var fs = require('fs');
var spawn = require('child_process').spawn;

var express = require('express');

var responseTime = require('response-time');
var serveStatic = require('serve-static');
var multipart = require('connect-multiparty');
var mime = require('mime');

var config = require('./config');

var app = express();
var multipartMiddleware = multipart({
  uploadDir: __dirname + '/upload'
});

app.use(responseTime());
app.use(serveStatic(__dirname + '/public'));

app.set('view engine', 'jade');

app.get('/', function (req, res) {
  var indexView = {
    title: 'index'
  };
  res.render('index', indexView);
});

app.post('/', multipartMiddleware, function (req, res) {
  var font = req.files.font;
  var fontFix = spawn('./tools/font-fix.sh', [font.path]);

  fontFix.on('error', function (error) {
    console.log('error: ' + error);
  });

  fontFix.on('exit', function () {
    res.download(font.path, function (err) {
      if (err) throw err;
      fs.unlink(font.path);
    });

  });
});

app.listen(config.port || 9000);