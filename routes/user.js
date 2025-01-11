const express = require('express');
const router = express.Router();
const User = require("../schemas/user.schema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config()

// sign up ---> Input user credentials ----> look for existing user ----> If user exists ----> Tell them email
// already exists ----> If not ----> Create new user in Mongodb -----> send back jwt token

router.post("/signup", async(req,res)=>{
    try{
        const {email,password,name,phone} = req.body;
        const isUserExist = await User.findOne({email});

        if(isUserExist){
            res.status(400).json({message: "Email already exists"});
            return
        }
        else{
            const hashedPassword = bcrypt.hashSync(password,10);
            const newUser = await new User({email, password: hashedPassword, name, phone}).save();
            const token = jwt.sign({email},process.env.JWT_SECRET);
            return res.status(200).json({message: "User created successfully", token, id:newUser._id})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Server error"})
    }
})

router.post("/signin", async(req,res)=>{
    try {
        const {email, password} = req.body;
        const isUserExist = await User.findOne({email});
        console.log(isUserExist)

        if(!isUserExist){
            res.status(400).json({message: "Invalid email or password!"})
            return;
        }
        else{
            const isPasswordCorrect = await bcrypt.compare(password, isUserExist.password);
            console.log(isPasswordCorrect)

            if(!isPasswordCorrect){
                res.status(400).json({message:"Invalid email or password"})
                return;
            }
            const token = jwt.sign({email},process.env.JWT_SECRET);
            res.status(200).json({message:"Login successfull", token, id:isUserExist._id})

        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Server error"})
    }
})

module.exports = router; 