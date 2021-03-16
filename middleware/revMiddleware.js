const jwt = require('jsonwebtoken');
const Reviewer = require('../models/revModel');

const requireRevAuth = (req, res, next) =>{
    const token = req.cookies.jwt;

    //check if token exists and is verified 😑

    if(token){
        jwt.verify(token, 'Reviewer Secrett', (err, decodedToken)=>{
            if(err){
                console.log(err.message)
                res.redirect('/reviewer/revLogin')
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }
    else{
        res.redirect('/reviewer/revLogin')
    }
}

//check current reviewer ✌

const checkReviewer = (req, res, next) =>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'Reviewer Secrett', async(err, decodedToken)=>{
            if(err){
                console.log(err.message)
                res.locals.reviewer = null;
                next()
            }
            else{
                console.log(decodedToken)
                let reviewer = await Reviewer.findById(decodedToken.id);
                res.locals.reviewer = reviewer;
                next()
            }
        })
    }
    else{
        res.locals.reviewer = null;
        next();
    }
}

module.exports = { requireRevAuth, checkReviewer };
