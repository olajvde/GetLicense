const Process = require('../models/applicationModel');
const multer = require('multer')

//get process page
module.exports.process_get = 



//post process stuff to db

module.exports.process_post = async(req, res, next)=>{
    const process = new Process({
        fName : req.body.fName,
        lName : req.body.lName,
        email : req.body.email,
        age : req.body.age,
        address: req.body.address,
        apImage: req.file.originalname
    });

    // try to save the process honey 🥰

    try{
        const newProcess = await process.save();
        next()
        res.send('License Processing')

        console.log('process started')
    }

    catch(err){
        res.send('You cant send an application twice')
    }
}
