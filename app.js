const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');

// Import Routers
const indexRouter = require('./routes/HomePage/index');
const paymentRouter = require('./routes/HomePage/pay');
const dungcuRouter = require('./routes/HomePage/dungcu');
const sachRouter = require('./routes/HomePage/sach');
const quatangRouter = require('./routes/HomePage/quatang');
const lienheRouter = require('./routes/HomePage/lienhe');
const huongdandathangRouter = require('./routes/HomePage/huongdandathang');

const app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

// Routes
app.use('/', indexRouter);
app.use('/pay', paymentRouter);
app.use('/dungcu', dungcuRouter);
app.use('/sach', sachRouter);
app.use('/quatang', quatangRouter);
app.use('/lienhe', lienheRouter);
app.use('/huongdandathang', huongdandathangRouter);

// Catch 404 and Forward to Error Handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error Handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'Lỗi' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;