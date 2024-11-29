const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend')))


// Database Connection
mongoose.set('strictQuery', true)
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err))

// Routes
const authRoutes = require('./routes/auth')
const toolRoutes = require('./routes/tools')

app.use('/api/auth', authRoutes)
app.use('/api/tools', toolRoutes)

// Global Error Handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  })
})

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'))
})

// Start Server
const PORT = process.env.PORT || Math.trunc(Math.random() * 10000)
app.listen(PORT, () => {
  console.log(`Server running on port "http://127.0.0.1:${PORT}"`)
})
