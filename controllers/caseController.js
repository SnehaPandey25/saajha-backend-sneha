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

  
  // Check case, and passwords match
  if ( cases && (await bcrypt.compare(password,  cases.password)))  {
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
    dob: req.cases.dob,
    developmentalHistory: req.cases.developmentalHistory,
    gender: req.cases.gender,
    guardianName: req.cases.guardianName,
    guardianPhone: req.cases.guardianPhone,
    advice: req.cases.advice,
    previousDiagnosis: req.cases.previousDiagnosis,
    currentDiagnosis: req.cases.currentDiagnosis,
    clinicalObservation: req.cases.clinicalObservation,
    suggestedInvestigationType: req.cases.suggestedInvestigationType,
    diagnosticTest: req.cases.diagnosticTest,
    testResults: req.cases.testResults,
    report: req.cases.report,
    presentComplaints: req.cases.presentComplaints,
    SuggestionsForFurtherInvestigation: req.cases.SuggestionsForFurtherInvestigation,
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
  const { name, email, password, guardianName, guardianPhone,
     dob, developmentalHistory, gender, presentComplaints, advice, previousDiagnosis,
     currentDiagnosis, clinicalObservation, suggestedInvestigationType, diagnosticTest,
     testResults, report, SuggestionsForFurtherInvestigation} = req.body

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
    guardianName, 
    guardianPhone, 
    dob, 
    developmentalHistory, 
    gender,
    presentComplaints, 
    advice,
    counsellor: req.counsellor.id,
    previousDiagnosis,
    currentDiagnosis, 
    clinicalObservation, 
    suggestedInvestigationType, 
    diagnosticTest, 
    testResults, 
    report, 
    SuggestionsForFurtherInvestigation,
  })

  if (cases) {
    res.status(201).json({
      _id: cases._id,
      name: cases.name,
      email: cases.email, 
      guardianName: cases.guardianName, 
      guardianPhone: cases.guardianPhone,
      dob: cases.dob,
      developmentalHistory: cases.developmentalHistory,
      gender: cases.gender,
      presentComplaints: cases.presentComplaints,
      advice: cases.advice,
      previousDiagnosis: cases.previousDiagnosis,
      currentDiagnosis: cases.currentDiagnosis,
      clinicalObservation: cases.clinicalObservation,
      suggestedInvestigationType: cases.suggestedInvestigationType,
      diagnosticTest: cases.diagnosticTest,
      testResults: cases.testResults,
      report: cases.report,
      SuggestionsForFurtherInvestigation: cases.SuggestionsForFurtherInvestigation,
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
    guardianName: req.body.guardianName,
    guardianPhone: req.body.guardianPhone,
    email: req.body.email,
    };
  
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

// @desc    Add remarks
// @route   POST /api/case/remarks/:id
// @access  Private
const addRemarks = asyncHandler(async (req, res) => {
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
  const remarks = { 
    developmentalHistory: req.body.developmentalHistory,
    presentComplaints: req.body.presentComplaints,
    advice: req.body.advice, 
    previousDiagnosis: req.body.previousDiagnosis,
    currentDiagnosis: req.body.currentDiagnosis,
    clinicalObservation: req.body.clinicalObservation,
    suggestedInvestigationType: req.body.suggestedInvestigationType,
    diagnosticTest: req.body.diagnosticTest,
    testResults: req.body.testResults,
    report: req.body.report,
    SuggestionsForFurtherInvestigation: req.body.SuggestionsForFurtherInvestigation,};
  
    for (const key in req.body) {
      if (req.body[key]) {
        remarks[key] = req.body[key];
      }
    }
  
      // Use findOneAndUpdate to update the Case and return the updated document
  const addRemarks = await Case.findOneAndUpdate(filter, remarks, { new: true });

  if (addRemarks) {
    // Check if any fields were updated
    const fieldsUpdated = Object.keys(remarks).some(key => addRemarks[key] !== casee[key]);

    if (fieldsUpdated) {
      // Case was updated successfully
      res.status(200).json({ success: true, message: 'Remarks added', data: addRemarks });
    } else {
      // No fields were updated
      res.status(200).json({ success: true, message: 'No new remarks' });
    }
  }
});

// @desc    View assigned counsellor and remarks by case ID
// @route   GET /api/case/viewRemarks/:id
// @access  Private
const viewRemarks = asyncHandler(async (req, res) => {
  const casee = await Case.findById(req.params.id).populate('counsellor');
  if (!casee) {
    res.status(404)
    throw new Error('Case not found')
  }

  if (casee.id !== req.cases.id) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  const response = {
    counsellorName: casee.counsellor.name,
    developmentalHistory: casee.developmentalHistory,
    presentComplaints: casee.presentComplaints,
    advice: casee.advice,
    previousDiagnosis: casee.previousDiagnosis,
    currentDiagnosis: casee.currentDiagnosis,
    clinicalObservation: casee.clinicalObservation,
    suggestedInvestigationType: casee.suggestedInvestigationType,
    diagnosticTest: casee.diagnosticTest,
    testResults: casee.testResults,
    report: casee.report,
    SuggestionsForFurtherInvestigation: casee.SuggestionsForFurtherInvestigation,
  };

  res.status(200).json(response)
})

module.exports = {
  loginCase,
  getMe,
  registerCase,
  getCases,
  getCase,
  updateCase,
  addRemarks,
  viewRemarks,
}