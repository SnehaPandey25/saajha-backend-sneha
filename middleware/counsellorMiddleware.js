const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Counsellor = require('../models/counsellorModel')

const counsellorprotect = asyncHandler(async (req, res, next) => {
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
      // Get counsellor from token
      req.counsellor = await Counsellor.findById(decoded.id).select('-password')

      if (!req.counsellor) {
        res.status(401)
        throw new Error('Not authorized') //Version 3
      }

      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')  //Version 3
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized')  //Version 3
  }
})

module.exports = { counsellorprotect }