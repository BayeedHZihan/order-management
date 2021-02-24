const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const bodyParser = require('body-parser');
const User = require('./models/user');

const indexRouter = require('./routes/index');
//const usersRouter = require('./routes/users');

const app = express();

const dbURI = 'mongodb+srv://bayeed123:test1234@cluster0.uv0hb.mongodb.net/orderingDb?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser:true, useUnifiedTopology:true})
  .then((result) => {
    app.listen(5000);
    console.log('Connected to db');
  })
  .catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(logger('dev'));
//app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', indexRouter);
//app.use('/users', usersRouter);



app.get('/users', (req, res) => {
  User.find()
    .then((result) => res.json(result))
    .catch(err => console.log(err));
})


app.post('/users', (req, res)=>{
  const user = new User(req.body);
  user.save()
      .then(result => {
          res.json(result);
          console.log(result);
      })
      .catch(err => {
        res.status(400).send(err);
      });
})

app.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  User.findByIdAndDelete(id)
  .then(result =>{
      res.json(result);
  })
  .catch(err => {
    res.status(400).send(err);
  });
})


app.patch('/users/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(result => {
      if (!result) {
        return res.status(404).send();
      }
      res.send(result);
    })
    .catch(err => res.status(500). send(err));
})









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
