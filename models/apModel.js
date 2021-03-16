const mongoose = require('mongoose');
const { isEmail } = require('validator')
const bcrypt = require('bcryptjs')

const apSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true , 'Please Enter an Email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Enter a valid Email']
    },
    password:{
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum six characters']
    }, 
    fName:{
        type: String,
        required: [true , 'Please Enter Your First Name'],
    },
    lName:{
        type: String,
        required: [true , 'Please Enter Your Last Name'],
    }, 
    
   
})


//hash password

apSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})



//static method to login user
apSchema.statics.login = async function(email, password) {
    const applicant = await this.findOne({ email });
    if (applicant){
     const auth =  await bcrypt.compare(password, applicant.password)

     if(auth){
         return applicant;
     }
     throw Error('Incorrect Password')
    }
    throw Error('Incorrect Email')
}

const Applicant = mongoose.model('applicant', apSchema)

module.exports = Applicant;