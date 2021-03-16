var express = require('express');
var router = express.Router();
const multer = require('multer')
const Process = require('../models/applicationModel');
const { requireAuth, checkApplicant } = require('../middleware/authMiddleware')



var storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "./public/images/");
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  });
  
  var upload = multer({ storage: storage });

/* GET users listing. */
router.get('/', requireAuth,checkApplicant, (req, res) =>{
  Process.find((err,docs) =>{
    if(!err){
      res.render('process', {process:docs})
    }else{
      res.send(err)
    }
  })
    
})

router.post('/', upload.single("apImage") ,async(req, res, next)=>{
    const process = new Process({
        fName : req.body.fName,
        lName : req.body.lName,
        email : req.body.email,
        age : req.body.age,
        address: req.body.address,
        apImage: req.file.originalname
    });

    try{
        const newProcess = await process.save();
        next()
        res.send('License Processing')

        console.log('process started')
    }

    catch(err){
        res.send('You cant send an application twice')
    }

})

module.exports = router;
