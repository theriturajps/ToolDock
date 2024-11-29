const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const router = express.Router()

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })
}

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, name, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Username or email already exists',
      })
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      name,
      role: role || 'user',
    })

    // Generate token
    const token = signToken(newUser._id)

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    })
  }
})

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { loginIdentifier, password } = req.body

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: loginIdentifier }, { email: loginIdentifier }],
    }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect username/email or password',
      })
    }

    // Generate token
    const token = signToken(user._id)

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    })
  }
})

module.exports = router
