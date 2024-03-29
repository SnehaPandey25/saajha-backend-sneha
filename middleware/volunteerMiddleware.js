const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Volunteer = require('../models/volunteerModel')

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      // Get volunteer from token
      req.vol = await Volunteer.findById(decoded.id).select('-password')

      if (!req.vol) {
        res.status(401)
        throw new Error('Not authorized')
      }

      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized')
  }
})

module.exports = { protect }