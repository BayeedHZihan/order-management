const express = require('express');
const router = express.Router();
const User = require('../../models/user');

// router.get('/', (req, res) => {
//     User.find()
//         .then((result) => res.json(result))
//         .catch(err => console.log(err));
// })

router.get('/', async (req, res) => {
    try {
        const result = await User.find();
        res.json(result);
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;