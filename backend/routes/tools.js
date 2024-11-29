const express = require('express')
const Tool = require('../models/tool')
const { protect, restrictTo } = require('../middleware/auth')

const router = express.Router()

// Create a new tool
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, website, sourceCode, platforms } = req.body

    const newTool = await Tool.create({
      title,
      description,
      website,
      sourceCode,
      platforms,
      author: req.user._id,
    })

    res.status(201).json({
      status: 'success',
      data: { tool: newTool },
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    })
  }
})

// Get all tools with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = 9 // 9 tools per page
    const skip = (page - 1) * limit
    const searchQuery = req.query.search || ''

    const searchCondition = {
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { platforms: { $regex: searchQuery, $options: 'i' } },
      ],
    }

    const tools = await Tool.find(searchCondition)
      .populate('author', 'username')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const totalTools = await Tool.countDocuments(searchCondition)

    res.status(200).json({
      status: 'success',
      results: tools.length,
      totalPages: Math.ceil(totalTools / limit),
      currentPage: page,
      data: { tools },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    })
  }
})

// Update a tool (only by author or admin)
router.patch('/:id', protect, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id)

    if (!tool) {
      return res.status(404).json({
        status: 'error',
        message: 'Tool not found',
      })
    }

    // Check if user is author or admin
    if (
      tool.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this tool',
      })
    }

    const updatedTool = await Tool.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: 'success',
      data: { tool: updatedTool },
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    })
  }
})

// Delete a tool (only by author or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id)

    if (!tool) {
      return res.status(404).json({
        status: 'error',
        message: 'Tool not found',
      })
    }

    // Check if user is author or admin
    if (
      tool.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this tool',
      })
    }

    await Tool.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    })
  }
})

module.exports = router
