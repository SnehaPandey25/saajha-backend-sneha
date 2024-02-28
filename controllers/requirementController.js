const asyncHandler = require('express-async-handler')

const Requirement = require('../models/requirementModel')


// @desc    Get requirement by Id
// @route   GET /api/requirement/:id
// @access  Public
const getRequirement = asyncHandler(async (req, res) => {
  const requirement = await Requirement.findById(req.params.id)

  if (!requirement) {
    res.status(404)
    throw new Error('Requirement not found')
  }

  res.status(200).json(requirement)
})

// @desc    Add new requirements
// @route   POST /api/requirement
// @access  Private
const addRequirements = asyncHandler(async (req, res) => {
  const { requirements } = req.body

  if (!requirements ) {
    res.status(400)
    throw new Error('Please add requirements')
  }

  const requirement = await Requirement.create({
    requirements,
    admin: req.admin.id,

  })

  res.status(200).json(requirement)
})

// @desc    Delete Requirement
// @route   DELETE /api/requirement/:id
// @access  Private
const deleteRequirement = asyncHandler(async (req, res) => {
  try {
    const deletedRequirement = await Requirement.findByIdAndDelete(req.params.id);

    if (!deletedRequirement) {
      // If the document was not found, return a 404 status code
      return res.status(404).json({
        status: 'Not Found',
        message: 'Requirement not found',
      });
    }

    res.status(204).json({
      status: 'Success',
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      status: 'Failed',
      message: err.message,
    });
  }
});


module.exports = {
  getRequirement,
  addRequirements,
  deleteRequirement,
}