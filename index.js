require('dotenv').config()

const port = process.env.API_PORT || 9999
const initMongoDB = require('./mongodb-server')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

// Middleware
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes/Controllers
const productsController = require('./controllers/productsController')
app.use('/api/products', productsController)
app.use('/api/authentication', require('./controllers/authenticationController'))

// Initialize
initMongoDB()
app.listen(port, () => console.log(`webApi is running on http://localhost:${port}`))