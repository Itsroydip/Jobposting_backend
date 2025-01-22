const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
    },
    salary: {
        type: String,  
        default: "Not Disclosed"
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "Fulltime"
    },
    workmode: {
        type: String,
        default: "Office"
    },
    skills: {
        type: [String],
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    aboutCompany: {
        type: String,
        required: true
    },
    additionalInfo: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("Job", schema);
