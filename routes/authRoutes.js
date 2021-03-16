const express = require('express');
const router = express.Router()
const apController = require('../controllers/apController')

router.get('/apLogin', apController.login_get)
router.post('/apLogin', apController.login_post)
router.get('/apLogout', apController.logout)
router.get('/apRegister', apController.register_get)
router.post('/apRegister', apController.register_post)


module.exports = router;