const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/', async(req, res) => {
    try{
        res.cookie('jwt', '', {maxAge: 1});
        res.redirect('/'); 
    }
    catch(e){
        console.log(e);
        res.status(401).send(err)
    }
    
})

module.exports = router;