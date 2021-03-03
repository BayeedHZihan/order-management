const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.patch('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true})
      .then(result => {
        if (!result) {
          return res.status(404).send();
        }
        res.send(result);
      })
      .catch(err => res.status(500).send(err));
})

module.exports = router;