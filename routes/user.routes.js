const express = require("express");
const router = express.Router();
// this is from express validator documentation
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 
const JWT_SECRET = process.env.JWT_SECRET;  

router.get('/register', (req, res) => {
    res.render('register');
})


// register page
router.post('/register',
    body('email').trim().isEmail().isLength({min: 13}),
    body('password').trim().isLength({ min: 5 }),
    body('username').trim().isLength({ min: 3}),
    async (req, res) => {

        const errors = validationResult(req);
        
    // console.log(req.body)
        // res.send("user registered")
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data'
           });
        } 

        // to store into database
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        })

        res.json(newUser)
       
})

// login
router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login',
     body('email').trim().isEmail().isLength({min: 13}),
     body('password').trim().isLength({ min: 5 }),
        
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({
                errors:array(),
                message: "invalid data"
            })

        }
        const { email, password } = req.body;
        
        const user = await userModel.findOne({
            email: email
        });
        if (!user) {
            return res.status(400).json({
                message: "email or password is incorrect"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                message:"email or password is incorrect"
            })
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            username: user.username,
        }, JWT_SECRET)
        

        // the main use of cookie for storing of token in when any request browser make it will 
        // go with that cookie automatically with that request for any page it will go
        res.cookie('token', token)
        
        res.send("Logged in")
    }

)



module.exports = router;