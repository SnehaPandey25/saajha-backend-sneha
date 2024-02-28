const asyncHandler = require('express-async-handler')

const NGO = require('../models/ngoModel')


// @desc    Get all NGOs
// @route   GET /api/ngos
// @access  Public
const getNGOs = asyncHandler(async (req, res) => {
  const ngos = await NGO.find()

  res.status(200).json(ngos)
})

// @desc    Get NGO by Id
// @route   GET /api/ngos/:id
// @access  Private
const getNGO = asyncHandler(async (req, res) => {
  const ngo = await NGO.findById(req.params.id)

  if (!ngo) {
    res.status(404)
    throw new Error('NGO not found')
  }

  if (ngo.admin.toString() !== req.admin.id) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  res.status(200).json(ngo)
})

// @desc    Add new NGO
// @route   POST /api/ngos
// @access  Private
const addNGO = asyncHandler(async (req, res) => {
  const { name,location, image, employeeCount, services, website, phoneNo, email } = req.body

  if (!name || !location || !services || !phoneNo ) {
    res.status(400)
    throw new Error('Please add name,location,services and phoneNo')
  }

  const ngo = await NGO.create({
    name,
    location,
    image,employeeCount, services, website, phoneNo, email,
    admin: req.admin.id,

  })

  res.status(200).json(ngo)
})

// @desc    Delete NGO
// @route   DELETE /api/ngos/:id
// @access  Private
const deleteNGO = asyncHandler(async (req, res) => {
  try {
    const deletedNGO = await NGO.findByIdAndDelete(req.params.id);

    if (!deletedNGO) {
      // If the document was not found, return a 404 status code
      return res.status(404).json({
        status: 'Not Found',
        message: 'NGO not found',
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



// @desc    Update NGO
// @route   PUT /api/ngos/updateNGO/:id
// @access  Private
const updateNGO = asyncHandler(async (req, res) => {
  const ngo = await NGO.findById(req.params.id);

  if (!ngo) {
    res.status(404);
    throw new Error('NGO not found');
  }

  if (ngo.admin.toString() !== req.admin.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }

  // Create a filter object using the ngo's ID
  const filter = { _id: req.params.id };

  // Create an update object with all the fields
  const update = { name: req.body.name,
    location: req.body.location,
    image: req.body.image,
    employeeCount: req.body.employeeCount,
    services: req.body.services,
    website: req.body.website,
    phoneNo: req.body.phoneNo,
    emailNGO: req.body.emailNGO };
  
    for (const key in req.body) {
      if (req.body[key]) {
        update[key] = req.body[key];
      }
    }
  
      // Use findOneAndUpdate to update the NGO and return the updated document
  const updatedNGO = await NGO.findOneAndUpdate(filter, update, { new: true });

  if (updatedNGO) {
    // Check if any fields were updated
    const fieldsUpdated = Object.keys(update).some(key => updatedNGO[key] !== ngo[key]);

    if (fieldsUpdated) {
      // NGO was updated successfully
      res.status(200).json({ success: true, message: 'NGO updated', data: updatedNGO });
    } else {
      // No fields were updated
      res.status(200).json({ success: true, message: 'No changes made to the NGO' });
    }
  }
});

module.exports = {
  getNGOs,
  getNGO,
  addNGO,
  deleteNGO,
  updateNGO,
}