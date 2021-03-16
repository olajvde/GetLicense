
var express = require('express');
var router = express.Router();
const revController = require('../controllers/revController')
const {requireRevAuth } = require('../middleware/revMiddleware')
const Process = require('../models/applicationModel')
const Treat = require('../models/treatingModel')


router.get('/', (req, res)=>{
    res.render('reviewer')
})

//see all the unprocessed applicants

router.get('/applist', requireRevAuth,(req, res)=>{
    Process.find((err, docs) =>{
        if(!err){
            res.render('appList', {process: docs})
        }else {
            console.log('Problem de o')
        }
    })
    
})

router.get('/myTreats',requireRevAuth, (req, res)=>{
    Treat.find({ revUsername:  res.locals.reviewer.username }, (err, docs) =>{
        if(err) throw err;

        if(!docs){
            res.send('None at the moment')
        }
        else{
            res.render('myTreats', { treats: docs})
            console.log(docs)  
        }
    })

})




router.get('/revLogin', revController.reviewerLogin_get)
router.post('/revLogin', revController.reviewerLogin_post)
router.get('/revRegister', revController.reviewerReg_get)
router.post('/revRegister', revController.reviewerReg_post)
router.get('/revLogout', revController.revLogout)


//Get an applicant by ID
router.get('/:id', requireRevAuth, (req, res, next) =>{
    Process.findById(req.params.id, (err,doc)=>{
        if(!err){
            res.render('apProfile', { process: doc});
        }
    })

});

router.post('/:id', async(req, res)=>{
    
    const treat = new Treat({
        fName : req.body.fName,
        lName : req.body.lName,
        email : req.body.email,
        age : req.body.age,
        address: req.body.address,
        revUsername: req.body.revUsername
    })

    //try to save the process

    try{
        const newTreat = await treat.save();
        res.send('Treating Licence')

        console.log('Treat saved')
    }
    catch(err){
        res.send('Application already treated by another reviewer')
    }
})


module.exports = router