const express = require('express');
const router = express.Router();
const Order = require('../../models/order');

router.get('/', async (req, res) => {
  try {
    const result = await Order.find();
    res.json(result);
  }
  catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
})

module.exports = router;