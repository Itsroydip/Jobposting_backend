const express = require('express');
const app = express();
const env = require('dotenv');
env.config();
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
const userRoutes = require('./routes/user');
const jobRoutes = require('./routes/job')
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(cors(
    {
        origin: '*'
    }
))

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);


app.get("/",(req,res)=>{
    res.send("Hello World!!!")
})

app.listen(PORT,()=>{
    console.log("Listening at port 3000....")
    mongoose.connect(MONGO_URI)
    .then(()=>{
        console.log("Connected to MongoDB.......")
    })
    .catch((err)=>{
        console.log(err)
    })
})