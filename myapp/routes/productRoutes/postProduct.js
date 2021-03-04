const express = require('express');
const router = express.Router();
const Product = require('../../models/product');

// router.post('/', (req, res)=>{
//     const product = new Product(req.body);
//     product.save()
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
    const product = new Product(req.body);
    const result = await product.save();
    res.json(result);
    console.log(result);
  }
  catch (err) {
    res.status(400).send(err);
  }
})

module.exports = router;