const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        lowercase: true
    },
    fName:{
        type: String,
        required: true 
    },
    lName:{
        type: String,
        required: true 
    },
    age:{
            type: Number,
            required: true
        }, 
    address:{
                type: String,
                required: true,
            }, 
    apImage:{
        type : String,
            }
    
})

const Process = mongoose.model('process', processSchema)

module.exports = Process;