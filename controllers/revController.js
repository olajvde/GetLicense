const Reviewer = require('../models/revModel');
const jwt = require('jsonwebtoken');
const { create } = require('../models/revModel');

//handle errors 😡😡😡
const HandleErrors = (err) =>{
    console.log(err.message, err.code)

    let errors = { username: '', password: ''};

    //handling incorrect username 🤮🤮
    if (err.message === 'Incorrect Username'){
        errors.username = 'That Username is not registered Boss 😐'
    }

    //handling incorrect password 🤢🤢🤢
    if (err.message === 'Incorrect Password'){
        errors.password = 'Incorrect Password dear 😒'
    }

    //duplicate error(too handle unique properties)



    //validation errors
    if(err.message.includes('reviewer validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        });
    }

    return errors
}





//define token life and secret 😱😱
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) =>{
    return jwt.sign({ id}, 'Reviewer Secrett', {
        expiresIn: maxAge
    })
}


//for reviewer register page
module.exports.reviewerReg_get = (req, res) =>{
    res.render('revRegister')
}

//for reviewer register page post

module.exports.reviewerReg_post = async (req, res) =>{
    const { fName, username, password } = req.body

    try{
        const reviewer = await Reviewer.create({username, fName, password});
        const token = createToken(reviewer._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({reviewer: reviewer._id})
    }
    catch(err){
        const errors = HandleErrors(err);
        res.status(400).json({errors})
    }
}


// get reviewer Login
module.exports.reviewerLogin_get = (req, res) =>{
    res.render('revLogin');
   
}

module.exports.reviewerLogin_post = async (req, res)=>{
    const { username , password } = req.body

    try{
        const reviewer = await Reviewer.login(username, password);
        const token = createToken(reviewer._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({reviewer: reviewer._id})
    }
    catch(err){
        const errors = HandleErrors(err); 
        res.status(400).json({errors})
    }
}

module.exports.revLogout = (req, res) =>{
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/reviewer/revLogin');
    
}