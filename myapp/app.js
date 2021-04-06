require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const axios = require('axios');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Product = require('./models/product');
const Order = require('./models/order');

const {requireAuthUser, requireAuthAdmin, requireAuthSuperAdmin} = require('./middleware/authMiddleware');

const indexRouter = require('./routes/index');

const getUsersRouter = require('./routes/userRoutes/getUsers');
const postUserRouter = require('./routes/userRoutes/postUser');
const updateUserRouter = require('./routes/userRoutes/updateUser');
const deleteUserRouter = require('./routes/userRoutes/deleteUser');
const loginRouter = require('./routes/userRoutes/login');
const getProductsRouter = require('./routes/productRoutes/getProducts');
const postProductRouter = require('./routes/productRoutes/postProduct');
const generateProductsRouter = require('./routes/productRoutes/generateProducts');
const placeOrderRouter = require('./routes/orderRoutes/placeOrder');
const changeStatusRouter = require('./routes/orderRoutes/changeStatus');
const summaryRouter = require('./routes/orderRoutes/summary');
const getOrdersRouter = require('./routes/orderRoutes/getOrders');
const logoutRouter = require('./routes/userRoutes/logout');



const app = express();



const dbURI = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.uv0hb.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;
const connectMongo = async () => {
  await mongoose.connect(dbURI, {useNewUrlParser:true, useUnifiedTopology:true});
  app.listen(5000);
  console.log('Connected to db');
}

try {
  connectMongo();
} catch (err) {
  console.log(err);
}



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(cors());
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', indexRouter);
//app.use('/users', usersRouter);


// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'a warm cup of tea in a warm afternoon', {
    expiresIn: maxAge
  });
};



// USERS SECTION

app.use('/users', getUsersRouter);

app.use('/users', postUserRouter);

app.use('/users', deleteUserRouter);

app.use('/users', updateUserRouter);

app.use('/login', loginRouter);

app.use('/logout', logoutRouter);




// PRODUCTS SECTION

app.use('/products/view-products', getProductsRouter);

app.use('/products', postProductRouter);

app.use('/generate-products', requireAuthSuperAdmin, generateProductsRouter);





// ORDERS SECTION

app.use('/orders/change-status', requireAuthAdmin, changeStatusRouter);

app.use('/orders/summary', requireAuthSuperAdmin, summaryRouter);

app.use('/orders/place-order', requireAuthUser, placeOrderRouter);

app.use('/orders/get-orders', requireAuthAdmin, getOrdersRouter);




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
