const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.delete('/:id', (req, res) => {
    const id = req.params.id;
  
    User.findByIdAndDelete(id)
    .then(result =>{
        res.json(result);
    })
    .catch(err => {
      res.status(400).send(err);
    });
})

module.exports = router;