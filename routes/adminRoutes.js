const express = require('express')
const router = express.Router()
const {
  registerAdmin,
  loginAdmin,
  getAdmin,
} = require('../controllers/adminController')

 
const { adminprotect } = require('../middleware/adminMiddleware')

router.post('/', registerAdmin)
router.post('/login', loginAdmin)
router.get('/me', adminprotect, getAdmin)


module.exports = router