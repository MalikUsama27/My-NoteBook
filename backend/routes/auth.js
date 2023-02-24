const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "You can say me Developer";

// ROUTER 1: Create a User using: POST "/api/auth/createuser". Dosen't require auth
router.post('/createuser', [
  body('name', 'Entre a valid name ').isLength({ min: 4 }),
  body('email', 'Entre a valid Email').isEmail(),
  body('password', 'Password must be 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //check whether the user with this email exists already 
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return req.status(400).json({ error: "Sorry Email is Already Exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    //creat a User
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data = {
      user: {
        id: user.id,
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken })
  } catch (error) {
    console.error(error.message);
    res.status(500);
  }
})


// ROUTER 2: Login a User using: POST "/api/auth/login". 
router.post('/login', [
  body('email', 'Entre a valid Email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success=false;
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email,password}=req.body;
  try {
    let user= await User.findOne({email});
    if(!user){
      return res.status(400).json({error :"Please login with Correct Data"});
    }
    const passwordCompare= await bcrypt.compare(password,user.password);
    if(!passwordCompare){
      success=false;
      return res.status(400).json({success, error :"Please login with Correct Data"});
    }
    const data = {
      user: {
        id: user.id,
      }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
    success=true;
    res.json({success, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internel Server Error"); 
  }
});
// ROUTER 3: Get Login  User Detail using: POST "/api/auth/getuser". Login required
router.post('/getuser',fetchuser,async (req, res) => {
try {
  userId=req.user.id;
  const user=await User.findById(userId).select("-password");
  res.send(user)
} catch (error) {
  console.error(error.message);
    res.status(500).send("Internel Server Error"); 
}
});
module.exports = router