const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')

// Route files
const bootcamps = require('./routes/bootcamps')

// Load env variables
dotenv.config({ path: './config/config.env' })

const app = express()

// dev logging middlewarif ()
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT || 6010

app.listen(
  PORT, 
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.brightMagenta.bold
  )
)
