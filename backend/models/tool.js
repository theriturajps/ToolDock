const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tool title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    validate: {
      validator: function(v) {
        return v === '' || /^https?:\/\//.test(v);
      },
      message: 'Website must be a valid URL'
    }
  },
  sourceCode: {
    type: String,
    validate: {
      validator: function(v) {
        return v === '' || /^https?:\/\//.test(v);
      },
      message: 'Source code URL must be a valid URL'
    }
  },
  platforms: {
    type: String,
    required: [true, 'Platforms are required'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  published: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Tool = mongoose.model('Tool', toolSchema);
module.exports = Tool;