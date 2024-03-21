const express = require('express')
const router = express.Router()
const {
  registerCase,
  loginCase,
  getMe,
  getCases,
  getCase,
  updateCase,
  addRemarks,  //Version 3
  viewRemarks, //Version 3
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
//Version 3
router.route('/remarks/:id').put(counsellorprotect, addRemarks);
router.route('/viewRemarks/:id').get(caseprotect, viewRemarks);



module.exports = router