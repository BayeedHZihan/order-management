const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const {requireAuthSuperAdmin} = require('../../middleware/authMiddleware');

// router.get('/', (req, res) => {
//     Order.find({createdAt:{ $gte : new Date(Date.now() - (24*60*60000))}})
//     .then(result => {
//       console.log(result);
//       res.json({"Total order in the last day" : Object.keys(result).length});
//     })
//     .catch(err => console.log(err));
// })
router.get('/', async (req, res) => {
  try {
    const result = await Order.find({createdAt:{ $gte : new Date(Date.now() - (24*60*60000))}});
    //console.log(result);
    res.json(Object.keys(result).length);
  }
  catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
})

module.exports = router;