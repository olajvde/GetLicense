var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const { checkApplicant } = require('./middleware/authMiddleware')
const {checkReviewer } = require('./middleware/revMiddleware')

mongoose.connect('mongodb://localhost/licesorr', { useNewUrlParser: true, useUnifiedTopology : true, useCreateIndex: true  });

const db = mongoose.connection;
db.on('error', (error)=> console.log(error));
db.once('open', ()=> console.log('Database connected'))


var indexRouter = require('./routes/index');
var processRouter = require('./routes/process');
var authRouter =  require('./routes/authRoutes');
var reviewerRoutes = require('./routes/reviewerRoute')



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.get('*', checkApplicant);
app.use('/' ,checkApplicant, indexRouter);
app.use('/apProcess',checkApplicant,processRouter);
app.use('/userAuth' ,checkApplicant, authRouter);
app.use('/reviewer', checkReviewer,reviewerRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
