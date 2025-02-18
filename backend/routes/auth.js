const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const router = express.Router();


// create a user using: POST "/api/auth/createuser". No login required

router.post('/createuser', [
    body('name','Enter valid name').isLength({min:3}),
    body('password','Enter valid password').isLength({min:5}),
    body('email','Enter valid email').isEmail(),
] , async (req, res)=>{

// If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

// check whether the user with this email exist already
try {



let user = await User.findOne({email: req.body.email});

if(user){
  return res.status(400).json({error: "sorry a user with this email exists"})
}
    user = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      })
      
      res.json(user)
    } catch (error){
      console.error(error.message);
      res.status(500).send("some error occuried");

    }
  


})

module.exports  = router