const express = require('express')
const router = express.Router()
const {
    getRequirement, 
    addRequirements,
    deleteRequirement,
} = require('../controllers/requirementController')

 
const { adminprotect } = require('../middleware/adminMiddleware')

router.route('/').post(adminprotect,addRequirements)

router
  .route('/:id')
  .get(getRequirement)
  .delete(adminprotect, deleteRequirement)
 




module.exports = router