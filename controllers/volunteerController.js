const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Volunteer = require('../models/volunteerModel')

// @desc    Register a new volunteer
// @route   /api/volunteer
// @access  Public
const registerVol = asyncHandler(async (req, res) => {
  const { name, email, password, dob } = req.body

  // Validation
  if (!name || !email || !password || !dob) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  // Find if volunteer already exists
  const volExists = await Volunteer.findOne({ email })

  if (volExists) {
    res.status(400)
    throw new Error('Volunteer already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create volunteer
  const vol = await Volunteer.create({
    name,
    email,
    dob,
    password: hashedPassword,
  })

  if (vol) {
    res.status(201).json({
      _id: vol._id,
      name: vol.name,
      email: vol.email,
      dob: vol.dob,
      token: generateToken(vol._id),
    })
  } else {
    res.status(400)
    throw new error('Invalid volunteer data')
  }
})

// @desc    Login a volunteer
// @route   /api/volunteer/login
// @access  Public
const loginVol = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const vol = await Volunteer.findOne({ email })

  // Check vol and passwords match
  if (vol && (await bcrypt.compare(password, vol.password))) {
    res.status(200).json({
      _id: vol._id,
      name: vol.name,
      email: vol.email,
      dob: vol.dob,
      token: generateToken(vol._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get current vol
// @route   /api/volunteer/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const vol = {
    id: req.vol._id,
    email: req.vol.email,
    name: req.vol.name,
    dob: req.vol.dob,
    age: req.vol.age, // Access the age field
  };
  res.status(200).json(vol);
});

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '100d',
  })
}

module.exports = {
  registerVol,
  loginVol,
  getMe,
}