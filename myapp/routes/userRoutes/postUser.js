const express = require('express');
const router = express.Router();
const User = require('../../models/user');

// router.post('/', (req, res)=>{
//     const user = new User(req.body);
//     user.save()
//         .then(result => {
//             res.json(result);
//             console.log(result);
//         })
//         .catch(err => {
//           res.status(400).send(err);
//         });
// })
router.post('/', async (req, res)=>{
  try {
    const user = new User(req.body);
    const result = await user.save();
    res.json(result);
    console.log(result);
  }
  catch (err) {
    res.status(400).send(err);
  }
})

module.exports = router;