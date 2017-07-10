const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

require('dotenv').config();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: "GET,PUT,POST,DELETE",
  preflightContinue: false
}));

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN)
//   res.header('Access-Control-Allow-Credentials', true)
//   res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
//   res.header('Access-Control-Allow-Headers', 'Content-Type')
//   next();
// });

const users = require('./api/users');
const peaks = require('./api/peaks');
const ranges = require('./api/ranges');
const auth = require('./auth/index');
const authMiddleware = require('./auth/middleware');



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/users', users);
app.use('/api/v1/peaks', peaks);
app.use('/api/v1/ranges', ranges);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
