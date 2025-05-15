var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//express-ejs-layouts de custom layout co dinh va thay doi noi dung trong <%- body %>
var expressLayouts = require('express-ejs-layouts');

//goi cac Router
var LienHe = require('./routes/HomePage/lienHe.js');
var paymentRouter=require('./routes/HomePage/home.js');
var homeRouter = require('./routes/HomePage/home'); // Import router cho trang chủ

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//su dung expresslayouts
app.use(expressLayouts);

// Chỉ định layout mặc định
app.set('layout', 'Layout/layout');

app.use('/lienhe', LienHe);
app.use('/pay', paymentRouter);
app.use('/', homeRouter); // Định nghĩa route cho đường dẫn "/"

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
  res.render('error', { title: 'Lỗi' });
  
});

module.exports = app;
