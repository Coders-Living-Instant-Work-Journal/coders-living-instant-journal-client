require('dotenv').config()
const { PORT } = process.env

// start express server
const app = require('./src/app')
app.start(PORT)
