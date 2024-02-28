const express = require('express')
const router = express.Router()
const {
  registerVol,
  loginVol,
  getMe,
} = require('../controllers/volunteerController')

const { protect } = require('../middleware/volunteerMiddleware')

router.post('/', registerVol)
router.post('/login', loginVol)
router.get('/me', protect, getMe)

module.exports = router