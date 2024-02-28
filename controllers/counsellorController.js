const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Counsellor = require('../models/counsellorModel')

// @desc    Register a new counsellor
// @route   /api/counsellor
// @access  Public
const registerCounsellor = asyncHandler(async (req, res) => {
  const { name, email, password, certification, dob, specialisation, gender, NGOid } = req.body

  // Validation
  if (!name || !email || !password || !certification || !dob || !specialisation || !gender || !NGOid ) {
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
    NGOid,
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
      NGOid: counsellor.NGOid,
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
    NGOid: req.counsellor.NGOid,
  }
  res.status(200).json(counsellor)
})

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
}