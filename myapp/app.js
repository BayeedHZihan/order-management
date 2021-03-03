require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const axios = require('axios');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Product = require('./models/product');
const Order = require('./models/order');

const {requireAuthUser, requireAuthAdmin, requireAuthSuperAdmin} = require('./middleware/authMiddleware');

const indexRouter = require('./routes/index');
//const usersRouter = require('./routes/users');

const app = express();

const dbURI = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.uv0hb.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;
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



// AUTH MIDDLEWARE
// const requireAuthUser = (req, res, next) => {
//   const token = req.cookies.jwt;
//   if (token){
//     jwt.verify(token, 'a warm cup of tea in a warm afternoon', async (err, decodedToken) => {
//       if (err){
//         console.log("error hase been made");
//       }
//       else {
//         let user = await User.findById(decodedToken.id);
//         //console.log(user.role);
//         if (user.role === 'user') {
//           next();
//         } else {
//           res.status(401).send("error");
//         }
//       }
//     })
//   }
//   else {
//     res.status(401).send("error");
//   }
// }

// const requireAuthAdmin = (req, res, next) => {
//   const token = req.cookies.jwt;
//   if (token){
//     jwt.verify(token, 'a warm cup of tea in a warm afternoon', async (err, decodedToken) => {
//       if (err){
//         console.log("error hase been made");
//       }
//       else {
//         let user = await User.findById(decodedToken.id);
//         //console.log(user.role);
//         if (user.role === 'admin') {
//           next();
//         } else {
//           res.status(401).send("error");
//         }
//       }
//     })
//   }
//   else {
//     res.status(401).send("error");
//   }
// }

// const requireAuthSuperAdmin = (req, res, next) => {
//   const token = req.cookies.jwt;
//   if (token){
//     jwt.verify(token, 'a warm cup of tea in a warm afternoon', async (err, decodedToken) => {
//       if (err){
//         console.log("error hase been made");
//       }
//       else {
//         let user = await User.findById(decodedToken.id);
//         //console.log(user.role);
//         if (user.role === 'super admin') {
//           next();
//         } else {
//           res.status(401).send("error");
//         }
//       }
//     })
//   }
//   else {
//     res.status(401).send("error");
//   }
// }




// USERS SECTION
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
    .catch(err => res.status(500).send(err));
})


app.post('/login', (req, res) => {
  const {email, password} = req.body;
  User.login(email, password)
    .then((user) => {
      const token = createToken(user._id);
      res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
      res.status(200).json({user: user._id})
    })
    .catch(err => res.status(401).send(err));
})




// PRODUCTS SECTION
app.get('/products', requireAuthUser, (req, res) => {
  Product.find()
    .then(result => res.json(result))
    .catch(err => console.log(err));
})

app.post('/products', (req, res)=>{
  const product = new Product(req.body);
  product.save()
      .then(result => {
          res.json(result);
          console.log(result);
      })
      .catch(err => {
        res.status(400).send(err);
      });
})


app.get('/generate-products', requireAuthSuperAdmin,(req, res) => {
  axios.get('https://fakestoreapi.com/products?limit=3')
    .then(result => {
      const resultData = result.data;
      for(let i=0; i<resultData.length; i++){
        const product = new Product({
          title: resultData[i].title,
          price: resultData[i].price,
          description: resultData[i].description,
          category: resultData[i].category,
          image: resultData[i].image
        });
        product.save()
          .then(result => {
              //res.json(result);
              console.log(result);
          })
          .catch(err => {
            res.status(400).send(err);
          });
      }
      console.log(result.data.length);
      res.json(result.data);
    })
    .catch(err => console.log(err));
})





// ORDERS SECTION
app.post('/orders', requireAuthUser, (req, res) => {
  const order = new Order(req.body);
  order.save()
    .then(result => {
      res.json(result);
      console.log(result);
    })
    .catch(err => res.status(400).send(err));
})

app.patch('/orders/:id', requireAuthAdmin, (req, res) => {
  const requestedKeysToUpdate = Object.keys(req.body);
  if (requestedKeysToUpdate.length!==1 || requestedKeysToUpdate[0]!=='status') {
    res.status(400).send("Bad Request");
    return;
  }
  Order.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(result => {
      if (!result) {
        return res.status(404).send();
      }
      res.send(result);
    })
    .catch(err => res.status(500).send(err));
})

app.get('/orders', requireAuthSuperAdmin, (req, res) => {
  Order.find({createdAt:{ $gte : new Date(Date.now() - (24*60*60000))}})
  .then(result => {
    console.log(result);
    res.json({"Total order in the last day" : Object.keys(result).length});
  })
  .catch(err => console.log(err));
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
