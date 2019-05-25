
// require our dependencies
var express        = require('express');
var bodyParser     = require('body-parser');
var app            = express();
var port           = process.env.PORT || 9000;

// use body parser
app.use(bodyParser.json());

// route our app
var router = require('./app/routes');
app.use('/', router);

// start the server
app.listen(port, function() {
  console.log('app started');
});
