const jwt = require('jsonwebtoken')
const Applicant = require('../models/apModel')



const requireAuth = (req, res, next) =>{

    const token = req.cookies.jwt;

    //check if token exists and is verified

    if(token){
        jwt.verify(token, 'Applicant Secrett', (err, decodedToken)=>{
            if(err){
                console.log(err.message)
                res.redirect('/userauth/aplogin')
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }
    else{
            res.redirect('/userauth/aplogin')
    }
}

// check  current user

const checkApplicant = (req, res, next) =>{
    const token = req.cookies.jwt;
if(token){
    jwt.verify(token, 'Applicant Secrett', async (err, decodedToken)=>{
        if(err){
            console.log(err.message)
            res.locals.applicant = null;
            next()
        }else{
            console.log(decodedToken)
            let applicant = await Applicant.findById(decodedToken.id);
            res.locals.applicant = applicant;
            next();
        }
    })
}
else{
    res.locals.applicant = null;
    next();
}
}
module.exports = { requireAuth, checkApplicant };