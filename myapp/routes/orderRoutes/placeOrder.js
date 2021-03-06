const express = require('express');
const router = express.Router();
const Order = require('../../models/order');

// router.post('/', (req, res) => {
//     const order = new Order(req.body);
//     order.save()
//       .then(result => {
//         res.json(result);
//         console.log(result);
//       })
//       .catch(err => res.status(400).send(err));
// })
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    const result = await order.save();
    res.json(result);
    console.log(result);
  }
  catch (err) {
    res.status(400).send(err);
  }
})

module.exports = router;