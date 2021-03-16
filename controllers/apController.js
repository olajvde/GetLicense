const { JsonWebTokenError } = require('jsonwebtoken')
const Applicant = require('../models/apModel')
const jwt = require('jsonWebToken')
const multer = require('multer')

//handle errors
const HandleErrors = (err) =>{
    console.log(err.message, err.code)    

    let errors = { email: '', password: ''};

        // handling incorrect email for login page coming from the model too
    if (err.message === 'Incorrect Email'){
        errors.email = 'That Email is not registered'
    }

    // handling incorrect password for login page coming from the model too
    if (err.message === 'Incorrect Password'){
        errors.password = 'That Password is incorrect'
    }


    //duplicate error(to handle Unique properties)
    if(err.code === 11000){
        errors.email = 'That Email is already registered';
        return errors;
    }

    //validation errors
    if(err.message.includes('applicant validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        });
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) =>{
    return jwt.sign({ id}, 'Applicant Secrett', {
        expiresIn: maxAge
    })
}



//for Applicant register page
module.exports.register_get = (req, res) =>{
    res.render('apRegister')
}

//for Applicant register page post
module.exports.register_post = async (req, res) =>{
   
    
    const { email, password, fName, lName} = req.body

    try{
      
      const applicant = await Applicant.create({ email, password, fName, lName });
      const token = createToken(applicant._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
      res.status(201).json({applicant: applicant._id})
        	
    }
    catch(err){
        const errors = HandleErrors(err)
        res.status(400).json({ errors })
    }
}



module.exports.login_get = (req, res) =>{
    res.render('apLogin')
}
module.exports.login_post = async (req, res) =>{
    const { email, password} = req.body

    try{
        // the login function is coming from the static method in the model
        const applicant = await Applicant.login(email, password);
        const token = createToken(applicant._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({applicant: applicant._id})
    }
    catch(err){
        const errors = HandleErrors(err); 
        res.status(400).json({errors})
    }
}

module.exports.logout = (req, res) =>{
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/userauth/aplogin');
}