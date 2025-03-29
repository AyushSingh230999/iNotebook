const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'EthicalWork';

// Route 1: create a user using: POST "/api/auth/createuser". No login required

router.post('/createuser', [
    body('name','Enter valid name').isLength({min:3}),
    body('password','Enter valid password').isLength({min:5}),
    body('email','Enter valid email').isEmail(),
] , async (req, res)=>{
  let success = false;

// If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

// check whether the user with this email exist already
try {



let user = await User.findOne({email: req.body.email});

if(user){
  return res.status(400).json({success, error: "sorry a user with this email exists"})
}
const salt = await bcrypt.genSalt(10);
const secPass = await bcrypt.hash(req.body.password, salt)
// create a new user
    user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data ={
        user:{
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      
      //res.json(user)
      success = true;
      res.json({success, authtoken})

    } catch (error){
      console.error(error.message);
      res.status(500).send("Internal server error occuried");

    }
  


})

// Route 2: create a user using: POST "/api/auth/login". No login required
router.post('/login', [
  
  body('email','Enter valid email').isEmail(),
  body('password','Password cannot be blank').exists(),
] , async (req, res)=>{
  let success = false;
  // if there are errors, return bad request and the errors
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try{
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error: "Try to login with correct data"});
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        success = false;
        return res.status(400).json({success, error: "Try to login with correct data"});
      }

      const data ={
        user:{
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authtoken})

    } catch (error){
      console.error(error.message);
      res.status(500).send("Internal server error occuried");

    }

});

// Route 3: Get logged in user detail: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res)=>{

try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password")
  res.send(user)
  
} catch (error){
  console.error(error.message);
  res.status(500).send("Internal server error occuried");

}
})

module.exports  = router