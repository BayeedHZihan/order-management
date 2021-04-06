const express = require('express');
const axios = require('axios');
const router = express.Router();
const Product = require('../../models/product');

// router.get('/', (req, res) => {
//     axios.get('https://fakestoreapi.com/products?limit=3')
//       .then(result => {
//         const resultData = result.data;
//         for(let i=0; i<resultData.length; i++){
//           const product = new Product({
//             title: resultData[i].title,
//             price: resultData[i].price,
//             description: resultData[i].description,
//             category: resultData[i].category,
//             image: resultData[i].image
//           });
//           product.save()
//             .then(result => {
//                 //res.json(result);
//                 console.log(result);
//             })
//             .catch(err => {
//               res.status(400).send(err);
//             });
//         }
//         console.log(result.data.length);
//         res.json(result.data);
//       })
//       .catch(err => console.log(err));
// })
router.get('/', async (req, res) => {
  try {
    const result = await axios.get('https://fakestoreapi.com/products');
    const resultData = result.data;
    for(let i=0; i<resultData.length; i++){
      const product = new Product({
        title: resultData[i].title,
        price: resultData[i].price,
        description: resultData[i].description,
        category: resultData[i].category,
        image: resultData[i].image
      });
      const result = await product.save();
      console.log(result);
    }
    console.log(result.data.length);
    res.json(result.data);
  }
  catch ( err ) {
    res.status(400).send(err);
    console.log(err);
  }
})

module.exports = router;