const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const revSchema = new mongoose.Schema({
    fName:{
        type: String,
        required: [true , 'Please Enter Your First Name'],
    },
    username:{
        type: String,
        required: [true, 'Enter Your Preferred Username'],
        unique: true,
    },
    password:{
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum six characters']
    }, 

})

// hash password
revSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//static method to log in reviewer

revSchema.statics.login = async function(username, password){
    const reviewer = await this.findOne({ username });
    if(reviewer){
        const auth = await bcrypt.compare(password, reviewer.password)

        if(auth){
            return reviewer;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Username');
}

const Reviewer = mongoose.model('reviewer', revSchema);

module.exports = Reviewer;