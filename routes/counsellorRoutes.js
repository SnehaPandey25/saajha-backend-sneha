const express = require('express')
const router = express.Router()
const {
  registerCounsellor,
  loginCounsellor,
  getMe,
} = require('../controllers/counsellorController')

const { counsellorprotect } = require('../middleware/counsellorMiddleware')
const { adminprotect } = require('../middleware/adminMiddleware')

router.post('/',adminprotect, registerCounsellor)

router.post('/login', loginCounsellor)
router.get('/me', counsellorprotect, getMe)

module.exports = router