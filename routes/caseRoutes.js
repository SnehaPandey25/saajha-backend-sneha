const express = require('express')
const router = express.Router()
const {
  registerCase,
  loginCase,
  getMe,
  getCases,
  getCase,
  updateCase
} = require('../controllers/caseController')

const { counsellorprotect } = require('../middleware/counsellorMiddleware')
const { caseprotect } = require('../middleware/caseMiddleware')

router.post('/',counsellorprotect, registerCase)
router.post('/login', loginCase)
router.get('/me', caseprotect, getMe)
router.get('/all',getCases)
router
  .route('/:id')
  .get(counsellorprotect, getCase)
router.route('/updateCase/:id').put(counsellorprotect, updateCase);



module.exports = router