const express = require('express');
const router = express.Router();
const Product = require('../../models/product');

router.get('/', (req, res) => {
    Product.find()
      .then(result => res.json(result))
      .catch(err => console.log(err));
  })

module.exports = router;