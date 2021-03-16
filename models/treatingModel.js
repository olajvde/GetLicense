const mongoose = require('mongoose');

const TreatSchema = new mongoose.Schema({

    revUsername:{
        type: String, 
        required: true
    }, 
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
            }
    
})

const Treat = mongoose.model('treat', TreatSchema)

module.exports = Treat;