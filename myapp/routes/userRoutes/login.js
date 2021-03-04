const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../../models/user');

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'a warm cup of tea in a warm afternoon', {
    expiresIn: maxAge
  });
};

// router.post('/', (req, res) => {
//     const {email, password} = req.body;
//     User.login(email, password)
//         .then((user) => {
//         const token = createToken(user._id);
//         res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
//         res.status(200).json({user: user._id})
//         })
//         .catch(err => res.status(401).send(err));
// })

router.post('/', async (req, res) => {
  try{
    const {email, password} = req.body;
    const user = await User.login(email, password);
    const token = await createToken(user._id);
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
    res.status(200).json({user: user._id});
  } catch ( err ) {
    res.status(401).send(err)
  }
  
})

module.exports = router;