const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const router = express.Router();

router.get('/' , (req, res)=>{
    res.json([]) 
})

module.exports  = router