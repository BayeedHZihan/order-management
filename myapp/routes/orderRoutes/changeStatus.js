const express = require('express');
const router = express.Router();
const Order = require('../../models/order');

router.patch('/:id', (req, res) => {
    const requestedKeysToUpdate = Object.keys(req.body);
    if (requestedKeysToUpdate.length!==1 || requestedKeysToUpdate[0]!=='status') {
      res.status(400).send("Bad Request");
      return;
    }
    Order.findByIdAndUpdate(req.params.id, req.body, {new: true})
      .then(result => {
        if (!result) {
          return res.status(404).send();
        }
        res.send(result);
      })
      .catch(err => res.status(500).send(err));
  })

module.exports = router;