const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Case = require('../models/caseModel')

// @desc    Login a case
// @route   /api/case/login
// @access  Public
const loginCase = asyncHandler(async (req, res) => {
  const { email, password, key } = req.body

  const cases = await Case.findOne({ email })

  
  // Check case,key and passwords match
  if ( cases && (await bcrypt.compare(password,  cases.password)) && String(key) === String( cases._id))  {
    res.status(200).json({
      _id: cases._id,
      name: cases.name,
      email: cases.email,
    })
  } else {
    res.status(401)
    throw new Error('Invalid credentials')
    
  }
})

// @desc    Get current case
// @route   /api/case/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const cases = {
    id: req. cases._id,
    email: req. cases.email,
    name: req. cases.name,
    disability: req.cases.disability,
    dob: req.cases.dob,
    medicalHistory: req.cases.medicalHistory,
    gender: req.cases.gender,
    guardianName: req.cases.guardianName,
    guardianPhone: req.cases.guardianPhone,
    remarks: req.cases.remarks,
  }
  res.status(200).json(cases)
})

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '100d',
  })
}

// @desc    Register a new case
// @route   /api/registerCase
// @access  Public
const registerCase = asyncHandler(async (req, res) => {
  const { name, email, password, disability, guardianName, guardianPhone, dob, developmentalMilestone, gender, presentComplaints, remarks } = req.body

  // Validation
  if (!name || !email || !password || !guardianName || !guardianPhone || !dob  || !gender ) {
    res.status(400)
    throw new Error('Please include all required fields')
  }

  // Find if case already exists
  const caseExists = await Case.findOne({ email })

  if (caseExists) {
    res.status(400)
    throw new Error('Case already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create case
  const cases = await Case.create({
    name, 
    email, 
    password: hashedPassword, 
    disability, 
    guardianName, 
    guardianPhone, 
    dob, 
    developmentalMilestone, 
    gender,
    presentComplaints, 
    remarks,
    counsellor: req.counsellor.id,
  })

  if (cases) {
    res.status(201).json({
      _id: cases._id,
      name: cases.name,
      email: cases.email,
      disability: cases.disability, 
      guardianName: cases.guardianName, 
      guardianPhone: cases.guardianPhone,
      dob: cases.dob,
      developmentalMilestone: cases.developmentalMilestone,
      gender: cases.gender,
      presentComplaints: cases.presentComplaints,
      remarks: cases.remarks,
      token: generateToken(cases._id),
      counsellor: req.counsellor.id,
    })
  } else {
    res.status(400)
    throw new error('Invalid case data')
  }
})

// @desc    Get all cases
// @route   GET /api/case/all
// @access  Public
const getCases = asyncHandler(async (req, res) => {
  const cases = await Case.find()

  res.status(200).json(cases)
})

// @desc    Get case by Id
// @route   GET /api/case/:id
// @access  Private
const getCase = asyncHandler(async (req, res) => {
  const casee = await Case.findById(req.params.id)

  if (!casee) {
    res.status(404)
    throw new Error('Case not found')
  }

  if (casee.counsellor.toString() !== req.counsellor.id) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  res.status(200).json(casee)
})

// @desc    Update Case
// @route   PUT /api/case/updateCase/:id
// @access  Private
const updateCase = asyncHandler(async (req, res) => {
  const casee = await Case.findById(req.params.id);

  if (!casee) {
    res.status(404);
    throw new Error('Case not found');
  }

  if (casee.counsellor.toString() !== req.counsellor.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }

  // Create a filter object using the case's ID
  const filter = { _id: req.params.id };

  // Create an update object with all the fields
  const update = { name: req.body.name,
    gender: req.body.gender,
    dob: req.body.dob,
    disability: req.body.disability,
    guardianName: req.body.guardianName,
    guardianPhone: req.body.guardianPhone,
    developmentalMilestone: req.body.developmentalMilestone,
    email: req.body.email,
    presentComplaints: req.body.presentComplaints,
    remarks: req.body.remarks, };
  
    for (const key in req.body) {
      if (req.body[key]) {
        update[key] = req.body[key];
      }
    }
  
      // Use findOneAndUpdate to update the Case and return the updated document
  const updatedCase = await Case.findOneAndUpdate(filter, update, { new: true });

  if (updatedCase) {
    // Check if any fields were updated
    const fieldsUpdated = Object.keys(update).some(key => updatedCase[key] !== casee[key]);

    if (fieldsUpdated) {
      // Case was updated successfully
      res.status(200).json({ success: true, message: 'Case updated', data: updatedCase });
    } else {
      // No fields were updated
      res.status(200).json({ success: true, message: 'No changes made to the Case' });
    }
  }
});

module.exports = {
  loginCase,
  getMe,
  registerCase,
  getCases,
  getCase,
  updateCase,
}