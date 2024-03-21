const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Counsellor = require('../models/counsellorModel')

// @desc    Register a new counsellor
// @route   /api/counsellor
// @access  Public
const registerCounsellor = asyncHandler(async (req, res) => {
  const { name, email, password, certification, dob, specialisation, gender } = req.body

  // Validation
  if (!name || !email || !password || !certification || !dob || !specialisation || !gender) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  // Find if counsellor already exists
  const counsellorExists = await Counsellor.findOne({ email })

  if (counsellorExists) {
    res.status(400)
    throw new Error('Counsellor already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create counsellor
  const counsellor = await Counsellor.create({
    name,
    email,
    password: hashedPassword,
    certification, 
    dob, 
    specialisation, 
    gender,
    admin: req.admin.id,
  })

  if (counsellor) {
    res.status(201).json({
      _id: counsellor._id,
      name: counsellor.name,
      email: counsellor.email,
      certification: counsellor.certification,
      dob: counsellor.dob,
      specialisation: counsellor.specialisation,
      gender: counsellor.gender,
      token: generateToken(counsellor._id),
      admin: req.admin.id,
    })
  } else {
    res.status(400)
    throw new error('Invalid counsellor data')
  }
})

// @desc    Login a counsellor
// @route   /api/counsellor/login
// @access  Public
const loginCounsellor = asyncHandler(async (req, res) => {
  const { email, password, key } = req.body

  const counsellor = await Counsellor.findOne({ email })

  
  
  // Check admin,key and passwords match
  if ( counsellor && (await bcrypt.compare(password,  counsellor.password)) && String(key) === String( counsellor._id))  {
    res.status(200).json({
      _id:  counsellor._id,
      name:  counsellor.name,
      email:  counsellor.email,
    })
  } else {
    res.status(401)
    throw new Error('Invalid credentials')
    
  }
})

// @desc    Get current counsellor
// @route   /api/counsellor/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const counsellor = {
    id: req. counsellor._id,
    email: req. counsellor.email,
    name: req. counsellor.name,
    certification: req.counsellor.certification,
    dob: req.counsellor.dob,
    specialisation: req.counsellor.specialisation,
    gender: req.counsellor.gender,
  }
  res.status(200).json(counsellor)
})

//Version 3
// @desc    Get all Counsellor
// @route   GET /api/counsellor/adminView/:id
// @access  Private
const getCounsellors = asyncHandler(async (req, res) => {
  const counsellors = await Counsellor.find();
  
  const authorizedCounsellors = counsellors.filter(counsellor => {
    return counsellor.admin.toString() === req.admin.id;
  });

  if (authorizedCounsellors.length === 0) {
    res.status(401);
    throw new Error('Not Authorized');
  }

  res.status(200).json(authorizedCounsellors);
});

// Version 3
// @desc    Update Counsellor
// @route   PUT /api/counsellor/updateCounsellor/:id
// @access  Private
const updateCounsellor = asyncHandler(async (req, res) => {
  const counsellor = await Counsellor.findById(req.params.id);

  if (!counsellor) {
    res.status(404);
    throw new Error('Counsellor not found');
  }

  if (counsellor.id !== req.counsellor.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }

  // Create a filter object using the counsellor's ID
  const filter = { _id: req.params.id };

  // Create an update object with all the fields
  const update = { 
    certification: req.counsellor.certification,
    specialisation: req.counsellor.specialisation
    };
  
    for (const key in req.body) {
      if (req.body[key]) {
        update[key] = req.body[key];
      }
    }
  
      // Use findOneAndUpdate to update the Counsellor and return the updated document
  const updatedCounsellor = await Counsellor.findOneAndUpdate(filter, update, { new: true });

  if (updatedCounsellor) {
    // Check if any fields were updated
    const fieldsUpdated = Object.keys(update).some(key => updatedCounsellor[key] !== counsellor[key]);

    if (fieldsUpdated) {
      // Counsellor was updated successfully
      res.status(200).json({ success: true, message: 'Counsellor updated', data: updatedCounsellor });
    } else {
      // No fields were updated
      res.status(200).json({ success: true, message: 'No changes made to the Counsellor' });
    }
  }
});


// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '100d',
  })
}

module.exports = {
  registerCounsellor,
  loginCounsellor,
  getMe,
  //Version 3
  getCounsellors,
  updateCounsellor,
}