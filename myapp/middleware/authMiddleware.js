const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuthUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token){
      jwt.verify(token, 'a warm cup of tea in a warm afternoon', async (err, decodedToken) => {
        if (err){
          console.log("error hase been made");
        }
        else {
          let user = await User.findById(decodedToken.id);
          //console.log(user.role);
          if (user.role === 'user') {
            next();
          } else {
            res.status(401).send("errorssssssss");
          }
        }
      })
    }
    else {
      res.status(402).send("errors");
    }
}

const requireAuthAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token){
      jwt.verify(token, 'a warm cup of tea in a warm afternoon', async (err, decodedToken) => {
        if (err){
          console.log("error hase been made");
        }
        else {
          let user = await User.findById(decodedToken.id);
          //console.log(user.role);
          if (user.role === 'admin') {
            next();
          } else {
            res.status(401).send("errorts");
          }
        }
      })
    }
    else {
      res.status(401).send("error");
    }
}

const requireAuthSuperAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token){
      jwt.verify(token, 'a warm cup of tea in a warm afternoon', async (err, decodedToken) => {
        if (err){
          console.log("error hase been made");
        }
        else {
          let user = await User.findById(decodedToken.id);
          //console.log(user.role);
          if (user.role === 'super admin') {
            next();
          } else {
            res.status(401).send("error");
          }
        }
      })
    }
    else {
      res.status(401).send("error");
    }
}

module.exports = {requireAuthUser, requireAuthAdmin, requireAuthSuperAdmin};