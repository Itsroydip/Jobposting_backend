const express = require('express');
const router = express.Router();
const User = require("../schemas/user.schema");
const Job = require("../schemas/job.schema");
const isLoggedIn = require("../middlewares/auth")
const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config()


router.get("/", async (req,res)=>{
    try {
        const jobs = await Job.find();
        return res.status(200).json(jobs);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Server error"});
    }
})

router.get("/:id", async (req,res)=>{
    try {
        const job = await Job.findById(req.params.id);
        if(!job)
            return res.status(404).json({message: "Job not found"});
        return res.status(200).json(job);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Server error"});
    }

})

router.post("/create", isLoggedIn, async (req,res)=>{
    try {
        const {company, role, salary, location, type, workmode, skills} = req.body;
        const user = await User.findOne({email: req.user.email});
        const newJob = await new Job({company, role, salary, location, type, workmode, skills, userId: user._id}).save();
        return res.status(200).json({message: "Job created successfully", id: newJob._id});
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Server error"})
    }

})

router.put("/:id", isLoggedIn, async (req,res)=>{
    try {
        const {company, role, salary, location, type, workmode, skills} = req.body;
        const user = await User.findOne({email: req.user.email});
        const job = await Job.findOne({_id: req.params.id, userId: user._id});

        if(!job)
            return res.status(400).json({message: "Job not found"});
    
        job.company = company;
        job.role = role;
        job.salary = salary;
        job.location = location;
        job.type = type;
        job.workmode = workmode;
        job.skills = skills;  
        await job.save();      
        return res.status(200).json({message: "Job updated successfully"});

    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Server error"})
    }

})

router.delete("/:id", isLoggedIn, async (req,res)=>{
    try {
        const user = await User.findOne({email: req.user.email});
        const job = await Job.findOne({_id: req.params.id, userId: user._id});

        if(!job)
            return res.status(400).json({message: "Job not found"});
  
        await job.deleteOne({_id: req.params.id})      
        return res.status(200).json({message: "Job deleted successfully"});

    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Server error"})
    }

})

module.exports = router; 