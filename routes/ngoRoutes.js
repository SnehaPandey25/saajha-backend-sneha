const express = require('express')
const router = express.Router()
const {
  getNGOs,
  addNGO,
  getNGO,
  deleteNGO,
  updateNGO
} = require('../controllers/ngoController')

const { adminprotect } = require('../middleware/adminMiddleware')

router.get('/',getNGOs)
router.route('/').post(adminprotect, addNGO)

router
  .route('/:id')
  .get(adminprotect, getNGO)
  .delete(adminprotect, deleteNGO)

router.route('/updateNGO/:id').put(adminprotect, updateNGO);


module.exports = router